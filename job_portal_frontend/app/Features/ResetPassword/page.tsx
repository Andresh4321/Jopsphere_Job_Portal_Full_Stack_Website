'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LoginShell from '@/app/components/login/LoginShell';
import { ROUTES } from '@/lib/route';
import { authAction } from '@/lib/actions/auth.action';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await authAction.resetPassword(token, password);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
  };

  return (
    <LoginShell>
      {!success ? (
        <>
          <h1 className="text-[27px] font-bold text-[#171717] tracking-[-0.4px] mb-2">
            Reset your password
          </h1>
          <p className="text-sm text-[#8A8A8A] mb-8">
            Enter a new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#171717] mb-1.5">
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="At least 8 characters"
                required
                className="w-full h-[46px] px-4 rounded-[10px] border border-[#E0E0E0] text-sm text-[#171717] placeholder:text-[#B0B0B0] outline-none transition-all focus:border-[#6D4AFF] focus:shadow-[0_0_0_4px_rgba(109,74,255,0.12)]"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#171717] mb-1.5">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                placeholder="Re-enter your password"
                required
                className="w-full h-[46px] px-4 rounded-[10px] border border-[#E0E0E0] text-sm text-[#171717] placeholder:text-[#B0B0B0] outline-none transition-all focus:border-[#6D4AFF] focus:shadow-[0_0_0_4px_rgba(109,74,255,0.12)]"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[46px] rounded-[10px] bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] text-white text-sm font-semibold shadow-[0_4px_10px_rgba(109,74,255,0.28)] hover:shadow-[0_6px_16px_rgba(109,74,255,0.35)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#EDFBF3] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17l-5-5"
                stroke="#22C55E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-[27px] font-bold text-[#171717] tracking-[-0.4px] mb-2">
            Password reset successfully
          </h2>
          <p className="text-sm text-[#8A8A8A] mb-8">
            Password reset successfully. You can now sign in.
          </p>
          <Link
            href={ROUTES.login}
            className="inline-block w-full h-[46px] leading-[46px] rounded-[10px] bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] text-white text-sm font-semibold shadow-[0_4px_10px_rgba(109,74,255,0.28)] hover:shadow-[0_6px_16px_rgba(109,74,255,0.35)] transition-all text-center"
          >
            Sign In
          </Link>
        </div>
      )}
    </LoginShell>
  );
}
