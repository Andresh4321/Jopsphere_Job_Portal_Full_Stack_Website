'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAction } from '../../../../lib/actions/auth.action';
import { ROUTES } from '../../../../lib/route';

// This page handles the case where someone navigates to /Features/offer/offernegotiation
// without an offer ID — redirect them to their dashboard.
export default function OfferNegotiationIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const role = authAction.getStoredRole();
    if (role === 'employer') {
      router.replace(ROUTES.employerDashboard);
    } else {
      router.replace(ROUTES.seekerDashboard);
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <p className="text-sm text-neutral-500">Redirecting...</p>
    </main>
  );
}
