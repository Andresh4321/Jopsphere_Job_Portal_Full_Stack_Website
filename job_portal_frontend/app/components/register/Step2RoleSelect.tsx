'use client';

import { useState } from 'react';
import { RegisterFormState, RegisterRole } from './types';

interface Props {
  data: RegisterFormState;
  updateData: (patch: Partial<RegisterFormState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2RoleSelect({ data, updateData, onNext, onBack }: Props) {
  const [error, setError] = useState<string | null>(null);

  const select = (role: RegisterRole) => {
    updateData({ role });
    setError(null);
  };

  const handleContinue = () => {
    if (!data.role) {
      setError('Please choose a role to continue.');
      return;
    }
    onNext();
  };

  return (
    <div>
      <h2 className="text-[27px] font-bold text-[#171717] tracking-[-0.4px]">
        What brings you to Jopsphere?
      </h2>
      <p className="text-sm text-[#8A8A8A] mt-2 mb-8">
        Choose your role so we can personalize your experience.
      </p>

      {error && (
        <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Job Seeker */}
        <button
          type="button"
          onClick={() => select('job_seeker')}
          className={`text-left rounded-xl p-6 transition-all border-[1.5px] ${
            data.role === 'job_seeker'
              ? 'bg-[#FAF8FF] border-[#6D4AFF] shadow-[0_0_0_4px_rgba(109,74,255,0.10)]'
              : 'bg-white border-[#E2E2E2] hover:border-[#C7BBFF] shadow-[0_1px_2px_rgba(16,16,16,0.03)]'
          }`}
        >
          <div className="relative">
            <div className="w-[42px] h-[42px] bg-[#F0ECFF] rounded-[10px] flex items-center justify-center">
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="6.5" r="3.2" stroke="#6D4AFF" strokeWidth="1.7" />
                <path d="M3.2 17.3c0-3.7 3-6.3 6.8-6.3s6.8 2.6 6.8 6.3" stroke="#6D4AFF" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </div>
            {data.role === 'job_seeker' && (
              <div className="absolute top-0 right-0 w-5 h-5 bg-[#6D4AFF] rounded-full flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5.2l2.2 2.2L8.5 2.2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
          <div className="mt-6 text-[16.5px] font-bold text-[#171717]">Job Seeker</div>
          <div className="mt-1.5 text-[13px] text-[#8A8A8A]">Find verified jobs that respond.</div>
        </button>

        {/* Employer */}
        <button
          type="button"
          onClick={() => select('employer')}
          className={`text-left rounded-xl p-6 transition-all border-[1.5px] ${
            data.role === 'employer'
              ? 'bg-[#F5FBF7] border-[#148A50] shadow-[0_0_0_4px_rgba(20,138,80,0.10)]'
              : 'bg-white border-[#E2E2E2] hover:border-[#A9E0C1] shadow-[0_1px_2px_rgba(16,16,16,0.03)]'
          }`}
        >
          <div className="relative">
            <div className="w-[42px] h-[42px] bg-[#EAF8F0] rounded-[10px] flex items-center justify-center">
              <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="7" width="14" height="10.5" rx="1.2" stroke="#148A50" strokeWidth="1.6" />
                <path d="M7 7V4.8A1.8 1.8 0 018.8 3h2.4A1.8 1.8 0 0113 4.8V7" stroke="#148A50" strokeWidth="1.6" />
              </svg>
            </div>
            {data.role === 'employer' && (
              <div className="absolute top-0 right-0 w-5 h-5 bg-[#148A50] rounded-full flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5.2l2.2 2.2L8.5 2.2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
          <div className="mt-6 text-[16.5px] font-bold text-[#171717]">Employer</div>
          <div className="mt-1.5 text-[13px] text-[#8A8A8A]">Hire faster with verified candidates.</div>
        </button>
      </div>

      <div className="flex items-center justify-between mt-10">
        <button
          type="button"
          onClick={onBack}
          className="h-10 px-5 rounded-lg border border-[#DEDEDE] text-sm font-semibold text-[#171717] bg-white hover:bg-[#F7F7F7] transition-colors"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="h-10 px-6 rounded-lg text-sm font-bold text-white bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] shadow-[0_6px_16px_rgba(109,74,255,0.32)] hover:brightness-95 hover:-translate-y-px transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}