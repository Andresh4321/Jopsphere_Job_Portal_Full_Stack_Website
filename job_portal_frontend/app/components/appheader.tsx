'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '../../lib/route';
import { authAction } from '../../lib/actions/auth.action';
import { jobSeekerAction } from '../../lib/actions/jobseeker.action';
import { companyAction } from '../../lib/actions/company.action';
import { getBackendImageUrl } from '../../lib/utils/image-url';
type Portal = 'seeker' | 'employer';

// `portal` is now just a fallback for anonymous/unknown visitors (e.g. a
// logged-out user browsing Find Jobs). Once we know who's actually logged
// in, that real role always wins — this is what stops an employer from
// clicking "Dashboard" on a shared page and landing on the seeker dashboard.
export default function AppHeader({ portal: fallbackPortal = 'seeker' }: { portal?: Portal }) {
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [actualRole, setActualRole] = useState<Portal | null>(null);

  useEffect(() => {
    const storedRole = authAction.getStoredRole(); // 'job_seeker' | 'employer' | null
    setActualRole(storedRole === 'employer' ? 'employer' : storedRole === 'job_seeker' ? 'seeker' : null);
  }, []);

  const portal: Portal = actualRole ?? fallbackPortal;

  useEffect(() => {
    // Only fetch profile data if user is authenticated
    if (!authAction.isAuthenticated()) return;

    (async () => {
      try {
        if (portal === 'seeker') {
          const result = await jobSeekerAction.getMyProfile();
          if (result.success) {
            setDisplayName(result.data.fullName);
            setAvatarUrl(getBackendImageUrl(result.data.profileImage, '/Profile.png'));
          }
        } else {
          const result = await companyAction.getMyCompany();
          if (result.success) {
            setDisplayName(result.data.companyName);
            setAvatarUrl(getBackendImageUrl(result.data.companyLogo, '/company.png'));
          }
        }
      } catch {
        // Silently fail — header still renders with defaults
      }
    })();
  }, [portal]);

  const dashboardHref = portal === 'seeker' ? ROUTES.seekerDashboard : ROUTES.employerDashboard;

  const navLinks =
    portal === 'seeker'
      ? [
          { label: 'Dashboard', href: dashboardHref },
          { label: 'Find Jobs', href: ROUTES.findJobs },
          { label: 'Salary Explorer', href: ROUTES.salaryExplorer },
          { label: 'My Applications', href: ROUTES.myApplications },
          { label: 'Companies', href: ROUTES.companyList },
        ]
      : [
          { label: 'Dashboard', href: dashboardHref },
          { label: 'Find Jobs', href: ROUTES.findJobs },
          { label: 'Salary Explorer', href: ROUTES.salaryExplorer },
          { label: 'Applicants', href: ROUTES.applicants },
          { label: 'Companies', href: ROUTES.companyList },
        ];

  const handleLogout = () => {
    authAction.logout();
    router.push(ROUTES.login);
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-white border-b border-neutral-200">
      <div className="mx-auto h-full max-w-[1280px] flex items-center justify-between px-6 lg:px-10">
        {/* Logo — links to this portal's own dashboard */}
        <Link href={dashboardHref} className="flex items-center gap-2.5 flex-shrink-0">
          <img src="/logo.png" alt="Jopsphere" className="w-9 h-9 rounded-lg object-contain" />
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

        {/* Right side — avatar+name, then messages icon, then logout */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {displayName && (
            <span className="hidden sm:flex items-center gap-2 text-sm text-neutral-700">
              <img
                src={avatarUrl || (portal === 'seeker' ? '/Profile.png' : '/company.png')}
                alt=""
                className="w-7 h-7 rounded-full object-cover border border-neutral-200"
                onError={(e) => { (e.target as HTMLImageElement).src = portal === 'seeker' ? '/Profile.png' : '/company.png'; }}
              />
              {displayName}
            </span>
          )}

          <Link
            href={ROUTES.messages}
            aria-label="Messages"
            className="w-8 h-8 flex items-center justify-center rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

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