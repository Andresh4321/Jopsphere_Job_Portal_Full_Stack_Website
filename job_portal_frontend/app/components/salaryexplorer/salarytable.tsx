'use client';

import { SalaryExplorerRow } from '../../../lib/types/salary.types';

const formatNPR = (amount: number): string => `NPR ${Math.round(amount).toLocaleString('en-IN')}`;

function SalaryTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="grid grid-cols-[1.6fr_1.2fr_1fr_1fr_1fr] bg-neutral-50 px-6 py-4 text-[11px] font-bold tracking-wide text-neutral-500 uppercase">
        <span>Role</span>
        <span>Industry</span>
        <span className="text-center">Min</span>
        <span className="text-center">Avg</span>
        <span className="text-right">Max</span>
      </div>
      <div className="divide-y divide-neutral-100">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="grid grid-cols-[1.6fr_1.2fr_1fr_1fr_1fr] items-center px-6 py-5 gap-4">
            {[0, 1, 2, 3, 4].map((col) => (
              <div key={col} className="h-3.5 rounded bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-8 py-16 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      </div>
      <p className="text-base font-semibold text-neutral-900">No salary data yet</p>
      <p className="mt-2 text-sm text-neutral-500">
        Salary insights appear here automatically as employers post jobs.
      </p>
    </div>
  );
}

export default function SalaryTable({
  rows,
  loading,
}: {
  rows: SalaryExplorerRow[];
  loading: boolean;
}) {
  if (loading) return <SalaryTableSkeleton />;
  if (rows.length === 0) return <EmptyState />;

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      {/* Header */}
      <div className="grid grid-cols-[1.6fr_1.2fr_1fr_1fr_1fr] bg-neutral-50 px-6 py-4 text-[11px] font-bold tracking-wide text-neutral-500 uppercase border-b border-neutral-100">
        <span>Role</span>
        <span>Industry</span>
        <span className="text-center">Min</span>
        <span className="text-center">Avg</span>
        <span className="text-right">Max</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-neutral-100">
        {rows.map((row) => (
          <div
            key={row.role}
            className="grid grid-cols-[1.6fr_1.2fr_1fr_1fr_1fr] items-center px-6 py-4 text-sm text-neutral-900 transition-colors hover:bg-neutral-50/60"
          >
            <span className="font-medium">
              {row.role}
              <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                {row.jobCount} {row.jobCount === 1 ? 'listing' : 'listings'}
              </span>
            </span>
            <span className="text-neutral-500">{row.industry}</span>
            <span className="text-center text-neutral-600">{formatNPR(row.min)}</span>
            <span className="text-center font-bold text-[#6D4AFF]">{formatNPR(row.avg)}</span>
            <span className="text-right text-neutral-600">{formatNPR(row.max)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
