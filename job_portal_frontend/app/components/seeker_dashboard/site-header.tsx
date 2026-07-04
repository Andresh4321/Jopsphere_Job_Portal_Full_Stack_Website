import { Briefcase } from "lucide-react";

const NAV_LINKS = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Salary Explorer", href: "/salaries" },
  { label: "My Applications", href: "/applications" },
  { label: "Companies", href: "/companies" },
];

export type DashboardRole = "seeker" | "employer";

export interface SiteHeaderProps {
  /** Which side of the Seeker/Employer toggle is highlighted. */
  active: DashboardRole;
}

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-[#F8F7F3]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-6">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#735CC7] text-white shadow-sm shadow-[#735CC7]/30">
            <Briefcase className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <span
            className="text-[22px] leading-none text-neutral-900"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Jopsphere
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={`/dashboard/${active}`}
            className="rounded-full bg-[#735CC7] px-5 py-2 text-sm font-medium text-white shadow-sm shadow-[#735CC7]/30 transition-opacity hover:opacity-90"
          >
            Dashboard
          </a>
        </div>
      </div>
    </header>
  );
}