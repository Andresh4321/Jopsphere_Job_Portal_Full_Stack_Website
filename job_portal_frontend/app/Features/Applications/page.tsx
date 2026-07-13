'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { applicationAction } from '../../../lib/actions/application.action';
import { SeekerApplication, ApplicationStage, STAGE_LABELS, APPLICATION_STAGE_ORDER } from '../../../lib/types/application.types';
import { formatRelativeTime } from '../../../lib/utils/job-format';
import AppHeader from '../../components/appheader';
import { offerAction } from '../../../lib/actions/offer.action';


const navigationItems = [
  { label: 'Find Jobs', href: '/Features/find_jobs' },
  { label: 'My Applications', href: '/Features/Applications', active: true },
  { label: 'Salary Explorer', href: '/Features/salary_explorer' },
];

const STAGE_STYLES: Record<ApplicationStage, string> = {
  applied: 'bg-zinc-100 text-zinc-900',
  viewed: 'bg-violet-100 text-violet-700',
  shortlisted: 'bg-emerald-100 text-emerald-800',
  interview: 'bg-amber-100 text-amber-900',
  offer: 'bg-emerald-100 text-emerald-800',
  hired: 'bg-emerald-200 text-emerald-900',
  rejected: 'bg-red-100 text-red-700',
};

const TERMINAL_STAGES: ApplicationStage[] = ['hired', 'rejected'];

function BrandMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-violet-600 shadow-sm">
      <div className="relative h-4 w-4 text-white">
        <span className="absolute inset-x-0 top-0 mx-auto h-2 w-2 rounded-full border-2 border-current" />
        <span className="absolute inset-x-0 bottom-0 mx-auto h-3 w-4 rounded-sm border-2 border-current" />
      </div>
    </div>
  );
}

