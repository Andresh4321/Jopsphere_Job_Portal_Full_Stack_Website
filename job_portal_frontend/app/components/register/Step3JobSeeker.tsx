'use client';

import { useRef, useState } from 'react';
import { RegisterFormState, parseTopSkills } from './types';

interface Props {
  data: RegisterFormState;
  updateData: (patch: Partial<RegisterFormState>) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string | null;
}

export default function Step3JobSeeker({ data, updateData, onBack, onSubmit, submitting, submitError }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClass = (name: string) =>
    `w-full h-11 px-4 rounded-lg text-sm text-[#171717] bg-white border transition-all outline-none ${
      focused === name
        ? 'border-[#6D4AFF] shadow-[0_0_0_4px_rgba(109,74,255,0.12)]'
        : 'border-[#E0E0E0] shadow-[0_1px_2px_rgba(16,16,16,0.03)]'
    }`;

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    updateData({ qualificationImages: Array.from(files).slice(0, 5) });
  };

  const handleSubmit = () => {
    if (!data.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const skills = parseTopSkills(data.topSkillsRaw);
    if (skills.length !== 3) {
      setError('Please enter exactly 3 skills, separated by commas.');
      return;
    }
    if (!data.aboutYourself.trim()) {
      setError('Tell us a little about yourself.');
      return;
    }
    setError(null);
    onSubmit();
  };

  const displayError = error || submitError;

  return (
    <div>
      <h2 className="text-[27px] font-bold text-[#171717] tracking-[-0.4px]">Tell us about you</h2>
      <p className="text-sm text-[#8A8A8A] mt-2 mb-8">This appears on your applications.</p>

      {displayError && (
        <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {displayError}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">Full name</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused(null)}
            placeholder="Sita Sharma"
            className={inputClass('name')}
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">Top 3 skills</label>
          <input
            type="text"
            value={data.topSkillsRaw}
            onChange={(e) => updateData({ topSkillsRaw: e.target.value })}
            onFocus={() => setFocused('skills')}
            onBlur={() => setFocused(null)}
            placeholder="React, TypeScript, Figma"
            className={inputClass('skills')}
          />
          <p className="text-xs text-[#9A9A9A] mt-1.5">Separate exactly 3 skills with commas.</p>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">About yourself</label>
          <textarea
            rows={4}
            value={data.aboutYourself}
            onChange={(e) => updateData({ aboutYourself: e.target.value })}
            onFocus={() => setFocused('about')}
            onBlur={() => setFocused(null)}
            placeholder="A couple of sentences about your experience and what you're looking for."
            className={`${inputClass('about')} h-auto py-3 resize-none`}
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-[#171717] mb-2">
            Qualification documents <span className="text-[#9A9A9A] font-normal">(optional)</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFilesSelected(e.target.files)}
            className="hidden"
          />
          <div className="h-11 px-4 rounded-lg border-[1.5px] border-dashed border-[#D4D4D4] bg-white flex items-center">
            <span className="text-[13.5px] text-[#9A9A9A] truncate flex-1">
              {data.qualificationImages.length > 0
                ? `${data.qualificationImages.length} file(s) selected`
                : 'Upload images (up to 5)'}
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
          {submitting ? 'Creating account...' : 'Finish'}
        </button>
      </div>
    </div>
  );
}