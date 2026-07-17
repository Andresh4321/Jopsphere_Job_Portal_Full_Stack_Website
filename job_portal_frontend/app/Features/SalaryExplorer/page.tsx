'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import SalaryTable from '../../components/salaryexplorer/salarytable';
import { salaryAction } from '../../../lib/actions/salary.action';
import { SalaryExplorerRow } from '../../../lib/types/salary.types';
import AppHeader from '../../components/appheader';
import { ROUTES } from '../../../lib/route';

type SortOption = 'alphabetical' | 'highest_avg' | 'most_listings';

export default function SalaryExplorerPage() {
  const [rows, setRows] = useState<SalaryExplorerRow[]>([]);
  const [overallAverage, setOverallAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('highest_avg');

  useEffect(() => {
    (async () => {
      const result = await salaryAction.getSalaryExplorerData();
      if (result.success) {
        setRows(result.data.rows);
        setOverallAverage(result.data.overallAverage);
      } else {
        setError(result.message);
      }
      setLoading(false);
    })();
  }, []);

  const visibleRows = useMemo(() => {
    let filtered = rows;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (r) => r.role.toLowerCase().includes(q) || r.industry.toLowerCase().includes(q)
      );
    }

    const sorted = [...filtered];
    if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.role.localeCompare(b.role));
    } else if (sortBy === 'highest_avg') {
      sorted.sort((a, b) => b.avg - a.avg);
    } else if (sortBy === 'most_listings') {
      sorted.sort((a, b) => b.jobCount - a.jobCount);
    }

    return sorted;
  }, [rows, search, sortBy]);

  const totalListings = rows.reduce((sum, r) => sum + r.jobCount, 0);

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <AppHeader portal="seeker" />

      {/* Hero section */}
      <section className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-10">
          <h1 className="text-3xl font-bold text-neutral-900">Salary Explorer</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Real salary data from verified Jopsphere listings across Nepal, updated live as jobs are posted.
          </p>

          {/* Stats row */}
          {!loading && rows.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total roles tracked</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900">{rows.length}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Active listings</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900">{totalListings}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Overall average</p>
                <p className="mt-1 text-2xl font-bold text-[#6D4AFF]">{formatNPR(overallAverage)}</p>
              </div>
            </div>
          )}

          {/* Search + sort */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
                <circle cx="7" cy="7" r="5" />
                <path d="M11.5 11.5L14 14" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by role or industry..."
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none focus:border-[#6D4AFF]"
            >
              <option value="alphabetical">Sort: Alphabetical</option>
              <option value="highest_avg">Sort: Highest average</option>
              <option value="most_listings">Sort: Most listings</option>
            </select>
          </div>
        </div>
      </section>

      {/* Table section */}
      <section className="mx-auto max-w-[1200px] px-6 py-8 lg:px-10">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <SalaryTable rows={visibleRows} loading={loading} />

        {!loading && rows.length > 0 && (
          <p className="mt-4 text-center text-xs text-neutral-400">
            Based on {totalListings} active listings across {rows.length} roles.
          </p>
        )}

        {/* CTA */}
        {!loading && overallAverage > 0 && (
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">Find jobs above average salary</h3>
                <p className="mt-1 text-sm text-white/80">
                  Browse positions paying more than the market average of {formatNPR(overallAverage)}.
                </p>
              </div>
              <Link
                href={ROUTES.findJobs}
                className="shrink-0 h-10 flex items-center rounded-lg bg-white px-6 text-sm font-bold text-[#6D4AFF] hover:bg-white/90 transition-colors"
              >
                Browse jobs
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function formatNPR(amount: number): string {
  return `NPR ${Math.round(amount).toLocaleString('en-IN')}`;
}
