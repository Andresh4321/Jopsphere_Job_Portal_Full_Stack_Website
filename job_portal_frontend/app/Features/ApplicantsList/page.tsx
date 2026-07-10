'use client';

import { useEffect, useMemo, useState } from 'react';
import { companyAction } from '../../../lib/actions/company.action';
import { jobAction } from '../../../lib/actions/job.action';
import { applicationAction } from '../../../lib/actions/application.action';
import { JobResponse } from '../../../lib/types/job.types';
import { EmployerApplicant, ApplicationStage, STAGE_LABELS } from '../../../lib/types/application.types';
import { formatRelativeTime, WORK_TYPE_LABELS } from '../../../lib/utils/job-format';

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

function toneClasses(index: number) {
  const tones = ['bg-[#EDE9FB] text-[#6B5FD6]', 'bg-[#E1F5EE] text-[#0F6E56]', 'bg-[#FAECE7] text-[#993C1D]'];
  return tones[index % tones.length];
}

function stageClasses(stage: ApplicationStage) {
  if (stage === 'shortlisted' || stage === 'hired') return 'bg-[#E8F5EC] text-[#22913A]';
  if (stage === 'interview' || stage === 'offer') return 'bg-[#EDE9FB] text-[#534AB7]';
  if (stage === 'rejected') return 'bg-[#FDECEC] text-[#D93025]';
  return 'bg-[#F7F6F2] text-[#888888]';
}

