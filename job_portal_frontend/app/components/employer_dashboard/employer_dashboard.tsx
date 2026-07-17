'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobAction } from '../../../lib/actions/job.action';
import { companyAction } from '../../../lib/actions/company.action';
import { applicationAction } from '../../../lib/actions/application.action';
import { JobResponse } from '../../../lib/types/job.types';
import { MyCompany } from '../../../lib/types/company.types';
import { EmployerApplicant, StageCounts, STAGE_LABELS } from '../../../lib/types/application.types';
import { WORK_TYPE_LABELS, formatRelativeTime } from '../../../lib/utils/job-format';

const PIPELINE_STAGES: (keyof Omit<StageCounts, 'all'>)[] = [
  'applied', 'viewed', 'shortlisted', 'interview', 'offer', 'hired', 'rejected',
];

// ---- Stage badge colors (matches mockup: New=neutral, Interview=amber, Shortlisted=green, Rejected=red) ----
const STAGE_BADGE_STYLES: Record<string, string> = {
  applied: 'bg-neutral-100 text-neutral-700',
  viewed: 'bg-sky-50 text-sky-700',
  shortlisted: 'bg-emerald-50 text-emerald-700',
  interview: 'bg-amber-50 text-amber-700',
  offer: 'bg-violet-50 text-violet-700',
  hired: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-50 text-red-700',
};

const PIPELINE_ACCENTS: Record<string, string> = {
  applied: 'bg-neutral-300',
  viewed: 'bg-sky-300',
  shortlisted: 'bg-emerald-300',
  interview: 'bg-amber-300',
  offer: 'bg-violet-300',
  hired: 'bg-emerald-400',
  rejected: 'bg-red-300',
};

const AVATAR_PALETTE = [
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
];

function StatCard({
  label,
  value,
  subtext,
  loading,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  loading?: boolean;
}) {
  return (
    <div className="flex-1 min-w-[180px] bg-white border border-neutral-200/80 rounded-xl px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <p className="text-[11px] font-semibold text-neutral-500 tracking-wider">{label.toUpperCase()}</p>
      {loading ? (
        <div className="mt-3 h-7 w-12 rounded bg-neutral-100 animate-pulse" />
      ) : (
        <>
          <p className="mt-1.5 text-[26px] leading-tight text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
            {value}
          </p>
          {subtext && <p className="mt-1 text-[11px] text-neutral-400">{subtext}</p>}
        </>
      )}
    </div>
  );
}

function ApplicantCountIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 text-neutral-400">
      <path
        d="M9 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.5 15c.6-2.6 2.9-4.5 5.5-4.5s4.9 1.9 5.5 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VerifiedBadgeIcon() {
  return (
    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 9.5L7.2 12.7L14 5.5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function EmployerDashboard() {
  const [company, setCompany] = useState<MyCompany | null>(null);
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [applicants, setApplicants] = useState<EmployerApplicant[]>([]);
  const [stageCounts, setStageCounts] = useState<StageCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const companyResult = await companyAction.getMyCompany();
      if (!companyResult.success) {
        setError(companyResult.message);
        setLoading(false);
        return;
      }
      setCompany(companyResult.data);

      const [jobsResult, applicantsResult, statsResult] = await Promise.all([
        jobAction.listByCompany(companyResult.data.companyId),
        applicationAction.getApplicantsForEmployer(),
        applicationAction.getStageCounts(),
      ]);

      if (jobsResult.success) setJobs(jobsResult.data);
      if (applicantsResult.success) setApplicants(applicantsResult.data);
      if (statsResult.success) setStageCounts(statsResult.data);

      setLoading(false);
    })();
  }, []);

  const activeJobs = jobs.filter((j) => j.status === 'open');
  const recentApplicants = [...applicants]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);

  // Swap for job.applicantCount once your API returns it per-job.
  const applicantCountForJob = (jobId: string) =>
    applicants.filter((a) => a.jobId === jobId).length;

  if (error) {
    return (
      <div className="max-w-[1280px] mx-auto px-10 py-16">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {error} — make sure you&apos;re logged in as an employer.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-10 py-10">
      {/* Welcome */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 mb-3 bg-violet-50 border border-violet-100 rounded-full text-[11px] font-semibold text-violet-600">
            Employer
          </span>
          <h1 className="text-[32px] leading-tight text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
            Welcome back{company ? `, ${company.companyName}` : ''}
          </h1>
          <p className="mt-2 text-[13px] text-neutral-500">Your hiring at a glance.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/Features/applicants"
            className="h-9 px-5 flex items-center rounded-lg bg-white border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
          >
            View applicants
          </Link>
          <Link
            href="/Features/PostJob"
            className="h-9 px-5 flex items-center rounded-lg bg-violet-600 text-xs font-medium text-white shadow-sm hover:bg-violet-700 transition-colors"
          >
            Post a job
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-8 flex flex-wrap gap-4">
        <StatCard label="Active jobs" value={activeJobs.length} subtext="Published" loading={loading} />
        <StatCard label="Total applicants" value={stageCounts?.all ?? 0} loading={loading} />
        <StatCard label="Shortlisted" value={stageCounts?.shortlisted ?? 0} loading={loading} />
        <StatCard label="Offers sent" value={stageCounts?.offer ?? 0} loading={loading} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Job posts */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <h2 className="text-[15px] text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
              Your job posts
            </h2>

            {loading ? (
              <div className="mt-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 rounded-lg bg-neutral-100 animate-pulse" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="mt-8 text-center py-10">
                <p className="text-sm font-semibold text-neutral-900">No jobs posted yet</p>
                <p className="mt-1 text-xs text-neutral-500">Post your first job to start receiving applicants.</p>
                <Link
                  href="/Features/PostJob"
                  className="mt-4 inline-flex h-9 px-5 items-center rounded-lg bg-violet-600 text-xs font-medium text-white hover:bg-violet-700 transition-colors"
                >
                  Post a job
                </Link>
              </div>
            ) : (
              <div className="mt-5 divide-y divide-neutral-100">
                {jobs.map((job) => (
                  <div key={job.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-900">{job.jobTitle}</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {job.location} · {WORK_TYPE_LABELS[job.workType]} · {formatRelativeTime(job.createdAt)}
                        {job.status === 'closed' && ' · Closed'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500">
                        <ApplicantCountIcon />
                        {applicantCountForJob(job.id)} applicant{applicantCountForJob(job.id) === 1 ? '' : 's'}
                      </span>
                      <Link
                        href={`/Features/job_profile/${job.id}`}
                        className="h-7 px-4 flex items-center rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent applicants */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
                Recent applicants
              </h2>
              <Link href="/Features/applicants" className="text-xs font-medium text-neutral-500 hover:text-violet-600 transition-colors">
                Open pipeline
              </Link>
            </div>

            {loading ? (
              <div className="mt-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 rounded-lg bg-neutral-100 animate-pulse" />
                ))}
              </div>
            ) : recentApplicants.length === 0 ? (
              <div className="mt-8 text-center py-10">
                <p className="text-sm font-semibold text-neutral-900">No applicants yet</p>
                <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
                  Candidates who apply to your jobs will show up here with fit scores and pipeline stages.
                </p>
              </div>
            ) : (
              <div className="mt-5 divide-y divide-neutral-100">
                {recentApplicants.map((applicant, idx) => {
                  const initials = applicant.fullName
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                  const avatarStyle = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
                  const stageStyle = STAGE_BADGE_STYLES[applicant.stage] ?? 'bg-neutral-100 text-neutral-700';
                  return (
                    <div key={applicant.applicationId} className="py-4 flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold ${avatarStyle}`}>
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neutral-900">{applicant.fullName}</p>
                        <p className="mt-0.5 text-xs text-neutral-500 truncate">
                          {applicant.topSkills.slice(0, 2).join(', ')} · Applied {formatRelativeTime(applicant.appliedAt)}
                        </p>
                      </div>
                      <span className="flex-shrink-0 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-600">
                        {applicant.fitScore}% fit
                      </span>
                      <span className={`flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${stageStyle}`}>
                        {STAGE_LABELS[applicant.stage]}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pipeline snapshot */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <h2 className="text-[15px] text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
              Pipeline snapshot
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {PIPELINE_STAGES.map((stage) => (
                <div key={stage} className="flex-1 min-w-[95px] bg-white border border-neutral-200/80 rounded-lg p-3 relative overflow-hidden">
                  <span className={`absolute top-0 left-0 right-0 h-[3px] ${PIPELINE_ACCENTS[stage]}`} />
                  <p className="text-[11px] text-neutral-500">{STAGE_LABELS[stage]}</p>
                  {loading ? (
                    <div className="mt-1.5 h-5 w-6 rounded bg-neutral-100 animate-pulse" />
                  ) : (
                    <p className="mt-1 text-[17px] text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
                      {stageCounts?.[stage] ?? 0}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            {company?.status === 'verified' ? (
              <>
                <div className="flex items-center gap-3">
                  <VerifiedBadgeIcon />
                  <span className="text-sm font-medium text-neutral-900">Company verified</span>
                </div>
                <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
                  Business registration, phone, and {stageCounts?.hired ?? 0} successful hires confirmed.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  </div>
                  <span className="text-sm font-medium text-neutral-900">Verification pending</span>
                </div>
                <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
                  We&apos;re reviewing your submitted business document. This usually takes a few business days.
                </p>
              </>
            )}
            <div className="mt-5 flex gap-2">
              <Link
                href="/Features/UpdateProfile/employer"
                className="flex-1 h-9 flex items-center justify-center rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
              >
                View profile
              </Link>
              <Link
                href="/Features/UpdateProfile/employer?tab=edit"
                className="flex-1 h-9 flex items-center justify-center rounded-lg bg-violet-600 text-xs font-medium text-white shadow-sm hover:bg-violet-700 transition-colors"
              >
                Edit profile
              </Link>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>Post smarter</h3>
            <p className="mt-2.5 text-xs text-neutral-500 leading-relaxed">
              Jobs with disclosed salaries get more qualified applicants and faster responses.
            </p>
            <Link
              href="/Features/PostJob"
              className="mt-5 h-9 w-full flex items-center justify-center rounded-lg bg-violet-600 text-xs font-medium text-white shadow-sm hover:bg-violet-700 transition-colors"
            >
              Post a job
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}