'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { jobAction } from '../../../lib/actions/job.action';
import { JobListItem, WorkType } from '../../../lib/types/job.types';
import { formatSalaryRange, WORK_TYPE_LABELS, LISTING_TYPE_LABELS, formatRelativeTime } from '../../../lib/utils/job-format';
import AppHeader from '../../components/appheader';
import { ROUTES } from '../../../lib/route';

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
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-neutral-100" />
        <div className="flex-1">
          <div className="h-5 w-2/5 rounded bg-neutral-100" />
          <div className="mt-2 h-4 w-1/3 rounded bg-neutral-100" />
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-7 w-28 rounded-full bg-neutral-100" />
        <div className="h-7 w-20 rounded-full bg-neutral-100" />
        <div className="h-7 w-24 rounded-full bg-neutral-100" />
      </div>
    </div>
  );
}

function EnhancedJobCard({ job }: { job: JobListItem }) {
  return (
    <Link href={ROUTES.jobProfile(job.id)} className="block group">
      <article className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-200 hover:border-[#BCAEFF] hover:shadow-[0_8px_24px_rgba(109,74,255,0.08)] group-hover:-translate-y-0.5">
        <div className="flex items-start gap-4">
          {/* Company logo placeholder */}
          <div className="w-12 h-12 rounded-xl bg-[#F0ECFF] flex items-center justify-center flex-shrink-0">
            <img src="/company.png" alt="" className="w-8 h-8 object-contain rounded" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 truncate">{job.jobTitle}</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  <span className="font-medium">{job.companyName}</span>
                  {job.companyVerified && (
                    <span className="ml-2 inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.59L7 10l-2.41-2.41L5.3 6.88 7 8.59l3.7-3.7.71.7z"/></svg>
                      Verified
                    </span>
                  )}
                  <span className="mx-2 text-neutral-300">·</span>
                  <span className="text-neutral-500">{job.location}</span>
                </p>
              </div>
              <span className="shrink-0 rounded-lg bg-[#EAF8F0] px-3 py-1.5 text-xs font-bold text-[#148A50]">
                {formatSalaryRange(job.salary)}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
            {WORK_TYPE_LABELS[job.workType]}
          </span>
          {job.listingType === 'walk_in' && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              {LISTING_TYPE_LABELS.walk_in}
            </span>
          )}
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="rounded-full bg-[#F0ECFF] px-3 py-1 text-xs font-medium text-[#6D4AFF]">
              {skill}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6.5" />
              <path d="M8 4.5V8l2.5 1.5" strokeLinecap="round" />
            </svg>
            {formatRelativeTime(job.createdAt)}
          </span>
          <span className="text-[#6D4AFF] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View details →
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function FindJobsPage() {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

    return () => { cancelled = true; };
  }, [workType, verifiedOnly, minSalary, sort]);

  // Client-side search filtering
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    const q = searchQuery.toLowerCase();
    return jobs.filter(
      (j) =>
        j.jobTitle.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q)) ||
        j.location.toLowerCase().includes(q)
    );
  }, [jobs, searchQuery]);

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <AppHeader portal="seeker" />

      {/* Hero search section */}
      <section className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-10">
          <h1 className="text-3xl font-bold text-neutral-900">Find your next opportunity</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Browse verified jobs from trusted employers across Nepal.
          </p>

          {/* Search bar */}
          <div className="mt-6 flex items-center gap-3">
            <div className="relative flex-1 max-w-lg">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
                <circle cx="7" cy="7" r="5" />
                <path d="M11.5 11.5L14 14" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, company, skill, or location..."
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
              />
            </div>
          </div>

          {/* Filters row */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value as WorkType | 'all')}
              className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-[#6D4AFF]"
            >
              {WORK_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-[#6D4AFF]"
            >
              <option value="newest">Newest first</option>
              <option value="salary_desc">Highest salary</option>
            </select>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Min: NPR {minSalary.toLocaleString('en-IN')}</span>
              <input
                type="range"
                min={0}
                max={200000}
                step={5000}
                value={minSalary}
                onChange={(e) => setMinSalary(Number(e.target.value))}
                className="w-32 accent-[#6D4AFF]"
              />
            </div>

            <button
              type="button"
              onClick={() => setVerifiedOnly((v) => !v)}
              className={`h-9 rounded-lg px-3 text-sm font-medium border transition-colors ${
                verifiedOnly
                  ? 'bg-[#F0ECFF] border-[#6D4AFF] text-[#6D4AFF]'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
              }`}
            >
              ✓ Verified only
            </button>
          </div>
        </div>
      </section>

      {/* Job listings */}
      <section className="mx-auto max-w-[1200px] px-6 py-8 lg:px-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-neutral-500">
            {loading ? 'Loading...' : `${filteredJobs.length} ${filteredJobs.length === 1 ? 'job' : 'jobs'} found`}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <>
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </>
          ) : filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white px-8 py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <p className="text-base font-semibold text-neutral-900">No jobs match your search</p>
              <p className="mt-2 text-sm text-neutral-500">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            filteredJobs.map((job) => <EnhancedJobCard key={job.id} job={job} />)
          )}
        </div>

        {/* CTA Banner */}
        {!loading && (
          <div className="mt-10 rounded-2xl bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Looking for more opportunities?</h3>
                <p className="mt-1 text-sm text-white/80">
                  Create your profile to get personalized job recommendations and fit scores.
                </p>
              </div>
              <Link
                href={ROUTES.register}
                className="shrink-0 h-10 flex items-center rounded-lg bg-white px-6 text-sm font-bold text-[#6D4AFF] hover:bg-white/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
