import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import { EmployerDashboard } from '../../components/employer_dashboard/employer_dashboard';
import { SiteHeader } from '../../components/seeker_dashboard/site-header';
import { SiteFooter } from '../../components/seeker_dashboard/site-footer';
import AppHeader from '../../components/appheader';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
});

export default function EmployerDashboardPage() {
  return (
    <div
      className={`${dmSans.variable} ${dmSerif.variable} min-h-screen bg-[#F8F7F3] font-sans text-neutral-900 antialiased`}
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <AppHeader portal="employer" />
      <EmployerDashboard />
      <SiteFooter />
    </div>
  );
}