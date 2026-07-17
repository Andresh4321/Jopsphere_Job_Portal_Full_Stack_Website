'use client';

import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const FOOTER_LINKS = [
  { label: 'How it works', href: '/how-it-works' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Contact', href: '/contact' },
];

const STEP_LABELS = ['Credentials', 'Choose role', 'Profile details'];

export default function RegisterShell({
  step,
  children,
}: {
  step: 1 | 2 | 3;
  children: React.ReactNode;
}) {
  const progressPct = (step / 3) * 100;

  return (
    <div className={`${inter.className} min-h-screen bg-[#FAFAFA] relative overflow-hidden`}>
      {/* Navbar */}
      <header className="w-full h-[72px] fixed top-0 left-0 bg-white/90 backdrop-blur border-b border-[#EDEDED] z-20">
        <div className="max-w-7xl mx-auto h-full flex items-center px-8 lg:px-24">
          <img src="/logo.png" alt="Jopsphere" className="w-[38px] h-[38px] rounded-[10px] object-contain" />
          <span className="ml-3 text-[27px] font-bold text-[#171717] tracking-[-0.6px]">
            Jopsphere
          </span>
        </div>
      </header>

      {/* Decorative background blobs (desktop only) */}
      <div className="hidden lg:block absolute w-80 h-80 left-[6%] top-[160px] bg-[#F8F5FF] rounded-full blur-[2px] pointer-events-none" />
      <div className="hidden lg:block absolute w-[22rem] h-[22rem] right-[4%] top-[160px] bg-[#F0ECFF] rounded-full blur-[2px] pointer-events-none" />
      <div className="hidden lg:block absolute w-56 h-56 left-[10%] bottom-[10%] opacity-50 bg-[#FFF4D8] rounded-full blur-[2px] pointer-events-none" />
      <div className="hidden lg:block absolute w-56 h-56 right-[8%] bottom-[10%] opacity-60 bg-[#EAF8F0] rounded-full blur-[2px] pointer-events-none" />

      {/* Main */}
      <main className="relative z-10 max-w-[544px] mx-auto pt-[140px] pb-24 px-4">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[14.5px] font-bold text-[#171717] tracking-[0.1px]">
            Step {step} of 3 &middot; {STEP_LABELS[step - 1]}
          </span>
          <span className="text-sm font-medium text-[#9A9A9A]">~1 min</span>
        </div>
        <div className="w-full h-[6px] bg-[#ECE8FF] rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8467FF] to-[#6D4AFF] rounded-full shadow-[0_1px_4px_rgba(109,74,255,0.35)] transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Card */}
        <div className="bg-white border border-[#EDEDED] rounded-[14px] shadow-[0_1px_2px_rgba(16,16,16,0.03),0_12px_32px_rgba(16,16,16,0.06)] p-10 overflow-hidden">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-[#EDEDED] mt-10">
        <div className="max-w-7xl mx-auto px-8 lg:px-24 py-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[21px] font-bold text-[#171717] tracking-[-0.3px]">Jopsphere</div>
            <div className="text-sm text-[#8A8A8A] mt-1">Nepal&apos;s first verified job portal.</div>
          </div>
          <nav className="flex gap-8">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#8A8A8A] hover:text-[#171717] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="text-[13.5px] text-[#B0B0B0]">© 2026 Jopsphere. Made in Nepal.</div>
        </div>
      </footer>
    </div>
  );
}