function initialsOf(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function ApplicantsListPage() {
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
    <main className="min-h-screen bg-[#F0EEE6] pb-6 text-[#1A1A1A]">
      <header className="border-b border-[#C8C6BE]">
        <div className="mx-auto flex h-[60px] w-full max-w-[1400px] items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center bg-[#6B5FD6] text-[17px] font-bold text-white">J</div>
            <h1 className="text-[28px] font-bold">Jopsphere</h1>
          </div>
          <nav className="hidden items-center gap-8 text-[13px] text-[#555555] lg:flex">
            <a href="/Features/find_jobs">Find Jobs</a>
            <a href="/Features/salary_explorer">Salary Explorer</a>
            <a href="#" className="border-b-2 border-[#6B5FD6] pb-4 font-bold text-[#1A1A1A]">Applicants</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1400px] px-8 pt-6">
        <p className="text-[11px] font-bold text-[#888888]">EMPLOYER DASHBOARD</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-bold">Applicants</h2>
            <p className="mt-2 text-[13px] text-[#666666]">
              Review, shortlist and hire — every applicant is identity-verified, no fake profiles.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedJobId ?? ''}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="h-9 min-w-[280px] rounded border border-[#D8D6CE] bg-white px-5 text-left text-[13px] text-[#333333]"
            >
              {jobs.length === 0 && <option value="">No jobs posted</option>}
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>{job.jobTitle}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>
        )}

        {selectedJob && (
          <div className="mt-6 rounded border border-[#E2E0D8] bg-white px-5 py-3 text-[12px]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-[13px] font-bold">{selectedJob.jobTitle}</span>
                {selectedJob.company.companyVerified && <span className="text-[#22913A]">✔ Verified employer</span>}
                <span className="text-[#888888]">📍 {selectedJob.location}</span>
                <span className="text-[#888888]">
                  Salary disclosed: NPR {selectedJob.salary.min.toLocaleString('en-IN')}-{selectedJob.salary.max.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[#888888]">
                {tabCounts.all ?? 0} total · {tabCounts.shortlisted ?? 0} shortlisted · {tabCounts.interview ?? 0} in interview
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.stage}
              type="button"
              onClick={() => setActiveTab(tab.stage)}
              className={`h-7 rounded px-3 text-[12px] transition-colors ${
                activeTab === tab.stage ? 'bg-[#6B5FD6] font-bold text-white' : 'border border-[#E2E0D8] bg-white text-[#555555] hover:bg-[#F7F6F2]'
              }`}
            >
              {tab.label} {tabCounts[tab.stage] ?? 0}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[820px_1fr] xl:grid-cols-[820px_492px]">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 Search by name, skill or headline"
                className="h-9 min-w-[320px] flex-1 rounded border border-[#D8D6CE] bg-white px-5 text-[12px] text-[#333333] outline-none"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'best_fit' | 'newest')}
                className="h-9 min-w-[150px] rounded border border-[#D8D6CE] bg-white px-4 text-[12px] text-[#555555]"
              >
                <option value="best_fit">⇅ Best fit</option>
                <option value="newest">⇅ Newest</option>
              </select>
              <button
                type="button"
                onClick={() => setVerifiedOnly((v) => !v)}
                className={`h-9 rounded border px-4 text-[12px] transition-colors ${
                  verifiedOnly ? 'border-[#6B5FD6] bg-[#EDE9FB] text-[#6B5FD6]' : 'border-[#D8D6CE] bg-white text-[#555555]'
                }`}
              >
                ✔ Verified only
              </button>
            </div>

            <div className="space-y-3">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 rounded border border-[#E2E0D8] bg-white animate-pulse" />
                ))
              ) : visibleApplicants.length === 0 ? (
                <div className="rounded border border-[#E2E0D8] bg-white px-8 py-16 text-center">
                  <p className="text-sm font-bold text-[#1A1A1A]">No applicants match these filters</p>
                  <p className="mt-1 text-xs text-[#888888]">Try clearing filters or picking a different job.</p>
                </div>
              ) : (
                visibleApplicants.map((applicant, i) => (
                  <article
                    key={applicant.applicationId}
                    onClick={() => setSelectedApplicantId(applicant.applicationId)}
                    className={`cursor-pointer rounded border bg-white p-5 transition-colors ${
                      selectedApplicantId === applicant.applicationId ? 'border-2 border-[#6B5FD6]' : 'border-[#E2E0D8] hover:border-[#C8C6BE]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`grid h-11 w-11 place-items-center text-[13px] font-bold ${toneClasses(i)}`}>
                          {initialsOf(applicant.fullName)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1A1A1A]">
                            {applicant.fullName}{' '}
                            {applicant.verified && <span className="ml-1 text-[11px] font-normal text-[#22913A]">✔</span>}
                          </p>
                          <p className="text-xs text-[#666666] max-w-md truncate">{applicant.headline}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span className="rounded border border-[#E2E0D8] bg-[#F7F6F2] px-3 py-1 text-[11px] text-[#444444]">
                          ✦ {applicant.fitScore}% fit
                        </span>
                        <span className={`rounded px-3 py-1 text-[11px] ${stageClasses(applicant.stage)}`}>
                          {STAGE_LABELS[applicant.stage]}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-[11px] text-[#888888]">
                      Applied {formatRelativeTime(applicant.appliedAt)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {skillMatch(applicant).map((skill) => (
                        <span
                          key={skill.label}
                          className={`px-2 py-1 text-[10px] ${skill.matched ? 'bg-[#E8F5EC] text-[#22913A]' : 'bg-[#F1EFE8] text-[#888888]'}`}
                        >
                          {skill.matched ? '✔' : '✗'} {skill.label}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={updatingStageId === applicant.applicationId}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStageChange(applicant.applicationId, 'rejected');
                        }}
                        className="h-7 rounded border border-[#D8D6CE] bg-white px-4 text-[11px] text-[#333333] hover:bg-neutral-50 disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        disabled={updatingStageId === applicant.applicationId}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStageChange(applicant.applicationId, 'shortlisted');
                        }}
                        className="h-7 rounded border border-[#D8D6CE] bg-white px-4 text-[11px] text-[#333333] hover:bg-neutral-50 disabled:opacity-50"
                      >
                        Shortlist
                      </button>
                      <button
                        type="button"
                        disabled={updatingStageId === applicant.applicationId}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStageChange(applicant.applicationId, 'interview');
                        }}
                        className="h-7 rounded bg-[#6B5FD6] px-4 text-[11px] font-bold text-white disabled:opacity-50"
                      >
                        Invite to interview ›
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <aside className="rounded border border-[#E2E0D8] bg-white p-4 h-fit lg:sticky lg:top-6">
            {!selectedApplicant ? (
              <p className="text-sm text-[#888888] text-center py-10">Select an applicant to see details.</p>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-14 w-14 place-items-center bg-[#EDE9FB] text-base font-bold text-[#6B5FD6]">
                      {initialsOf(selectedApplicant.fullName)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{selectedApplicant.fullName}</h3>
                      <p className="text-xs text-[#888888] max-w-[220px]">{selectedApplicant.headline}</p>
                    </div>
                  </div>
                  <span className={`rounded px-3 py-1 text-[11px] ${stageClasses(selectedApplicant.stage)}`}>
                    {STAGE_LABELS[selectedApplicant.stage]}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="border border-[#E2E0D8] bg-[#F7F6F2] px-3 py-2 text-center">
                    <p className="text-[10px] text-[#888888]">Fit score</p>
                    <p className="mt-1 text-base font-bold">{selectedApplicant.fitScore}%</p>
                  </div>
                  <div className="border border-[#E2E0D8] bg-[#F7F6F2] px-3 py-2 text-center">
                    <p className="text-[10px] text-[#888888]">Applied</p>
                    <p className="mt-1 text-base font-bold">{formatRelativeTime(selectedApplicant.appliedAt)}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] font-bold text-[#888888]">VERIFICATION</p>
                  <div className="mt-2 space-y-1 text-[12px]">
                    <p className={selectedApplicant.verified ? 'text-[#22913A]' : 'text-[#888888]'}>
                      {selectedApplicant.verified ? '✔ Account verified' : '✗ Account not verified'}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] font-bold text-[#888888]">ABOUT</p>
                  <p className="mt-2 bg-[#F7F6F2] p-3 text-[11px] text-[#666666]">{selectedApplicant.headline}</p>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] font-bold text-[#888888]">SKILLS MATCH</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                    {skillMatch(selectedApplicant).map((skill) => (
                      <span
                        key={skill.label}
                        className={skill.matched ? 'bg-[#E8F5EC] px-2 py-1 text-[#22913A]' : 'text-[#888888]'}
                      >
                        {skill.matched ? '✔' : '✗'} {skill.label}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={updatingStageId === selectedApplicant.applicationId}
                  onClick={() => handleStageChange(selectedApplicant.applicationId, 'offer')}
                  className="mt-4 h-9 w-full rounded bg-[#6B5FD6] text-[13px] font-bold text-white disabled:opacity-50"
                >
                  ✍ Select & make offer
                </button>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={updatingStageId === selectedApplicant.applicationId}
                    onClick={() => handleStageChange(selectedApplicant.applicationId, 'shortlisted')}
                    className="h-8 rounded border border-[#D8D6CE] bg-white text-[12px] text-[#333333] disabled:opacity-50"
                  >
                    Shortlist
                  </button>
                  <button
                    type="button"
                    disabled={updatingStageId === selectedApplicant.applicationId}
                    onClick={() => handleStageChange(selectedApplicant.applicationId, 'interview')}
                    className="h-8 rounded border border-[#D8D6CE] bg-white text-[12px] text-[#333333] disabled:opacity-50"
                  >
                    Interview
                  </button>
                  <button
                    type="button"
                    disabled={updatingStageId === selectedApplicant.applicationId}
                    onClick={() => handleStageChange(selectedApplicant.applicationId, 'hired')}
                    className="h-8 rounded border border-[#D8D6CE] bg-white text-[12px] text-[#333333] disabled:opacity-50"
                  >
                    Hired
                  </button>
                  <button
                    type="button"
                    disabled={updatingStageId === selectedApplicant.applicationId}
                    onClick={() => handleStageChange(selectedApplicant.applicationId, 'rejected')}
                    className="h-8 rounded border border-[#D8D6CE] bg-white text-[12px] text-[#333333] disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}