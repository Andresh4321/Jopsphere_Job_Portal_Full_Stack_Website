'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { companyAction } from '../../../lib/actions/company.action';
import { CompanyListItem } from '../../../lib/types/company.types';
import AppHeader from '../../components/appheader';

function CompanyCardSkeleton() {
  return (
    <div className="rounded border border-neutral-200 bg-white p-7">
      <div className="flex items-start gap-5">
        <div className="h-13.5 w-13.5 rounded bg-neutral-100 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-2/3 rounded bg-neutral-100 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-neutral-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function CompanyCard({ company }: { company: CompanyListItem }) {
  return (
    <Link href={`/Features/CompanyProfile/${company.companyId}`}>
      <article className="h-full rounded border border-neutral-200 bg-white p-7 transition-all hover:border-[#BCAEFF] hover:shadow-[0_4px_16px_rgba(109,74,255,0.08)]">
        <div className="flex items-start gap-5">
          <div className="relative h-13.5 w-13.5 flex-shrink-0 rounded bg-[#F0ECFF]">
            <div className="absolute left-4.75 top-3.5 h-7.5 w-4.25 border-[2.5px] border-[#6D4AFF]" />
            <div className="absolute left-6 top-5.5 h-2 w-2.25 border-2 border-[#6D4AFF]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[19px] font-bold text-neutral-900">{company.companyName}</h3>
            <p className="mt-2 flex flex-wrap items-center gap-3 text-[13px]">
              {company.status === 'verified' && <span className="text-[#19A15F]">✓ Verified</span>}
              <span className="text-neutral-500">📍 {company.headquarters}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-neutral-500">
            {company.openRolesCount} open role{company.openRolesCount === 1 ? '' : 's'}
          </span>
          <span className="text-neutral-500">{company.industry}</span>
        </div>
      </article>
    </Link>
  );
}

export default function CompanyListPage() {
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const result = await companyAction.listCompanies();
      if (result.success) setCompanies(result.data);
      else setError(result.message);
      setLoading(false);
    })();
  }, []);

  const verifiedCount = companies.filter((c) => c.status === 'verified').length;

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-neutral-900">
      <AppHeader portal="seeker" />

      <section className="mx-auto w-full max-w-312 px-4 py-9 lg:px-0">
        <h2 className="text-[40px] font-bold leading-tight">Companies on Jopsphere</h2>
        <p className="mt-3 text-base text-neutral-500">
          {loading
            ? 'Loading companies...'
            : `${companies.length} ${companies.length === 1 ? 'employer' : 'employers'} on the platform${verifiedCount > 0 ? ` · ${verifiedCount} verified` : ''}`}
        </p>

        {error && (
          <div className="mt-6 rounded border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            [...Array(6)].map((_, i) => <CompanyCardSkeleton key={i} />)
          ) : companies.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3 rounded border border-neutral-200 bg-white px-8 py-16 text-center">
              <p className="text-base font-bold text-neutral-900">No companies yet</p>
              <p className="mt-2 text-sm text-neutral-500">Check back once employers start registering.</p>
            </div>
          ) : (
            companies.map((company) => <CompanyCard key={company.companyId} company={company} />)
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded bg-[#F0ECFF] px-10 py-7">
          <div>
            <h3 className="text-[28px] font-bold">Want to hire on Jopsphere?</h3>
            <p className="mt-3 text-base text-neutral-500">
              Post verified job listings, disclose salary, and reach active candidates across Nepal.
            </p>
          </div>
          <Link
            href="/register"
            className="h-11 flex items-center rounded bg-[#6D4AFF] px-8 text-[15px] font-bold text-white"
          >
            Post a Job
          </Link>
        </div>
      </section>

      <footer className="mt-10 bg-white">
        <div className="mx-auto flex w-full max-w-312 flex-wrap items-center justify-between gap-5 px-4 py-10 text-sm lg:px-0">
          <div>
            <p className="text-[22px] font-bold text-neutral-900">Jopsphere</p>
            <p className="mt-2 text-neutral-500">Nepal&apos;s first verified job portal.</p>
          </div>
          <p className="text-neutral-500">© 2026 Jopsphere. Made in Nepal.</p>
        </div>
      </footer>
    </main>
  );
}