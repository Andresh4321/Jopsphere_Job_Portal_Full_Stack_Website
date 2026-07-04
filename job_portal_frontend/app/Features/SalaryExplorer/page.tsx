'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import SalaryTable from '../../components/salaryexplorer/salarytable';
import { salaryAction } from '../../../lib/actions/salary.action';
import { SalaryExplorerRow } from '../../../lib/types/salary.types';

type SortOption = 'alphabetical' | 'highest_avg' | 'most_listings';

export default function SalaryExplorerPage() {
  const router = useRouter();

  const [rows, setRows] = useState<SalaryExplorerRow[]>([]);
  const [overallAverage, setOverallAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');

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

  return (
    <main className="min-h-screen bg-[#F0EEE6] text-[#1A1A1A]">
      <header className="border-b border-[#C8C6BE] bg-[#F0EEE6]">
        <div className="mx-auto flex h-15 w-full max-w-300 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center bg-[#6B5FD6] text-lg font-bold text-white">J</div>
            <span className="text-[15px] font-bold">Jopsphere</span>
          </div>

          <nav className="hidden items-center gap-8 text-[13px] lg:flex">
            <a href="#" className="text-[#444444]">Find Jobs</a>
            <a href="#" className="text-[#444444]">My Applications</a>
            <a href="#" className="border-b-2 border-[#6B5FD6] pb-2 font-bold text-[#1A1A1A]">Salary Explorer</a>
            <a href="#" className="text-[#444444]">For Employers</a>
            <a href="#" className="text-[#444444]">Applicants</a>
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a href="#" className="text-[13px] text-[#1A1A1A]">Sign in</a>
            <button type="button" className="h-8.5 bg-[#6B5FD6] px-4 text-[13px] font-bold text-white">
              Post a Job
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-300 px-8 py-12">
        <h1 className="text-4xl font-bold">Salary Explorer</h1>
        <p className="mt-3 text-sm text-[#666666]">
          Real salary data from verified Jopsphere listings across Nepal, updated live as jobs are posted.
        </p>

        {error && (
          <div className="mt-6 rounded border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Search + sort controls */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role or industry..."
            className="h-11 w-full max-w-sm rounded border border-[#D8D6CE] bg-white px-4 text-sm text-[#1A1A1A] outline-none transition-all focus:border-[#6B5FD6] focus:shadow-[0_0_0_4px_rgba(107,95,214,0.12)]"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-11 rounded border border-[#D8D6CE] bg-white px-4 text-sm text-[#1A1A1A] outline-none"
          >
            <option value="alphabetical">Sort: Alphabetical</option>
            <option value="highest_avg">Sort: Highest average</option>
            <option value="most_listings">Sort: Most listings</option>
          </select>
        </div>

        <div className="mt-6">
          <SalaryTable rows={visibleRows} loading={loading} />
        </div>

        {!loading && rows.length > 0 && (
          <p className="mt-4 text-center text-xs text-[#AFAEA6]">
            Based on {rows.reduce((sum, r) => sum + r.jobCount, 0)} active listings across {rows.length} roles.
          </p>
        )}

        {!loading && overallAverage > 0 && (
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={() => router.push(`/jobs?minSalary=${overallAverage}`)}
              className="h-11 rounded border border-[#C8C6BE] bg-white px-6 text-sm font-normal text-[#1A1A1A] transition-colors hover:bg-[#F7F6F2]"
            >
              Browse jobs paying above average ({formatNPR(overallAverage)})
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

function formatNPR(amount: number): string {
  return `NPR ${Math.round(amount).toLocaleString('en-IN')}`;
}