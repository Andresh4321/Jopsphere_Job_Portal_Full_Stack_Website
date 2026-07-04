'use client';

import { SalaryExplorerRow } from '../../../lib/types/salary.types';

const formatNPR = (amount: number): string => `NPR ${Math.round(amount).toLocaleString('en-IN')}`;

function SalaryTableSkeleton() {
  return (
    <div className="overflow-hidden rounded border border-[#D8D6CE] bg-white">
      <div className="grid grid-cols-[1.6fr_1.2fr_1fr_1fr_1fr] bg-[#F7F6F2] px-8 py-4 text-[11px] font-bold tracking-wide text-[#888888]">
        <span>ROLE</span>
        <span>INDUSTRY</span>
        <span className="text-center">MIN</span>
        <span className="text-center">AVG</span>
        <span className="text-right">MAX</span>
      </div>
      <div className="divide-y divide-[#ECEAE3]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-[1.6fr_1.2fr_1fr_1fr_1fr] items-center px-8 py-5 gap-4">
            {[0, 1, 2, 3, 4].map((col) => (
              <div key={col} className="h-3.5 rounded bg-[#ECEAE3] animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded border border-[#D8D6CE] bg-white px-8 py-16 text-center">
      <p className="text-base font-bold text-[#1A1A1A]">No salary data yet</p>
      <p className="mt-2 text-sm text-[#888888]">
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
    <div className="overflow-hidden rounded border border-[#D8D6CE] bg-white">
      <div className="grid grid-cols-[1.6fr_1.2fr_1fr_1fr_1fr] bg-[#F7F6F2] px-8 py-4 text-[11px] font-bold tracking-wide text-[#888888]">
        <span>ROLE</span>
        <span>INDUSTRY</span>
        <span className="text-center">MIN</span>
        <span className="text-center">AVG</span>
        <span className="text-right">MAX</span>
      </div>

      <div className="divide-y divide-[#ECEAE3]">
        {rows.map((row) => (
          <div
            key={row.role}
            className="grid grid-cols-[1.6fr_1.2fr_1fr_1fr_1fr] items-center px-8 py-4 text-sm text-[#1A1A1A] transition-colors hover:bg-[#FAFAF8]"
          >
            <span className="font-bold">
              {row.role}
              <span className="ml-2 text-xs font-normal text-[#AFAEA6]">
                {row.jobCount} {row.jobCount === 1 ? 'listing' : 'listings'}
              </span>
            </span>
            <span className="text-[#888888]">{row.industry}</span>
            <span className="text-center">{formatNPR(row.min)}</span>
            <span className="text-center font-bold text-[#6B5FD6]">{formatNPR(row.avg)}</span>
            <span className="text-right">{formatNPR(row.max)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}