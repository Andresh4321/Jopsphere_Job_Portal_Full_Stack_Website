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

function StatCard({ label, value, loading }: { label: string; value: string | number; loading?: boolean }) {
  return (
    <div className="flex-1 min-w-[180px] bg-white border border-neutral-200 rounded p-6">
      <p className="text-xs font-bold text-stone-600 tracking-wide">{label.toUpperCase()}</p>
      {loading ? (
        <div className="mt-3 h-7 w-10 rounded bg-neutral-100 animate-pulse" />
      ) : (
        <p className="mt-2 text-2xl text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>{value}</p>
      )}
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

  if (error) {
    return (
      <div className="max-w-[1280px] mx-auto px-10 py-16">
        <div className="rounded border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {error} — make sure you&apos;re logged in as an employer.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-10 py-8">
      {/* Welcome */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 mb-3 bg-white border border-neutral-200 rounded text-xs font-medium text-indigo-500">
            Employer
          </span>
          <h1 className="text-3xl text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
            Welcome back{company ? `, ${company.companyName}` : ''}
          </h1>
          <p className="mt-2 text-xs text-stone-600">Your hiring at a glance.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/Features/ApplicantsList"
            className="h-9 px-6 flex items-center rounded bg-white border border-neutral-200 text-xs font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
          >
            View applicants
          </Link>
          <Link
            href="/Features/PostJob"
            className="h-9 px-6 flex items-center rounded bg-indigo-500 text-xs font-medium text-white hover:bg-indigo-600 transition-colors"
          >
            Post a job
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-8 flex flex-wrap gap-5">
        <StatCard label="Active jobs" value={activeJobs.length} loading={loading} />
        <StatCard label="Total applicants" value={stageCounts?.all ?? 0} loading={loading} />
        <StatCard label="Shortlisted" value={stageCounts?.shortlisted ?? 0} loading={loading} />
        <StatCard label="Offers sent" value={stageCounts?.offer ?? 0} loading={loading} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_384px]">
        <div className="space-y-6">
          {/* Job posts */}
          <div className="bg-white border border-neutral-200 rounded p-8">
            <h2 className="text-base text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
              Your job posts
            </h2>

            {loading ? (
              <div className="mt-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 rounded bg-neutral-100 animate-pulse" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="mt-8 text-center py-10">
                <p className="text-sm font-bold text-neutral-900">No jobs posted yet</p>
                <p className="mt-1 text-xs text-stone-600">Post your first job to start receiving applicants.</p>
                <Link
                  href="/Features/PostJob"
                  className="mt-4 inline-flex h-9 px-6 items-center rounded bg-indigo-500 text-xs font-medium text-white hover:bg-indigo-600 transition-colors"
                >
                  Post a job
                </Link>
              </div>
            ) : (
              <div className="mt-6 divide-y divide-neutral-200">
                {jobs.map((job) => (
                  <div key={job.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm text-neutral-900">{job.jobTitle}</p>
                      <p className="mt-1 text-xs text-stone-600">
                        {job.location} · {WORK_TYPE_LABELS[job.workType]} · {formatRelativeTime(job.createdAt)}
                        {job.status === 'closed' && ' · Closed'}
                      </p>
                    </div>
                    <Link
                      href={`/Features/job_profile/${job.id}`}
                      className="h-7 px-4 flex items-center flex-shrink-0 rounded border border-neutral-200 text-xs text-neutral-900 hover:bg-neutral-50 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent applicants */}
          <div className="bg-white border border-neutral-200 rounded p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-base text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
                Recent applicants
              </h2>
              <Link href="/Features/applicants" className="text-xs text-stone-600 hover:text-neutral-900 transition-colors">
                Open pipeline
              </Link>
            </div>

            {loading ? (
              <div className="mt-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 rounded bg-neutral-100 animate-pulse" />
                ))}
              </div>
            ) : recentApplicants.length === 0 ? (
              <div className="mt-8 text-center py-10">
                <p className="text-sm font-bold text-neutral-900">No applicants yet</p>
                <p className="mt-1 text-xs text-stone-600 max-w-sm mx-auto">
                  Candidates who apply to your jobs will show up here with fit scores and pipeline stages.
                </p>
              </div>
            ) : (
              <div className="mt-6 divide-y divide-neutral-200">
                {recentApplicants.map((applicant) => {
                  const initials = applicant.fullName
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();
                  return (
                    <div key={applicant.applicationId} className="py-4 flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-zinc-100 flex-shrink-0 flex items-center justify-center text-xs text-neutral-900">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-neutral-900">{applicant.fullName}</p>
                        <p className="mt-1 text-xs text-stone-600 truncate">
                          {applicant.topSkills.slice(0, 2).join(', ')} · Applied {formatRelativeTime(applicant.appliedAt)}
                        </p>
                      </div>
                      <span className="flex-shrink-0 rounded bg-slate-100 px-3 py-1 text-xs font-medium text-indigo-500">
                        {applicant.fitScore}% fit
                      </span>
                      <span className="flex-shrink-0 rounded bg-zinc-100 px-3 py-1 text-xs text-neutral-900">
                        {STAGE_LABELS[applicant.stage]}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pipeline snapshot */}
          <div className="bg-white border border-neutral-200 rounded p-8">
            <h2 className="text-base text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
              Pipeline snapshot
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {PIPELINE_STAGES.map((stage) => (
                <div key={stage} className="flex-1 min-w-[100px] bg-white border border-neutral-200 rounded p-3">
                  <p className="text-xs text-stone-600">{STAGE_LABELS[stage]}</p>
                  {loading ? (
                    <div className="mt-1 h-5 w-6 rounded bg-neutral-100 animate-pulse" />
                  ) : (
                    <p className="mt-1 text-base text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
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
          <div className="bg-white border border-neutral-200 rounded p-6">
            {company?.status === 'verified' ? (
              <>
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                    <path d="M4 9.5L7.2 12.7L14 5.5" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm text-neutral-900">Company verified</span>
                </div>
                <p className="mt-3 text-xs text-stone-600">
                  Your business registration has been confirmed by Jopsphere.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100" />
                  <span className="text-sm text-neutral-900">Verification pending</span>
                </div>
                <p className="mt-3 text-xs text-stone-600">
                  We&apos;re reviewing your submitted business document. This usually takes a few business days.
                </p>
              </>
            )}
            <Link
              href={`/Features/company_profile/${company?.companyId ?? ''}`}
              className="mt-5 h-9 w-full flex items-center justify-center rounded border border-neutral-200 text-xs text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              View company profile
            </Link>
          </div>

          <div className="bg-white border border-neutral-200 rounded p-6">
            <h3 className="text-sm text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>Post smarter</h3>
            <p className="mt-3 text-xs text-stone-600">
              Jobs with disclosed salaries get more qualified applicants and faster responses.
            </p>
            <Link
              href="/Features/PostJob"
              className="mt-5 h-9 w-full flex items-center justify-center rounded bg-indigo-500 text-xs font-medium text-white hover:bg-indigo-600 transition-colors"
            >
              Post a job
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}