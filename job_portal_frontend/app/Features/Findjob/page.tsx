'use client';

import { useEffect, useMemo, useState } from 'react';
import { jobAction } from '../../../actions/job_action';
import JobCard from '../../../components/find_jobs/JobCard';
import { JobListItem } from '../../../types/job.types';

const WORK_TYPES = [
  { value: '', label: 'All work types' },
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
];

const MAX_SALARY_SLIDER = 200000;

function JobCardSkeleton() {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-7">
      <div className="h-5 w-1/3 rounded bg-neutral-100 animate-pulse" />
      <div className="mt-3 h-4 w-1/4 rounded bg-neutral-100 animate-pulse" />
      <div className="mt-6 flex gap-3">
        <div className="h-8 w-32 rounded bg-neutral-100 animate-pulse" />
        <div className="h-8 w-24 rounded bg-neutral-100 animate-pulse" />
      </div>
    </div>
  );
}

export default function FindJobsPage() {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [workType, setWorkType] = useState('');
  const [minSalary, setMinSalary] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<'newest' | 'salary_desc'>('newest');

  useEffect(() => {
    setLoading(true);
    (async () => {
      const result = await jobAction.listAllJobs({
        workType: workType || undefined,
        minSalary: minSalary || undefined,
        verifiedOnly,
        sort,
      });

      if (result.success) {
        setJobs(result.data);
        setError(null);
      } else {
        setError(result.message);
      }
      setLoading(false);
    })();
  }, [workType, minSalary, verifiedOnly, sort]);

  const resultLabel = useMemo(() => {
    if (loading) return 'Loading jobs...';
    return `Showing ${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'}${
      verifiedOnly ? ' · Verified employers only' : ''
    }`;
  }, [loading, jobs.length, verifiedOnly]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-18 w-full max-w-312 items-center justify-between px-4 lg:px-0">
          <div className="flex items-center gap-4">
            <div className="relative h-9.5 w-9.5 rounded bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF]">
              <div className="absolute left-2.5 top-4 h-3.5 w-4 border-2 border-white" />
              <div className="absolute left-3.75 top-2 h-1.75 w-2 border-2 border-white" />
            </div>
            <h1 className="text-[28px] font-bold">Jopsphere</h1>
          </div>

          <nav className="hidden items-center gap-10 text-[15px] lg:flex">
            <a href="/Features/find_jobs" className="font-bold text-neutral-900">Find Jobs</a>
            <a href="#" className="text-neutral-500">My Applications</a>
            <a href="/Features/salary_explorer" className="text-neutral-500">Salary Explorer</a>
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <a href="/login" className="text-[15px] text-neutral-900">Sign in</a>
            <a href="/post-job" className="h-9 flex items-center rounded bg-[#6D4AFF] px-6 text-sm font-bold text-white">
              Post a Job
            </a>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="border-b border-neutral-200 bg-white/90">
        <div className="mx-auto flex w-full max-w-312 flex-wrap items-center gap-6 px-4 py-5 lg:px-0">
          <div>
            <p className="text-[13px] text-neutral-500">
              Min salary: NPR {minSalary.toLocaleString('en-IN')}/mo
            </p>
            <input
              type="range"
              min={0}
              max={MAX_SALARY_SLIDER}
              step={5000}
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="mt-2 h-6 w-65 accent-[#6D4AFF]"
            />
          </div>

          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            className="h-10 min-w-32.5 rounded-md border border-neutral-300 bg-white px-4 text-sm text-neutral-900 outline-none"
          >
            {WORK_TYPES.map((w) => (
              <option key={w.value} value={w.value}>{w.label}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'newest' | 'salary_desc')}
            className="h-10 rounded-md border border-neutral-300 bg-white px-4 text-sm text-neutral-900 outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="salary_desc">Highest salary</option>
          </select>

          <button
            type="button"
            onClick={() => setVerifiedOnly((v) => !v)}
            className="inline-flex items-center gap-3 text-sm text-neutral-900"
          >
            <span
              className={`relative inline-flex h-5.5 w-9.5 items-center rounded-full transition-colors ${
                verifiedOnly ? 'bg-[#6D4AFF]' : 'bg-[#DADADA]'
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  verifiedOnly ? 'translate-x-4.5' : 'translate-x-0.75'
                }`}
              />
            </span>
            Verified only
          </button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-312 px-4 py-9 lg:px-0">
        <h2 className="text-4xl font-bold">Jobs in Nepal</h2>
        <p className="mt-3 text-[15px] text-neutral-500">{resultLabel}</p>

        {error && (
          <div className="mt-6 rounded border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-9 space-y-5">
          {loading ? (
            <>
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </>
          ) : jobs.length === 0 ? (
            <div className="rounded-md border border-neutral-200 bg-white p-12 text-center">
              <p className="text-lg font-bold text-neutral-900">No jobs match your filters</p>
              <p className="mt-2 text-sm text-neutral-500">Try adjusting the salary range or work type.</p>
            </div>
          ) : (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>

        <aside className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded bg-[#F3F0FF] px-8 py-8">
          <div>
            <h3 className="text-2xl font-bold">Find verified jobs faster</h3>
            <p className="mt-3 text-[15px] text-neutral-500">
              Browse trusted employers, compare salary ranges, and apply to jobs with quick response times.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVerifiedOnly(true)}
            className="h-11 rounded bg-[#6D4AFF] px-10 text-[15px] font-bold text-white"
          >
            Show Verified Jobs
          </button>
        </aside>
      </section>
    </main>
  );
}