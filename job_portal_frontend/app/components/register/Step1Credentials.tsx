'use client';
import Homepage from "../../Features/homepage/page";
import { useState } from 'react';
import Link from 'next/link';
import { RegisterFormState } from './types';

interface Props {
  data: RegisterFormState;
  updateData: (patch: Partial<RegisterFormState>) => void;
  onNext: () => void;
}

export default function Step1Credentials({ data, updateData, onNext }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const inputClass = (name: string) =>
    `w-full h-11 px-4 rounded-lg text-sm text-[#171717] bg-white border transition-all outline-none ${
      focused === name
        ? 'border-[#6D4AFF] shadow-[0_0_0_4px_rgba(109,74,255,0.12)]'
        : 'border-[#E0E0E0] shadow-[0_1px_2px_rgba(16,16,16,0.03)]'
    }`;

  const handleContinue = () => {
    if (!data.email.trim() || !data.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!data.phone.trim() || data.phone.trim().length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (!data.password || data.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div>
      <h2 className="text-[27px] font-bold text-[#171717] tracking-[-0.4px]">Registration</h2>
      <p className="text-sm text-[#8A8A8A] mt-2 mb-8">Set up your account to start applying.</p>

      {error && (
        <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            placeholder="you@example.com"
            className={inputClass('email')}
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">Phone</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            onFocus={() => setFocused('phone')}
            onBlur={() => setFocused(null)}
            placeholder="98XXXXXXXX"
            className={inputClass('phone')}
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">Password</label>
          <input
            type="password"
            value={data.password}
            onChange={(e) => updateData({ password: e.target.value })}
            onFocus={() => setFocused('password')}
            onBlur={() => setFocused(null)}
            placeholder="••••••••"
            className={inputClass('password')}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-10">
        <Link
          href="/Features/homepage"
          className="h-10 px-5 flex items-center justify-center rounded-lg border border-[#DEDEDE] text-sm font-semibold text-[#171717] bg-white hover:bg-[#F7F7F7] transition-colors"
        >
          Back
        </Link>

        <div className="flex gap-3">
          <Link
            href="/"
            className="h-10 px-5 flex items-center justify-center rounded-lg border border-[#DEDEDE] text-sm font-semibold text-[#171717] bg-white hover:bg-[#F7F7F7] transition-colors"
          >
            Browse first
          </Link>

          <button
            type="button"
            onClick={handleContinue}
            className="h-10 px-6 rounded-lg text-sm font-bold text-white bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] shadow-[0_6px_16px_rgba(109,74,255,0.32)] hover:brightness-95 hover:-translate-y-px transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}