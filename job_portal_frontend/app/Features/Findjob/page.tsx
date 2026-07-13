'use client';

import { useEffect, useMemo, useState } from 'react';
import { jobAction } from '../../../lib/actions/job.action';
import { JobListItem, WorkType } from '../../../lib/types/job.types';
import JobCard from '../../components/postjob/jobcard';
import AppHeader from '../../components/appheader';

const WORK_TYPE_OPTIONS: { value: WorkType | 'all'; label: string }[] = [
  { value: 'all', label: 'All work types' },
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
];

type SortOption = 'newest' | 'salary_desc';

function JobCardSkeleton() {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-7">
      <div className="h-5 w-1/3 rounded bg-neutral-100 animate-pulse" />
      <div className="mt-3 h-4 w-1/2 rounded bg-neutral-100 animate-pulse" />
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

  const [workType, setWorkType] = useState<WorkType | 'all'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minSalary, setMinSalary] = useState(0);
  const [sort, setSort] = useState<SortOption>('newest');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      const result = await jobAction.listAllJobs({
        status: 'open',
        workType: workType === 'all' ? undefined : workType,
        minSalary: minSalary > 0 ? minSalary : undefined,
        verifiedOnly: verifiedOnly || undefined,
        sort,
      });

      if (cancelled) return;

      if (result.success) {
        setJobs(result.data);
        setError(null);
      } else {
        setError(result.message);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [workType, verifiedOnly, minSalary, sort]);

  const totalCount = jobs.length;

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-neutral-900">
      <AppHeader portal="seeker" />

      {/* Filters */}
      <section className="border-b border-neutral-200 bg-white/90">
        <div className="mx-auto flex w-full max-w-312 flex-wrap items-center gap-6 px-4 py-5 lg:px-0">
          <div>
            <p className="text-[13px] text-neutral-500">Min salary: NPR {minSalary.toLocaleString('en-IN')}/mo</p>
            <input
              type="range"
              min={0}
              max={200000}
              step={5000}
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="mt-2 w-65 accent-[#6D4AFF]"
            />
          </div>

          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value as WorkType | 'all')}
            className="h-10 rounded-md border border-neutral-300 bg-white px-4 text-sm text-neutral-900"
          >
            {WORK_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-10 rounded-md border border-neutral-300 bg-white px-4 text-sm text-neutral-900"
          >
            <option value="newest">Newest first</option>
            <option value="salary_desc">Highest salary first</option>
          </select>

          <button
            type="button"
            onClick={() => setVerifiedOnly((v) => !v)}
            className="inline-flex items-center gap-3 text-sm text-neutral-900"
          >
            <span className={`relative inline-flex h-5.5 w-9.5 items-center rounded-full transition-colors ${verifiedOnly ? 'bg-[#6D4AFF]' : 'bg-[#DADADA]'}`}>
              <span className={`h-4 w-4 rounded-full bg-white transition-transform ${verifiedOnly ? 'translate-x-4.5' : 'translate-x-0.75'}`} />
            </span>
            Verified only
          </button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-312 px-4 py-9 lg:px-0">
        <h2 className="text-4xl font-bold">Jobs in Nepal</h2>
        <p className="mt-3 text-[15px] text-neutral-500">
          {loading ? 'Loading listings...' : `Showing ${totalCount} verified & open ${totalCount === 1 ? 'job' : 'jobs'}`}
        </p>

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
          ) : totalCount === 0 ? (
            <div className="rounded-md border border-neutral-200 bg-white px-8 py-16 text-center">
              <p className="text-base font-bold text-neutral-900">No jobs match your filters</p>
              <p className="mt-2 text-sm text-neutral-500">Try widening your salary range or clearing filters.</p>
            </div>
          ) : (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>

        <aside className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded bg-[#F3F0FF] px-8 py-8">
          <div>
            <h3 className="text-2xl font-bold">Find verified jobs faster</h3>
            <p className="mt-3 text-[15px] text-neutral-500">
              Browse trusted employers, compare salary ranges, and apply to jobs with transparent listings.
            </p>
          </div>
          <a
            href="/register"
            className="h-11 flex items-center rounded bg-[#6D4AFF] px-10 text-[15px] font-bold text-white"
          >
            Get Started
          </a>
        </aside>
      </section>
    </main>
  );
}