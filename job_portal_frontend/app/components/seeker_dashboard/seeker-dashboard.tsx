import Link from "next/link";
import {
  MapPin,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  ChevronRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DashboardStat {
  label: string;
  value: string;
  sub?: string | null;
}

export type ApplicationStatus = "Interview" | "Viewed" | "Applied" | "Offer";

export interface ApplicationItem {
  jobId: string; // added: needed to link each row to its job profile
  title: string;
  company: string;
  appliedAgo: string;
  status: ApplicationStatus;
}

export interface RecommendedJob {
  jobId: string; // added: needed to link each card to its job profile
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  verified?: boolean;
}

export interface SeekerDashboardProps {
  userName: string;
  stats: DashboardStat[];
  applications: ApplicationItem[];
  recommendedJobs: RecommendedJob[];
  profileCompleteness: number;
  verifications: string[];
  savedJobsCount?: number;
}

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Interview: "bg-amber-100/80 text-neutral-900",
  Viewed: "bg-violet-100 text-violet-700",
  Applied: "bg-neutral-100 text-neutral-900",
  Offer: "bg-emerald-100 text-emerald-700",
};

// ---------------------------------------------------------------------------
// Sane defaults so the component renders sensibly even with no props passed
// ---------------------------------------------------------------------------

export const DEFAULT_SEEKER_DASHBOARD_PROPS: SeekerDashboardProps = {
  userName: "Aarati",
  stats: [
    { label: "Applications", value: "5", sub: "All time" },
    { label: "Active", value: "4", sub: "Awaiting a reply" },
    { label: "Interviews & offers", value: "2", sub: null },
    { label: "Response rate", value: "60%", sub: "From verified employers" },
  ],
  applications: [
    {
      jobId: "",
      title: "Frontend Engineer (React)",
      company: "Leapfrog Technology",
      appliedAgo: "Applied 6d ago",
      status: "Interview",
    },
  ],
  recommendedJobs: [
    {
      jobId: "",
      title: "Frontend Engineer (React)",
      company: "Leapfrog Technology",
      location: "Kathmandu",
      salary: "NPR 80k\u2013130k",
      match: 91,
    },
  ],
  profileCompleteness: 72,
  verifications: [
    "Phone verified",
    "ID verified",
    "Education verified",
    "Resume uploaded",
  ],
  savedJobsCount: 0,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SeekerDashboard({
  userName,
  stats,
  applications,
  recommendedJobs,
  profileCompleteness,
  verifications,
  savedJobsCount = 0,
}: SeekerDashboardProps) {
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-10">
      <WelcomeSection userName={userName} />
      <StatsGrid stats={stats} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <ApplicationsCard applications={applications} />
          <RecommendedJobsCard jobs={recommendedJobs} />
        </div>
        <aside className="flex flex-col gap-6">
          <SavedJobsCard count={savedJobsCount} />
          <ProfileCompletenessCard percent={profileCompleteness} />
          <VerificationCard items={verifications} />
          <KnowYourWorthCard />
        </aside>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Welcome
// ---------------------------------------------------------------------------

function WelcomeSection({ userName }: { userName: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
          Job seeker
        </span>
        <h1
          className="mt-4 text-[32px] leading-tight text-neutral-900 sm:text-[36px]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Welcome back, {userName}
        </h1>
        <p className="mt-1.5 text-sm text-neutral-500">
          Here&apos;s how your job hunt is going.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/Features/Applications"
          className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
        >
          My applications
        </Link>
        <Link
          href="/Features/Findjob"
          className="rounded-lg bg-[#735CC7] px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-[#735CC7]/30 transition-opacity hover:opacity-90"
        >
          Find job
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

function StatsGrid({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            {stat.label}
          </p>
          <p
            className="mt-2 text-[26px] leading-none text-neutral-900"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {stat.value}
          </p>
          {stat.sub && (
            <p className="mt-2 text-[11px] text-neutral-500">{stat.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

function ApplicationsCard({
  applications,
}: {
  applications: ApplicationItem[];
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2
          className="text-lg text-neutral-900"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Your applications
        </h2>
        <Link
          href="/Features/Applications"
          className="flex items-center gap-0.5 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {applications.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">
          You haven&apos;t applied to any jobs yet.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-neutral-100">
          {applications.map((app) => (
            <li key={app.jobId + app.title}>
              <Link
                href={`/Features/job_profile/${app.jobId}`}
                className="flex flex-wrap items-center justify-between gap-3 py-4 transition-colors hover:bg-neutral-50/60 -mx-2 px-2 rounded-lg"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {app.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                    {app.company}
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-neutral-300">&middot;</span>
                    {app.appliedAgo}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium ${STATUS_STYLES[app.status]}`}
                >
                  {app.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Recommended jobs
// ---------------------------------------------------------------------------

function RecommendedJobsCard({ jobs }: { jobs: RecommendedJob[] }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2
          className="text-lg text-neutral-900"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Recommended for you
        </h2>
        <Link
          href="/Features/Findjob"
          className="flex items-center gap-0.5 text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          Browse jobs
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">
          No recommendations yet — complete your profile to get better matches.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <Link
              key={job.jobId}
              href={`/Features/job_profile/${job.jobId}`}
              className="group relative block rounded-xl border border-neutral-200 p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50/60"
            >
              <button
                type="button"
                aria-label="Save job"
                onClick={(e) => e.preventDefault()}
                className="absolute right-3 top-3 text-neutral-300 transition-colors hover:text-[#735CC7]"
              >
                <Bookmark className="h-4 w-4" />
              </button>

              <p className="pr-6 text-sm font-medium text-neutral-900">
                {job.title}
              </p>
              <p className="mt-1.5 flex items-center gap-1 text-xs text-neutral-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {job.company} &middot; {job.location}
                </span>
              </p>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-900">
                  {job.salary}
                </p>
                <span className="flex items-center gap-1 text-xs font-medium text-[#735CC7]">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {job.match}% match
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sidebar cards
// ---------------------------------------------------------------------------

function SavedJobsCard({ count }: { count: number }) {
  if (count > 0) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-[15px] font-medium text-neutral-900">
          Saved jobs
        </h2>
        <p className="mt-3 text-sm text-neutral-500">
          You have {count} saved job{count === 1 ? "" : "s"}.
        </p>
        <Link
          href="/Features/savedjobs"
          className="mt-5 inline-block rounded-lg border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
        >
          View saved jobs
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
      <h2 className="text-left text-[15px] font-medium text-neutral-900">
        Saved jobs
      </h2>
      <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-neutral-300 text-neutral-400">
        <Bookmark className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm text-neutral-500">
        You haven&apos;t saved any jobs yet.
      </p>
      <Link
        href="/Features/Findjob"
        className="mt-5 inline-block rounded-lg border border-neutral-200 px-5 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
      >
        Explore jobs
      </Link>
    </section>
  );
}

function ProfileCompletenessCard({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-neutral-900">
          Profile completeness
        </h2>
        <span className="text-sm font-medium text-neutral-500">
          {clamped}%
        </span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E4E1F4]">
        <div
          className="h-full rounded-full bg-[#735CC7]"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-neutral-500">
        Verified profiles get 3x more employer replies.
      </p>
      <Link
        href="/Features/Applications"
        className="mt-5 block rounded-lg border border-neutral-200 px-5 py-2 text-center text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
      >
        Complete profile
      </Link>
    </section>
  );
}

function VerificationCard({ items }: { items: string[] }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-[15px] font-medium text-neutral-900">
        Verification
      </h2>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2.5 text-sm text-neutral-900"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function KnowYourWorthCard() {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-[15px] font-medium text-neutral-900">
        Know your worth
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500">
        See real salary ranges from verified employers in Nepal.
      </p>
      <Link
        href="/Features/salary_explorer"
        className="mt-5 block rounded-lg border border-neutral-200 px-5 py-2 text-center text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
      >
        Explore salaries
      </Link>
    </section>
  );
}