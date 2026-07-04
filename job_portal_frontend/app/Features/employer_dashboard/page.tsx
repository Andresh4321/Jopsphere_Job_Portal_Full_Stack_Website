import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import {
  Briefcase,
  Users,
  Star,
  Send,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  MoreHorizontal,
  MapPin,
  Clock3,
  ChevronRight,
} from "lucide-react";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});
const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

// ---------------------------------------------------------------------------
// Mock data — swap for real data fetching later
// ---------------------------------------------------------------------------

const stats = [
  { label: "Active jobs", value: "6", sub: "Published", icon: Briefcase },
  { label: "Total applicants", value: "54", sub: "All time", icon: Users },
  { label: "Shortlisted", value: "12", sub: "In review", icon: Star },
  { label: "Offers sent", value: "0", sub: "Awaiting", icon: Send },
];

const jobPosts = [
  {
    title: "Frontend Engineer (React)",
    location: "Kathmandu",
    type: "Full-time",
    posted: "2d ago",
    applicants: 9,
  },
  {
    title: "Product Designer",
    location: "Lalitpur",
    type: "Full-time",
    posted: "5d ago",
    applicants: 9,
  },
  {
    title: "Content Writer",
    location: "Remote · Nepal",
    type: "Remote",
    posted: "1d ago",
    applicants: 9,
  },
  {
    title: "Sales Executive",
    location: "Kathmandu",
    type: "Full-time",
    posted: "7d ago",
    applicants: 9,
  },
];

const applicants = [
  {
    initials: "SK",
    name: "Sneha Karki",
    tag: "Generalist · 1+ yrs",
    applied: "Applied today",
    fit: 77,
    status: "Interview",
    statusTone: "accent",
  },
  {
    initials: "SK",
    name: "Sushmita KC",
    tag: "React · 3+ yrs",
    applied: "Applied today",
    fit: 91,
    status: "New",
    statusTone: "brand",
  },
  {
    initials: "BA",
    name: "Bibek Adhikari",
    tag: "Generalist · 1+ yrs",
    applied: "Applied today",
    fit: 77,
    status: "Shortlisted",
    statusTone: "neutral",
  },
  {
    initials: "SB",
    name: "Saurav Bhandari",
    tag: "React · 6+ yrs",
    applied: "Applied today",
    fit: 92,
    status: "Rejected",
    statusTone: "danger",
  },
  {
    initials: "PR",
    name: "Pratiksha Rai",
    tag: "Node.js · 1+ yrs",
    applied: "Applied today",
    fit: 78,
    status: "New",
    statusTone: "brand",
  },
];

const pipeline = [
  { label: "New", count: 18, color: "#DAD2F2" },
  { label: "Reviewed", count: 12, color: "#B7A7E6" },
  { label: "Shortlisted", count: 12, color: "#8F79D6" },
  { label: "Interview", count: 6, color: "#6D56C4" },
  { label: "Offer", count: 0, color: "#E2963A" },
  { label: "Hired", count: 0, color: "#1C8A63" },
  { label: "Rejected", count: 6, color: "#E3B7B5" },
];

const totalApplicants = pipeline.reduce((sum, s) => sum + s.count, 0);

const statusStyles: Record<string, string> = {
  brand: "bg-[var(--brand-soft)] text-[var(--brand)]",
  accent: "bg-[var(--accent-soft)] text-[#8a5a17]",
  neutral: "bg-[var(--neutral-soft)] text-[var(--ink-soft)]",
  danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
};

