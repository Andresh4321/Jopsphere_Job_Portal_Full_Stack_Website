'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '../../lib/route';
import { authAction } from '../../lib/actions/auth.action';
import { jobSeekerAction } from '../../lib/actions/jobseeker.action';
import { companyAction } from '../../lib/actions/company.action';

type Portal = 'seeker' | 'employer';

export default function AppHeader({ portal }: { portal: Portal }) {
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (portal === 'seeker') {
        const result = await jobSeekerAction.getMyProfile();
        if (result.success) setDisplayName(result.data.fullName);
      } else {
        const result = await companyAction.getMyCompany();
        if (result.success) setDisplayName(result.data.companyName);
      }
    })();
  }, [portal]);

  const navLinks =
    portal === 'seeker'
      ? [
        { label: 'Dashboard', href: ROUTES.seekerDashboard },
          { label: 'Find Jobs', href: ROUTES.findJobs },
          { label: 'Salary Explorer', href: ROUTES.salaryExplorer },
          { label: 'My Applications', href: ROUTES.myApplications },
          { label: 'Companies', href: ROUTES.companyList },
        ]
      : [
          
          { label: 'Find Jobs', href: ROUTES.findJobs },
          { label: 'Salary Explorer', href: ROUTES.salaryExplorer },
          { label: 'Applicants', href: ROUTES.applicants },
          { label: 'Companies', href: ROUTES.companyList },
        ];

  const dashboardHref = portal === 'seeker' ? ROUTES.seekerDashboard : ROUTES.employerDashboard;

  const handleLogout = () => {
    authAction.logout();
    router.push(ROUTES.login);
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-white border-b border-neutral-200">
      <div className="mx-auto h-full max-w-[1280px] flex items-center justify-between px-6 lg:px-10">
        {/* Logo — links to this portal's own dashboard */}
        <Link href={dashboardHref} className="flex items-center gap-2.5 flex-shrink-0">
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="5.5" r="3" stroke="white" strokeWidth="1.8" />
              <path d="M2.5 16c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-xl font-bold text-neutral-900 hidden sm:inline">Jopsphere</span>
        </Link>

        {/* Nav — same component, different links per portal */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive ? 'font-semibold text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side — replaces the old "Dashboard" button with identity + logout */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {displayName && (
            <span className="hidden sm:flex items-center gap-2 text-sm text-neutral-700">
              <span className="w-7 h-7 rounded-full bg-[#F0ECFF] text-[#6D4AFF] text-xs font-bold flex items-center justify-center">
                {displayName[0]?.toUpperCase()}
              </span>
              {displayName}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="h-8 px-4 rounded border border-neutral-200 text-xs font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}