function ApplicationCard({
  app,
  selected,
  onSelect,
}: {
  app: SeekerApplication;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={[
        'rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md',
        selected ? 'border-violet-500 ring-1 ring-violet-500' : 'border-zinc-200',
      ].join(' ')}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">{app.jobTitle}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-600">
              <span className="font-semibold text-zinc-900">{app.companyName}</span>
              {app.companyVerified && (
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <span aria-hidden="true">✓</span> Verified
                </span>
              )}
              <span>📍 {app.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span aria-hidden="true">◷</span>
            <span>Applied {formatRelativeTime(app.appliedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>Updated {formatRelativeTime(app.updatedAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:flex-col lg:items-end">
          <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${STAGE_STYLES[app.stage]}`}>
            {STAGE_LABELS[app.stage]}
          </span>
          <button
            type="button"
            onClick={onSelect}
            className="text-sm font-semibold text-zinc-900 hover:text-violet-700"
          >
            View timeline ›
          </button>
        </div>
      </div>
    </article>
  );
}

function TimelinePanel({ app }: { app: SeekerApplication | null }) {
  const router = useRouter();

  if (!app) {
    return (
      <aside id="timeline" className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
        <p className="text-sm text-zinc-500">Select an application to see its timeline.</p>
      </aside>
    );
  }

  const currentIndex = APPLICATION_STAGE_ORDER.indexOf(app.stage);

  return (
    <aside id="timeline" className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm lg:sticky lg:top-6">
      <div className="space-y-6 p-6">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${STAGE_STYLES[app.stage]}`}>
          {STAGE_LABELS[app.stage]}
        </span>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">{app.jobTitle}</h2>
          <p className="mt-2 text-sm text-zinc-500">{app.companyName}</p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500">STATUS TIMELINE</p>
          <ol className="mt-5 space-y-5">
            {APPLICATION_STAGE_ORDER.map((stage, i) => {
              const reached = app.stage === 'rejected' ? i === 0 : i <= currentIndex;
              return (
                <li key={stage} className="flex gap-4">
                  <span
                    className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${reached ? 'bg-violet-600' : 'bg-zinc-300'}`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className={reached ? 'font-medium text-zinc-900' : 'text-zinc-500'}>{STAGE_LABELS[stage]}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {i === 0
                        ? formatRelativeTime(app.appliedAt)
                        : reached
                        ? 'Reached'
                        : 'Pending'}
                    </p>
                  </div>
                </li>
              );
            })}
            {app.stage === 'rejected' && (
              <li className="flex gap-4">
                <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
                <div>
                  <p className="font-medium text-zinc-900">Rejected</p>
                  <p className="mt-1 text-sm text-zinc-500">{formatRelativeTime(app.updatedAt)}</p>
                </div>
              </li>
            )}
          </ol>
        </div>
      </div>

      <div className="border-t border-zinc-200 bg-zinc-50 p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-zinc-900">Fit score: {app.fitScore}%</span>
        </div>

        <div className="mt-6 space-y-3">
          {(app.stage === 'offer' || app.stage === 'hired') && (
            <button
              onClick={async () => {
                const result = await offerAction.getOfferByApplication(app.id);
                if (result.success) router.push(`/Features/Offer/${result.data.id}`);
              }}
              className="w-full rounded-xl bg-[#148A50] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              💬 View offer & negotiation
            </button>
          )}
          <button
            onClick={() => router.push(`/Features/job_profile/${app.jobId}`)}
            className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            View job
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<SeekerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'active' | 'closed'>('all');

  useEffect(() => {
    (async () => {
      const result = await applicationAction.getMyApplications();
      if (result.success) {
        setApplications(result.data);
        if (result.data.length > 0) setSelectedId(result.data[0].id);
      } else {
        setError(result.message);
      }
      setLoading(false);
    })();
  }, []);

  const visibleApplications = useMemo(() => {
    if (tab === 'active') return applications.filter((a) => !TERMINAL_STAGES.includes(a.stage));
    if (tab === 'closed') return applications.filter((a) => TERMINAL_STAGES.includes(a.stage));
    return applications;
  }, [applications, tab]);

  const selectedApp = applications.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fafafa_0%,#f4f4f5_100%)] text-zinc-900">
      <AppHeader portal="seeker" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">My applications</h1>
            <p className="mt-3 text-sm text-zinc-500 sm:text-base">
              {loading ? 'Loading...' : `${applications.length} application${applications.length === 1 ? '' : 's'} · Real status updates from employers`}
            </p>
          </div>

          <a
            href="/Features/find_jobs"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
          >
            Find more jobs
          </a>
        </div>

        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">{error}</div>
        )}

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-100 p-1 sm:inline-flex">
          {(['all', 'active', 'closed'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={['rounded-xl px-5 py-2 text-sm font-semibold transition capitalize', tab === t ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'].join(' ')}
            >
              {t}
            </button>
          ))}
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.8fr)_minmax(340px,0.9fr)]">
          <section className="space-y-4">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl border border-zinc-200 bg-white animate-pulse" />
              ))
            ) : visibleApplications.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white px-8 py-16 text-center">
                <p className="text-base font-bold text-zinc-900">No applications here yet</p>
                <p className="mt-2 text-sm text-zinc-500">
                  {tab === 'all' ? 'Apply to jobs to see them tracked here.' : `You have no ${tab} applications.`}
                </p>
              </div>
            ) : (
              visibleApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  selected={app.id === selectedId}
                  onSelect={() => setSelectedId(app.id)}
                />
              ))
            )}
          </section>

          <TimelinePanel app={selectedApp} />
        </div>
      </main>

      <footer className="mt-auto border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xl font-bold tracking-tight text-zinc-900">Jopsphere</p>
            <p className="mt-2 text-sm text-zinc-500">Nepal&apos;s first verified job portal.</p>
          </div>
          <p className="text-sm text-zinc-500">© 2026 Jopsphere. Made in Nepal.</p>
        </div>
      </footer>
    </div>
  );
}