export default function EmployerDashboard() {
  return (
    <div
      className={`${dmSerif.variable} ${dmSans.variable} ${jbMono.variable} min-h-screen font-[family-name:var(--font-body)]`}
      style={
        {
          "--bg": "#FAF8F4",
          "--surface": "#FFFFFF",
          "--border": "#E6E2D8",
          "--ink": "#17140F",
          "--ink-soft": "#6E6A61",
          "--brand": "#6D56C4",
          "--brand-dark": "#5A45A8",
          "--brand-soft": "#F1EEFA",
          "--accent": "#E2963A",
          "--accent-soft": "#FBF0DF",
          "--success": "#1C8A63",
          "--success-soft": "#E7F5EF",
          "--danger": "#D2453F",
          "--danger-soft": "#FBEAEA",
          "--neutral-soft": "#F0EEE9",
          backgroundColor: "var(--bg)",
          color: "var(--ink)",
        } as React.CSSProperties
      }
    >
      {/* ---------------------------------------------------------------- */}
      {/* Top nav                                                          */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--brand)]">
              <Briefcase className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="font-[family-name:var(--font-display)] text-[22px] leading-none">
              Jopsphere
            </span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {["View jobs", "Salary explorer", "Applicants"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[14px] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
              >
                {item}
              </a>
            ))}
          </nav>

          <button className="rounded-md bg-[var(--brand)] px-5 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90">
            Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-6 py-10">
        {/* -------------------------------------------------------------- */}
        {/* Page heading                                                   */}
        {/* -------------------------------------------------------------- */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="mb-3 inline-block rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-[var(--brand)]">
              EMPLOYER
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-[34px] leading-tight text-[var(--ink)]">
              Welcome back, Leapfrog
            </h1>
            <p className="mt-1.5 text-[14px] text-[var(--ink-soft)]">
              Your hiring at a glance.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 py-2.5 text-[13px] font-medium text-[var(--ink)] transition-colors hover:border-[var(--brand)]">
              <Users className="h-3.5 w-3.5" />
              View applicants
            </button>
            <button className="flex items-center gap-2 rounded-md bg-[var(--brand)] px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90">
              <Sparkles className="h-3.5 w-3.5" />
              Post a job
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Stat strip                                                     */}
        {/* -------------------------------------------------------------- */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, sub, icon: Icon }) => (
            <div
              key={label}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wide text-[var(--ink-soft)]">
                  {label.toUpperCase()}
                </span>
                <Icon className="h-4 w-4 text-[var(--brand)]" strokeWidth={1.75} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-[family-name:var(--font-display)] text-[30px] leading-none">
                  {value}
                </span>
                <span className="text-[11px] text-[var(--ink-soft)]">{sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Main grid: content + rail                                      */}
        {/* -------------------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          {/* ============================= Left column ================= */}
          <div className="flex flex-col gap-6">
            {/* Job posts */}
            <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-[family-name:var(--font-display)] text-[19px]">
                  Your job posts
                </h2>
                <a
                  href="#"
                  className="flex items-center gap-1 text-[12px] text-[var(--ink-soft)] hover:text-[var(--brand)]"
                >
                  View all <ChevronRight className="h-3 w-3" />
                </a>
              </div>

              <div className="flex flex-col">
                {jobPosts.map((job, i) => (
                  <div
                    key={job.title}
                    className={`flex flex-wrap items-center justify-between gap-3 py-4 ${
                      i !== jobPosts.length - 1 ? "border-b border-[var(--border)]" : ""
                    }`}
                  >
                    <div className="min-w-[200px] flex-1">
                      <p className="text-[14px] font-medium text-[var(--ink)]">
                        {job.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--ink-soft)]">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {job.location}
                        </span>
                        <span>{job.type}</span>
                        <span className="flex items-center gap-1">
                          <Clock3 className="h-3 w-3" /> Posted {job.posted}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-[11px] text-[var(--ink-soft)]">
                        <Users className="h-3.5 w-3.5" />
                        {job.applicants} applicants
                      </span>
                      <button className="rounded-md border border-[var(--border)] bg-white px-4 py-2 text-[13px] font-medium text-[var(--ink)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent applicants */}
            <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-[family-name:var(--font-display)] text-[19px]">
                  Recent applicants
                </h2>
                <a
                  href="#"
                  className="flex items-center gap-1 text-[12px] text-[var(--ink-soft)] hover:text-[var(--brand)]"
                >
                  Open pipeline <ChevronRight className="h-3 w-3" />
                </a>
              </div>

              <div className="flex flex-col">
                {applicants.map((a, i) => (
                  <div
                    key={a.name}
                    className={`flex flex-wrap items-center justify-between gap-3 py-4 ${
                      i !== applicants.length - 1 ? "border-b border-[var(--border)]" : ""
                    }`}
                  >
                    <div className="flex min-w-[220px] flex-1 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[12px] font-medium text-[var(--brand)]">
                        {a.initials}
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-[var(--ink)]">
                          {a.name}
                        </p>
                        <p className="text-[12px] text-[var(--ink-soft)]">
                          {a.tag} · {a.applied}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] font-medium text-[var(--brand)]">
                        {a.fit}% fit
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-medium ${statusStyles[a.statusTone]}`}
                      >
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Pipeline snapshot — signature element */}
            <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-[family-name:var(--font-display)] text-[19px]">
                  Pipeline snapshot
                </h2>
                <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--ink-soft)]">
                  {totalApplicants} applicants total
                </span>
              </div>

              {/* proportional funnel bar */}
              <div className="flex h-8 w-full overflow-hidden rounded-md border border-[var(--border)]">
                {pipeline
                  .filter((s) => s.count > 0)
                  .map((s) => (
                    <div
                      key={s.label}
                      style={{
                        width: `${(s.count / totalApplicants) * 100}%`,
                        backgroundColor: s.color,
                      }}
                      className="h-full first:rounded-l-md last:rounded-r-md"
                      title={`${s.label}: ${s.count}`}
                    />
                  ))}
              </div>

              {/* legend */}
              <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                {pipeline.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-[12px] text-[var(--ink-soft)]">{s.label}</span>
                    <span className="ml-auto font-[family-name:var(--font-mono)] text-[13px] text-[var(--ink)]">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ============================= Right rail =================== */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success-soft)]">
                <ShieldCheck className="h-5 w-5 text-[var(--success)]" strokeWidth={1.75} />
              </div>
              <h3 className="mb-2 text-[14px] font-medium">Company verified</h3>
              <p className="mb-5 text-[12px] leading-relaxed text-[var(--ink-soft)]">
                Business registration, phone, and 42 successful hires confirmed.
              </p>
              <button className="w-full rounded-md border border-[var(--border)] bg-white py-2.5 text-[13px] font-medium text-[var(--ink)] transition-colors hover:border-[var(--brand)]">
                View company profile
              </button>
            </section>

            <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                <ArrowUpRight className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.75} />
              </div>
              <h3 className="mb-2 text-[14px] font-medium">Post smarter</h3>
              <p className="mb-5 text-[12px] leading-relaxed text-[var(--ink-soft)]">
                Jobs with disclosed salaries get 2.4x more qualified applicants.
              </p>
              <button className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--brand)] py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90">
                <Sparkles className="h-3.5 w-3.5" />
                Post a job
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* Footer                                                           */}
      {/* ---------------------------------------------------------------- */}
      <footer className="mt-16 border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-start justify-between gap-6 px-6 py-10">
          <div>
            <span className="font-[family-name:var(--font-display)] text-[20px]">
              Jopsphere
            </span>
            <p className="mt-2 text-[12px] text-[var(--ink-soft)]">
              Nepal&apos;s first verified job portal.
            </p>
          </div>

          <div className="flex gap-8">
            {["How it works", "FAQ", "Privacy", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[12px] text-[var(--ink-soft)] hover:text-[var(--ink)]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-[1240px] px-6 pb-8 text-[11px] text-[var(--ink-soft)]">
          © 2026 Jopsphere. Made in Nepal.
        </div>
      </footer>
    </div>
  );
}