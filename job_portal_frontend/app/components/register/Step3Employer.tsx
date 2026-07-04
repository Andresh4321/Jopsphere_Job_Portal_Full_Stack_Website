'use client';

import { useRef, useState } from 'react';
import { RegisterFormState } from './types';

interface Props {
  data: RegisterFormState;
  updateData: (patch: Partial<RegisterFormState>) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string | null;
}

const INDUSTRIES = ['Sales', 'IT', 'Finance', 'Marketing', 'Operations', 'Retail', 'Other'];

export default function Step3Employer({ data, updateData, onBack, onSubmit, submitting, submitError }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClass = (name: string) =>
    `w-full h-11 px-4 rounded-lg text-sm text-[#171717] bg-white border transition-all outline-none ${
      focused === name
        ? 'border-[#6D4AFF] shadow-[0_0_0_4px_rgba(109,74,255,0.12)]'
        : 'border-[#E0E0E0] shadow-[0_1px_2px_rgba(16,16,16,0.03)]'
    }`;

  const handleSubmit = () => {
    if (!data.companyName.trim()) return setError('Company name is required.');
    if (!data.headquarters.trim()) return setError('Headquarters / location is required.');
    if (!data.companyWebsite.trim()) return setError('Company website is required.');
    if (!data.aboutCompany.trim()) return setError('Please add a short company description.');
    if (!data.whyChooseUs.trim()) return setError('Please add why candidates should choose you.');
    if (!data.businessRegistrationNumber.trim()) return setError('Business registration number is required.');
    if (!data.companyDocument) return setError('Please upload your business registration document.');

    setError(null);
    onSubmit();
  };

  const displayError = error || submitError;

  return (
    <div>
      <h2 className="text-[27px] font-bold text-[#171717] tracking-[-0.4px]">Verify your company</h2>
      <p className="text-sm text-[#8A8A8A] mt-2 mb-8">
        This creates your public employer profile on Jopsphere.
      </p>

      {displayError && (
        <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {displayError}
        </div>
      )}

      {/* Basic details */}
      <h3 className="text-xs font-bold tracking-wide text-[#9A9A9A] mb-4">COMPANY BASIC DETAILS</h3>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">Company name</label>
          <input
            type="text"
            value={data.companyName}
            onChange={(e) => updateData({ companyName: e.target.value })}
            onFocus={() => setFocused('companyName')}
            onBlur={() => setFocused(null)}
            className={inputClass('companyName')}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">Industry</label>
          <select
            value={data.industry}
            onChange={(e) => updateData({ industry: e.target.value })}
            className="w-full h-11 px-4 rounded-lg text-sm text-[#171717] bg-white border border-[#E0E0E0] shadow-[0_1px_2px_rgba(16,16,16,0.03)] outline-none"
          >
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">Headquarters / Location</label>
          <input
            type="text"
            value={data.headquarters}
            onChange={(e) => updateData({ headquarters: e.target.value })}
            onFocus={() => setFocused('hq')}
            onBlur={() => setFocused(null)}
            placeholder="Kathmandu"
            className={inputClass('hq')}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">Company website</label>
          <input
            type="text"
            value={data.companyWebsite}
            onChange={(e) => updateData({ companyWebsite: e.target.value })}
            onFocus={() => setFocused('website')}
            onBlur={() => setFocused(null)}
            placeholder="https://company.com"
            className={inputClass('website')}
          />
        </div>
      </div>

      {/* Public profile */}
      <h3 className="text-xs font-bold tracking-wide text-[#9A9A9A] mb-4">PUBLIC COMPANY PROFILE</h3>
      <div className="space-y-5 mb-8">
        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">About company</label>
          <textarea
            rows={4}
            value={data.aboutCompany}
            onChange={(e) => updateData({ aboutCompany: e.target.value })}
            onFocus={() => setFocused('about')}
            onBlur={() => setFocused(null)}
            className={`${inputClass('about')} h-auto py-3 resize-none`}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">
            Why candidates should choose your company
          </label>
          <textarea
            rows={3}
            value={data.whyChooseUs}
            onChange={(e) => updateData({ whyChooseUs: e.target.value })}
            onFocus={() => setFocused('why')}
            onBlur={() => setFocused(null)}
            className={`${inputClass('why')} h-auto py-3 resize-none`}
          />
        </div>
      </div>

      {/* Verification */}
      <h3 className="text-xs font-bold tracking-wide text-[#9A9A9A] mb-4">VERIFICATION DOCUMENTS</h3>
      <div className="grid sm:grid-cols-2 gap-4 mb-2">
        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">
            Business registration number
          </label>
          <input
            type="text"
            value={data.businessRegistrationNumber}
            onChange={(e) => updateData({ businessRegistrationNumber: e.target.value })}
            onFocus={() => setFocused('regNum')}
            onBlur={() => setFocused(null)}
            placeholder="e.g. 123456/080/081"
            className={inputClass('regNum')}
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">Upload company document</label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => updateData({ companyDocument: e.target.files?.[0] ?? null })}
            className="hidden"
          />
          <div className="h-11 px-4 rounded-lg border-[1.5px] border-dashed border-[#D4D4D4] bg-white flex items-center">
            <span className="text-[13.5px] text-[#9A9A9A] truncate flex-1">
              {data.companyDocument ? data.companyDocument.name : 'Upload PDF / Image'}
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[13.5px] font-semibold text-[#6D4AFF] hover:text-[#5F3CF0] transition-colors"
            >
              Browse
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-10">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="h-10 px-5 rounded-lg border border-[#DEDEDE] text-sm font-semibold text-[#171717] bg-white hover:bg-[#F7F7F7] transition-colors disabled:opacity-50"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="h-10 px-6 rounded-lg text-sm font-bold text-white bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] shadow-[0_6px_16px_rgba(109,74,255,0.32)] hover:brightness-95 hover:-translate-y-px transition-all disabled:opacity-60 disabled:translate-y-0"
        >
          {submitting ? 'Submitting...' : 'Submit for Verification'}
        </button>
      </div>

      <div className="mt-6 text-sm text-amber-900 bg-amber-100 rounded-lg px-5 py-3.5">
        Your company will be marked verified after Jopsphere reviews your submitted document.
      </div>
    </div>
  );
}