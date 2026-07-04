"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, Menu, Plus, X } from "lucide-react";

/**
 * Site-wide header for Jopsphere.
 * Drop this into `components/Header.tsx` and reuse it on every page:
 *
 *   <Header active="jobs" role="employer" />
 *
 * `active` controls which nav link is highlighted; `role` controls the
 * Employer / Jobseeker segmented toggle. Both are optional.
 */

type NavKey = "jobs" | "salary" | "applicants";
type Role = "employer" | "jobseeker";

const NAV_ITEMS: { key: NavKey; label: string; href: string }[] = [
  { key: "jobs", label: "View jobs", href: "/jobs" },
  { key: "salary", label: "Salary explorer", href: "/salary-explorer" },
  { key: "applicants", label: "Applicants", href: "/applicants" },
];

export default function Header({
  active,
  role = "employer",
}: {
  active?: NavKey;
  role?: Role;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--accent)]">
            <span className="absolute h-3.5 w-2 rounded-[1px] bg-[var(--surface)] left-[11px] top-[9px]" />
            <span className="absolute h-3 w-4 rounded-[1px] border-[1.6px] border-[var(--surface)] left-[8px] top-[11px]" />
          </span>
          <span className="font-display text-[21px] leading-none text-[var(--ink)]">
            Jopsphere
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`relative text-[14px] transition-colors hover:text-[var(--ink)] ${
                active === item.key
                  ? "text-[var(--ink)]"
                  : "text-[var(--ink-muted)]"
              }`}
            >
              {item.label}
              {active === item.key && (
                <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-[var(--accent)]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center rounded-full border border-[var(--border)] bg-[var(--bg)] p-0.5 text-[12px]">
            <span
              className={`rounded-full px-3 py-1 transition-colors ${
                role === "employer"
                  ? "bg-[var(--surface)] text-[var(--accent)] shadow-sm"
                  : "text-[var(--ink-muted)]"
              }`}
            >
              Employer
            </span>
            <span
              className={`rounded-full px-3 py-1 transition-colors ${
                role === "jobseeker"
                  ? "bg-[var(--surface)] text-[var(--accent)] shadow-sm"
                  : "text-[var(--ink-muted)]"
              }`}
            >
              Jobseeker
            </span>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-[8px] border border-[var(--border)] px-4 py-2 text-[13px] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
          >
            <LayoutDashboard size={14} strokeWidth={1.75} />
            Dashboard
          </Link>
          <Link
            href="/post-a-job"
            className="flex items-center gap-1.5 rounded-[8px] bg-[var(--accent)] px-4 py-2 text-[13px] text-[var(--surface)] transition-opacity hover:opacity-90"
          >
            <Plus size={14} strokeWidth={2} />
            Post a job
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--border)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`text-[14px] ${
                  active === item.key
                    ? "text-[var(--accent)]"
                    : "text-[var(--ink-muted)]"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-[var(--border)] pt-4">
              <Link
                href="/dashboard"
                className="rounded-[8px] border border-[var(--border)] px-4 py-2 text-center text-[13px] text-[var(--ink)]"
              >
                Dashboard
              </Link>
              <Link
                href="/post-a-job"
                className="rounded-[8px] bg-[var(--accent)] px-4 py-2 text-center text-[13px] text-[var(--surface)]"
              >
                Post a job
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}