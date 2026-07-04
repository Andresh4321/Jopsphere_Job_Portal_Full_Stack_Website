'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginShell from '../../components/login/LoginShell';
import { authAction } from '../../../lib/actions/auth.action';

// Maps backend role -> actual dashboard route in this project.
// Kept here (not trusted from the backend's `redirectTo`) so the frontend
// routing stays correct even if these paths change independently of the API.
const DASHBOARD_ROUTES: Record<'job_seeker' | 'employer', string> = {
  job_seeker: '/Features/seeker_dashboard',
  employer: '/Features/employer_dashboard',
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const inputClass = (name: string) =>
    `w-full h-11 px-4 rounded-lg text-sm text-[#171717] bg-white border transition-all outline-none ${
      focused === name
        ? 'border-[#6D4AFF] shadow-[0_0_0_4px_rgba(109,74,255,0.12)]'
        : 'border-[#E0E0E0] shadow-[0_1px_2px_rgba(16,16,16,0.03)]'
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const result = await authAction.login({ email, password });

      if (!result.success) {
        setError(result.message);
        return;
      }

      const destination = DASHBOARD_ROUTES[result.data.role];
      router.push(destination ?? '/');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LoginShell>
      <h2 className="text-[27px] font-bold text-[#171717] tracking-[-0.4px]">Welcome back</h2>
      <p className="text-sm text-[#8A8A8A] mt-2 mb-8">Sign in to continue to your dashboard.</p>

      {error && (
        <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass('email')}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[13px] font-semibold text-[#171717]">Password</label>
            <Link href="/forgot-password" className="text-[13px] font-semibold text-[#6D4AFF] hover:text-[#5F3CF0] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`${inputClass('password')} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#9A9A9A] hover:text-[#171717] transition-colors"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-11 rounded-lg text-sm font-bold text-white bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] shadow-[0_6px_16px_rgba(109,74,255,0.32)] hover:brightness-95 hover:-translate-y-px transition-all disabled:opacity-60 disabled:translate-y-0 mt-2"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-[#8A8A8A] mt-8">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-[#6D4AFF] hover:text-[#5F3CF0] transition-colors">
          Register
        </Link>
      </p>
    </LoginShell>
  );
}