'use client';

import { useState } from 'react';

interface Props {
  skills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
}

export default function SkillsInput({ skills, onChange, placeholder = 'e.g. React, press Enter' }: Props) {
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);

  const addSkill = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    if (skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...skills, value]);
    setDraft('');
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(draft);
    } else if (e.key === 'Backspace' && draft === '' && skills.length > 0) {
      removeSkill(skills.length - 1);
    }
  };

  return (
    <div
      className={`min-h-11 w-full rounded border bg-white px-3 py-2 flex flex-wrap items-center gap-2 transition-all ${
        focused ? 'border-[#6D4AFF] shadow-[0_0_0_4px_rgba(109,74,255,0.12)]' : 'border-neutral-300'
      }`}
      onClick={() => document.getElementById('skills-input')?.focus()}
    >
      {skills.map((skill, i) => (
        <span
          key={`${skill}-${i}`}
          className="inline-flex items-center gap-1.5 bg-[#F0ECFF] text-[#6D4AFF] text-sm font-semibold pl-3 pr-2 py-1 rounded-full"
        >
          {skill}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeSkill(i);
            }}
            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#E0D8FF] transition-colors"
            aria-label={`Remove ${skill}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        id="skills-input"
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          addSkill(draft);
        }}
        placeholder={skills.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] text-sm text-neutral-900 outline-none bg-transparent py-1"
      />
    </div>
  );
}