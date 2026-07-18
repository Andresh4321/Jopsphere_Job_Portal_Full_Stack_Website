'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { companyAction } from '../../../../lib/actions/company.action';
import { ROUTES } from '../../../../lib/route';
import { CompanyProfileFull } from '../../../../lib/types/company.types';
import { formatSalaryRange, WORK_TYPE_LABELS, formatRelativeTime } from '../../../../lib/utils/job-format';
import { getBackendImageUrl } from '../../../../lib/utils/image-url';
import AppHeader from '../../../components/appheader';


export default function CompanyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.companyId as string;

  const [profile, setProfile] = useState<CompanyProfileFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;
    (async () => {
      const result = await companyAction.getCompanyProfile(companyId);
      if (result.success) setProfile(result.data);
      else setError(result.message);
      setLoading(false);
    })();
  }, [companyId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-sm text-neutral-500">Loading company...</p>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-4">
        <p className="font-bold text-neutral-900">{error || 'Company not found.'}</p>
        <button onClick={() => router.push('/Features/CompanyList')} className="text-sm font-bold text-[#6D4AFF]">
          ← All companies
        </button>
      </main>
    );
  }

  // Only show stats we actually have enough data for.
  const glanceItems = [
    { label: 'Industry', value: profile.industry },
    { label: 'Headquarters', value: profile.headquarters },
    { label: 'Status', value: profile.status === 'verified' ? '✓ Verified' : 'Unverified', accent: profile.status === 'verified' },
    { label: 'Open roles', value: String(profile.openRolesCount) },
  ];

  const summaryStats = [
    ...(profile.stats.responseRate !== null
      ? [{ label: '↗ Response rate', value: `${profile.stats.responseRate}%` }]
      : []),
    ...(profile.stats.avgReplyDays !== null
      ? [{ label: '◷ Avg reply', value: `${profile.stats.avgReplyDays} days` }]
      : []),
    { label: '👥 Hires on Jopsphere', value: String(profile.stats.hiresCount) },
    { label: '📅 Verified since', value: new Date(profile.createdAt).getFullYear().toString() },
  ];

  const candidateReasons = profile.whyChooseUs
    .split(/[,.]/)
    .map((r) => r.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-8 text-neutral-900">
      <AppHeader portal="seeker" />

      <section className="mx-auto w-full max-w-312 px-4 pt-8 lg:px-0">
        <Link href="/Features/CompanyList" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          ← All companies
        </Link>

        <div className="mt-6 rounded border border-neutral-200 bg-white p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-start gap-7">
                <div className="h-18 w-18 rounded-xl bg-[#F0ECFF] shrink-0 overflow-hidden flex items-center justify-center border-2 border-neutral-100">
                <img
                  src={profile.companyLogo ? getBackendImageUrl(profile.companyLogo) : '/company.png'}
                  alt={profile.companyName}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/company.png'; }}
                />
              </div>

              <div>
                <h2 className="text-[34px] font-bold leading-tight">{profile.companyName}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  {profile.status === 'verified' && <span className="text-[#19A15F]">✓ Verified business</span>}
                  <span className="text-neutral-500">📍 {profile.headquarters}</span>
                  <span className="text-neutral-500">💼 {profile.industry}</span>
                </div>
              </div>
            </div>

            {profile.openRolesCount > 0 && (
              <a
                href="#open-roles"
                className="h-9.5 flex items-center rounded bg-[#6D4AFF] px-6 text-sm font-bold text-white"
              >
                View all jobs
              </a>
            )}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryStats.map((stat) => (
              <div key={stat.label} className="rounded border border-neutral-200 bg-[#FAFAFA] px-5 py-3.5">
                <p className="text-xs text-neutral-500">{stat.label}</p>
                <p className="mt-1 text-base font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_319px]">
          <div className="space-y-8">
            <article className="rounded border border-neutral-200 bg-white p-8">
              <h3 className="text-xl font-bold">About {profile.companyName}</h3>
              <p className="mt-5 text-sm text-neutral-500 whitespace-pre-line">{profile.aboutCompany}</p>
            </article>

            <article id="open-roles" className="rounded border border-neutral-200 bg-white p-8">
              <h3 className="text-xl font-bold">Open roles ({profile.openRolesCount})</h3>

              {profile.openRoles.length === 0 ? (
                <p className="mt-5 text-sm text-neutral-500">No open roles right now — check back soon.</p>
              ) : (
                <div className="mt-6 space-y-5">
                  {profile.openRoles.map((role) => (
                    <Link
                      key={role.id}
                      href={ROUTES.jobProfile(role.id)}
                      className="block rounded border border-neutral-200 bg-white p-6 transition-colors hover:border-[#BCAEFF]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-[17px] font-bold">{role.jobTitle}</p>
                          <p className="mt-2 text-sm text-neutral-500">📍 {role.location}</p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2.5">
                        <span className="rounded bg-[#EAF8F0] px-4 py-2 text-xs font-bold text-[#148A50]">
                          {formatSalaryRange(role.salary)}
                        </span>
                        <span className="rounded bg-[#F4F4F5] px-4 py-2 text-xs text-[#444444]">
                          {WORK_TYPE_LABELS[role.workType]}
                        </span>
                        {role.skills.slice(0, 2).map((skill) => (
                          <span key={skill} className="rounded bg-[#F0ECFF] px-4 py-2 text-xs text-[#6D4AFF]">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
                        <span>◷ {formatRelativeTime(role.createdAt)}</span>
                        <span>{role.applicantsCount} applicant{role.applicantsCount === 1 ? '' : 's'}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </article>

            {candidateReasons.length > 0 && (
              <article className="rounded border border-neutral-200 bg-white p-8">
                <h3 className="text-xl font-bold">Why candidates choose us</h3>
                <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
                  {candidateReasons.map((reason) => (
                    <p key={reason}>✓ {reason}</p>
                  ))}
                </div>
              </article>
            )}
          </div>

          <aside className="space-y-8">
            <article className="rounded border border-neutral-200 bg-white p-7">
              <p className="text-xs font-bold text-neutral-500">COMPANY AT A GLANCE</p>
              <div className="mt-6 space-y-5 text-sm">
                {glanceItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4">
                    <span className="text-neutral-500">{item.label}</span>
                    <span className={item.accent ? 'font-bold text-[#19A15F]' : 'font-bold text-neutral-900'}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            {profile.companyWebsite && (
              <article className="rounded border border-neutral-200 bg-white p-7">
                <p className="text-[15px] font-bold">🌐 Website</p>
                <a
                  href={profile.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-sm text-[#6D4AFF] hover:underline break-all"
                >
                  {profile.companyWebsite}
                </a>
              </article>
            )}
          </aside>
        </div>
      </section>

      <footer className="mt-8 h-8.75 bg-white" />
    </main>
  );
}