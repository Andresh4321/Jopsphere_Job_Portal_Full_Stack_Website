'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { savedJobAction } from '../../../lib/actions/savedjob.action';
import { SavedJob } from '../../../lib/types/savedjobs.types';
import { ROUTES } from '../../../lib/route';
import { WORK_TYPE_LABELS, formatSalaryRange, formatRelativeTime } from '../../../lib/utils/job-format';
import AppHeader from '../../components/appheader';

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const result = await savedJobAction.getMySavedJobs();
      if (result.success) setJobs(result.data);
      else setError(result.message);
      setLoading(false);
    })();
  }, []);

  const handleUnsave = async (jobId: string) => {
    setRemovingId(jobId);
    const result = await savedJobAction.unsaveJob(jobId);
    if (result.success) setJobs((prev) => prev.filter((j) => j.id !== jobId));
    setRemovingId(null);
  };

  return (
    <main className="min-h-screen bg-[#F8F7F3]">
      <AppHeader portal="seeker" />
      <div className="mx-auto max-w-300 px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
            Saved jobs
          </h1>
          <Link href="/Features/seeker_dashboard" className="text-sm font-medium text-neutral-500 hover:text-neutral-900">
            ← Back to dashboard
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-8 space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl border border-neutral-200 bg-white animate-pulse" />
            ))
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white px-8 py-16 text-center">
              <p className="text-base font-bold text-neutral-900">No saved jobs yet</p>
              <p className="mt-2 text-sm text-neutral-500">Save jobs from their profile page to see them here.</p>
              <Link
                href={ROUTES.findJobs}
                className="mt-5 inline-block rounded-lg bg-[#735CC7] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                Explore jobs
              </Link>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <Link href={ROUTES.jobProfile(job.id)} className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900">{job.jobTitle}</p>
                  <p className="mt-1.5 text-xs text-neutral-500">
                    {job.companyName}
                    {job.companyVerified && <span className="ml-2 text-emerald-600">✓ Verified</span>}
                    {' · '}{WORK_TYPE_LABELS[job.workType]} · Saved {formatRelativeTime(job.savedAt)}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#148A50]">{formatSalaryRange(job.salary)}</p>
                </Link>
                <button
                  type="button"
                  onClick={() => handleUnsave(job.id)}
                  disabled={removingId === job.id}
                  className="shrink-0 rounded-lg border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
                >
                  {removingId === job.id ? 'Removing...' : 'Remove'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}