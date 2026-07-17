'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { companyAction } from '../../../lib/actions/company.action';
import { jobAction } from '../../../lib/actions/job.action';
import { applicationAction } from '../../../lib/actions/application.action';
import { JobResponse } from '../../../lib/types/job.types';
import { EmployerApplicant, ApplicationStage, STAGE_LABELS } from '../../../lib/types/application.types';
import { formatRelativeTime } from '../../../lib/utils/job-format';
import AppHeader from '../../components/appheader';
import { offerAction } from '../../../lib/actions/offer.action';
import SendOfferModal from '../../components/sendoffer/page';

const TABS: { stage: ApplicationStage | 'all'; label: string }[] = [
  { stage: 'all', label: 'All' },
  { stage: 'applied', label: 'New' },
  { stage: 'viewed', label: 'Reviewed' },
  { stage: 'shortlisted', label: 'Shortlisted' },
  { stage: 'interview', label: 'Interview' },
  { stage: 'offer', label: 'Offer' },
  { stage: 'hired', label: 'Hired' },
  { stage: 'rejected', label: 'Rejected' },
];

function initialsOf(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function stageColor(stage: ApplicationStage): string {
  switch (stage) {
    case 'shortlisted':
    case 'hired':
      return 'bg-emerald-50 text-emerald-700';
    case 'interview':
    case 'offer':
      return 'bg-[#F0ECFF] text-[#6D4AFF]';
    case 'rejected':
      return 'bg-red-50 text-red-600';
    default:
      return 'bg-neutral-100 text-neutral-600';
  }
}

function avatarTone(index: number) {
  const tones = ['bg-[#F0ECFF] text-[#6D4AFF]', 'bg-emerald-50 text-emerald-700', 'bg-amber-50 text-amber-700'];
  return tones[index % tones.length];
}

export default function ApplicantsListPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<EmployerApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStageId, setUpdatingStageId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ApplicationStage | 'all'>('all');
  const [search, setSearch] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'best_fit' | 'newest'>('best_fit');
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Load employer's jobs once
  useEffect(() => {
    (async () => {
      const companyResult = await companyAction.getMyCompany();
      if (!companyResult.success) {
        setError(companyResult.message);
        setLoading(false);
        return;
      }
      const jobsResult = await jobAction.listByCompany(companyResult.data.companyId);
      if (jobsResult.success) {
        setJobs(jobsResult.data);
        if (jobsResult.data.length > 0) setSelectedJobId(jobsResult.data[0].id);
      }
      setLoading(false);
    })();
  }, []);

  // Load applicants whenever the selected job changes
  useEffect(() => {
    if (!selectedJobId) return;
    setLoading(true);
    (async () => {
      const result = await applicationAction.getApplicantsForJob(selectedJobId);
      if (result.success) {
        setApplicants(result.data);
        setSelectedApplicantId(result.data[0]?.applicationId ?? null);
      } else {
        setError(result.message);
      }
      setLoading(false);
    })();
  }, [selectedJobId]);

  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null;

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: applicants.length };
    for (const tab of TABS) {
      if (tab.stage === 'all') continue;
      counts[tab.stage] = applicants.filter((a) => a.stage === tab.stage).length;
    }
    return counts;
  }, [applicants]);

  const visibleApplicants = useMemo(() => {
    let list = applicants;
    if (activeTab !== 'all') list = list.filter((a) => a.stage === activeTab);
    if (verifiedOnly) list = list.filter((a) => a.verified);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.fullName.toLowerCase().includes(q) ||
          a.headline.toLowerCase().includes(q) ||
          a.topSkills.some((s) => s.toLowerCase().includes(q))
      );
    }
    const sorted = [...list];
    if (sortBy === 'best_fit') sorted.sort((a, b) => b.fitScore - a.fitScore);
    else sorted.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
    return sorted;
  }, [applicants, activeTab, verifiedOnly, search, sortBy]);

  const selectedApplicant = applicants.find((a) => a.applicationId === selectedApplicantId) ?? null;

  const handleStageChange = async (applicationId: string, stage: ApplicationStage) => {
    setUpdatingStageId(applicationId);
    const result = await applicationAction.updateStage(applicationId, stage);
    if (result.success) {
      setApplicants((prev) => prev.map((a) => (a.applicationId === applicationId ? result.data : a)));
    }
    setUpdatingStageId(null);
  };

  const skillMatch = (applicant: EmployerApplicant) => {
    if (!selectedJob) return applicant.topSkills.map((s) => ({ label: s, matched: false }));
    const requiredLower = selectedJob.skills.map((s) => s.toLowerCase());
    return applicant.topSkills.map((skill) => ({
      label: skill,
      matched: requiredLower.some((req) => req.includes(skill.toLowerCase()) || skill.toLowerCase().includes(req)),
    }));
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <AppHeader portal="employer" />

      <section className="mx-auto w-full max-w-[1400px] px-6 pt-8 pb-10 lg:px-10">
        {/* Page header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Applicants</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Review, shortlist and hire — every applicant is identity-verified, no fake profiles.
            </p>
          </div>

          {/* Job selector */}
          <select
            value={selectedJobId ?? ''}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="h-10 min-w-[280px] rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-all focus:border-[#6D4AFF] focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
          >
            {jobs.length === 0 && <option value="">No jobs posted</option>}
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>{job.jobTitle}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Job summary card */}
        {selectedJob && (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-bold text-neutral-900">{selectedJob.jobTitle}</span>
                {selectedJob.company.companyVerified && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.59L7 10l-2.41-2.41L5.3 6.88 7 8.59l3.7-3.7.71.7z"/></svg>
                    Verified employer
                  </span>
                )}
                <span className="text-xs text-neutral-500">{selectedJob.location}</span>
                <span className="text-xs text-neutral-500">
                  NPR {selectedJob.salary.min.toLocaleString('en-IN')}–{selectedJob.salary.max.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-xs text-neutral-500">
                {tabCounts.all ?? 0} total · {tabCounts.shortlisted ?? 0} shortlisted · {tabCounts.interview ?? 0} in interview
              </span>
            </div>
          </div>
        )}

        {/* Stage tabs */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.stage}
              type="button"
              onClick={() => setActiveTab(tab.stage)}
              className={`h-8 rounded-lg px-3.5 text-xs font-medium transition-all ${
                activeTab === tab.stage
                  ? 'bg-[#6D4AFF] text-white shadow-sm'
                  : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {tab.label} {tabCounts[tab.stage] ?? 0}
            </button>
          ))}
        </div>

        {/* Main content grid */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
          {/* Left column — applicant list */}
          <div>
            {/* Filters */}
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[280px]">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, skill or headline..."
                  className="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-[#6D4AFF] focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'best_fit' | 'newest')}
                className="h-10 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-600 outline-none transition-all focus:border-[#6D4AFF]"
              >
                <option value="best_fit">Best fit</option>
                <option value="newest">Newest</option>
              </select>
              <button
                type="button"
                onClick={() => setVerifiedOnly((v) => !v)}
                className={`h-10 rounded-xl border px-4 text-sm font-medium transition-all ${
                  verifiedOnly
                    ? 'border-[#6D4AFF] bg-[#F0ECFF] text-[#6D4AFF]'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                Verified only
              </button>
            </div>

            {/* Applicant cards */}
            <div className="space-y-3">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-36 rounded-2xl border border-neutral-200 bg-white animate-pulse" />
                ))
              ) : visibleApplicants.length === 0 ? (
                <div className="rounded-2xl border border-neutral-200 bg-white px-8 py-16 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128H5.228A2 2 0 013 17.208V5.33a2 2 0 012-2h5.333" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-neutral-900">No applicants match these filters</p>
                  <p className="mt-1 text-xs text-neutral-500">Try clearing filters or picking a different job.</p>
                </div>
              ) : (
                visibleApplicants.map((applicant, i) => (
                  <article
                    key={applicant.applicationId}
                    onClick={() => setSelectedApplicantId(applicant.applicationId)}
                    className={`cursor-pointer rounded-2xl border bg-white p-5 transition-all hover:shadow-sm ${
                      selectedApplicantId === applicant.applicationId
                        ? 'border-[#6D4AFF] shadow-[0_0_0_3px_rgba(109,74,255,0.08)]'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`grid h-11 w-11 place-items-center rounded-xl text-sm font-bold flex-shrink-0 ${avatarTone(i)}`}>
                          {initialsOf(applicant.fullName)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">
                            {applicant.fullName}
                            {applicant.verified && (
                              <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600">
                                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.59L7 10l-2.41-2.41L5.3 6.88 7 8.59l3.7-3.7.71.7z"/></svg>
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-neutral-500 max-w-md truncate">{applicant.headline}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-700">
                          {applicant.fitScore}% fit
                        </span>
                        <span className={`rounded-lg px-2.5 py-1 text-[11px] font-medium ${stageColor(applicant.stage)}`}>
                          {STAGE_LABELS[applicant.stage]}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2.5 text-[11px] text-neutral-400">
                      Applied {formatRelativeTime(applicant.appliedAt)}
                    </p>

                    {/* Skills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {skillMatch(applicant).map((skill) => (
                        <span
                          key={skill.label}
                          className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${
                            skill.matched ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          {skill.matched ? '✓' : '✗'} {skill.label}
                        </span>
                      ))}
                    </div>

                    {/* Quick actions */}
                    <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={updatingStageId === applicant.applicationId}
                        onClick={(e) => { e.stopPropagation(); handleStageChange(applicant.applicationId, 'rejected'); }}
                        className="h-8 rounded-lg border border-neutral-200 bg-white px-3.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        disabled={updatingStageId === applicant.applicationId}
                        onClick={(e) => { e.stopPropagation(); handleStageChange(applicant.applicationId, 'shortlisted'); }}
                        className="h-8 rounded-lg border border-neutral-200 bg-white px-3.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                      >
                        Shortlist
                      </button>
                      <button
                        type="button"
                        disabled={updatingStageId === applicant.applicationId}
                        onClick={(e) => { e.stopPropagation(); handleStageChange(applicant.applicationId, 'interview'); }}
                        className="h-8 rounded-lg bg-[#6D4AFF] px-4 text-xs font-bold text-white hover:brightness-95 transition-all disabled:opacity-50"
                      >
                        Invite to interview
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Right column — detail panel */}
          <aside className="rounded-2xl border border-neutral-200 bg-white p-6 h-fit lg:sticky lg:top-20">
            {!selectedApplicant ? (
              <div className="py-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                  </svg>
                </div>
                <p className="text-sm text-neutral-500">Select an applicant to see details.</p>
              </div>
            ) : (
              <>
                {/* Profile header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#F0ECFF] text-base font-bold text-[#6D4AFF] flex-shrink-0">
                      {initialsOf(selectedApplicant.fullName)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{selectedApplicant.fullName}</h3>
                      <p className="text-xs text-neutral-500 max-w-[200px] leading-relaxed">{selectedApplicant.headline}</p>
                    </div>
                  </div>
                  <span className={`rounded-lg px-2.5 py-1 text-[11px] font-medium flex-shrink-0 ${stageColor(selectedApplicant.stage)}`}>
                    {STAGE_LABELS[selectedApplicant.stage]}
                  </span>
                </div>

                {/* Stats grid */}
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-center">
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase">Fit score</p>
                    <p className="mt-1 text-xl font-bold text-neutral-900">{selectedApplicant.fitScore}%</p>
                  </div>
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-center">
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase">Applied</p>
                    <p className="mt-1 text-sm font-bold text-neutral-900">{formatRelativeTime(selectedApplicant.appliedAt)}</p>
                  </div>
                </div>

                {/* Verification */}
                <div className="mt-5 pt-5 border-t border-neutral-100">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Verification</p>
                  <div className="mt-2">
                    {selectedApplicant.verified ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.59L7 10l-2.41-2.41L5.3 6.88 7 8.59l3.7-3.7.71.7z"/></svg>
                        Account verified
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-500">Not verified</span>
                    )}
                  </div>
                </div>

                {/* About */}
                <div className="mt-5 pt-5 border-t border-neutral-100">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">About</p>
                  <p className="mt-2 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-600 leading-relaxed">{selectedApplicant.headline}</p>
                </div>

                {/* Skills */}
                <div className="mt-5 pt-5 border-t border-neutral-100">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Skills Match</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {skillMatch(selectedApplicant).map((skill) => (
                      <span
                        key={skill.label}
                        className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                          skill.matched ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {skill.matched ? '✓' : '✗'} {skill.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-2.5">
                  <button
                    type="button"
                    onClick={async () => {
                      if (selectedApplicant.stage === 'offer' || selectedApplicant.stage === 'hired') {
                        const result = await offerAction.getOfferByApplication(selectedApplicant.applicationId);
                        if (result.success) router.push(`/Features/offer/offernegotiation/${result.data.id}`);
                      } else {
                        setShowOfferModal(true);
                      }
                    }}
                    className="h-10 w-full rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] text-sm font-bold text-white shadow-[0_4px_12px_rgba(109,74,255,0.25)] hover:brightness-95 transition-all"
                  >
                    {selectedApplicant.stage === 'offer' || selectedApplicant.stage === 'hired'
                      ? 'View offer & negotiation'
                      : 'Select & make offer'}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={updatingStageId === selectedApplicant.applicationId}
                      onClick={() => handleStageChange(selectedApplicant.applicationId, 'shortlisted')}
                      className="h-9 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                    >
                      Shortlist
                    </button>
                    <button
                      type="button"
                      disabled={updatingStageId === selectedApplicant.applicationId}
                      onClick={() => handleStageChange(selectedApplicant.applicationId, 'interview')}
                      className="h-9 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                    >
                      Interview
                    </button>
                    <button
                      type="button"
                      disabled={updatingStageId === selectedApplicant.applicationId}
                      onClick={() => handleStageChange(selectedApplicant.applicationId, 'hired')}
                      className="h-9 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                    >
                      Hired
                    </button>
                    <button
                      type="button"
                      disabled={updatingStageId === selectedApplicant.applicationId}
                      onClick={() => handleStageChange(selectedApplicant.applicationId, 'rejected')}
                      className="h-9 rounded-xl border border-red-100 bg-white text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {showOfferModal && (
                  <SendOfferModal
                    applicationId={selectedApplicant.applicationId}
                    candidateName={selectedApplicant.fullName}
                    jobTitle={selectedApplicant.jobTitle}
                    onClose={() => setShowOfferModal(false)}
                  />
                )}
              </>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
