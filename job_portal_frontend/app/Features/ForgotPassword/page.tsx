'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginShell from '@/app/components/login/LoginShell';
import { ROUTES } from '@/lib/route';
import { authAction } from '@/lib/actions/auth.action';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await authAction.forgotPassword(email);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <LoginShell>
      {!submitted ? (
        <>
          <h1 className="text-[27px] font-bold text-[#171717] tracking-[-0.4px] mb-2">
            Forgot password?
          </h1>
          <p className="text-sm text-[#8A8A8A] mb-8">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#171717] mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-[46px] px-4 rounded-[10px] border border-[#E0E0E0] text-sm text-[#171717] placeholder:text-[#B0B0B0] outline-none transition-all focus:border-[#6D4AFF] focus:shadow-[0_0_0_4px_rgba(109,74,255,0.12)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[46px] rounded-[10px] bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] text-white text-sm font-semibold shadow-[0_4px_10px_rgba(109,74,255,0.28)] hover:shadow-[0_6px_16px_rgba(109,74,255,0.35)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href={ROUTES.login}
              className="text-sm font-medium text-[#6D4AFF] hover:text-[#7C5CFF] transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#F3EEFF] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                stroke="#6D4AFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-[27px] font-bold text-[#171717] tracking-[-0.4px] mb-2">
            Check your email
          </h2>
          <p className="text-sm text-[#8A8A8A] mb-8">
            If an account exists with that email, we&apos;ve sent a reset link.
          </p>
          <Link
            href={ROUTES.login}
            className="inline-block w-full h-[46px] leading-[46px] rounded-[10px] bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] text-white text-sm font-semibold shadow-[0_4px_10px_rgba(109,74,255,0.28)] hover:shadow-[0_6px_16px_rgba(109,74,255,0.35)] transition-all text-center"
          >
            Back to Sign In
          </Link>
        </div>
      )}
    </LoginShell>
  );
}
