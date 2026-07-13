'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import { jobSeekerAction } from '../../../../lib/actions/jobseeker.action';
import SkillsInput from '../../../components/postjob/skillsinput';
import { WorkType } from '../../../../lib/types/job.types';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans' });
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: ['400'], variable: '--font-serif' });

const WORK_TYPE_OPTIONS: { value: WorkType; label: string }[] = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
];

interface FormState {
  fullName: string;
  topSkills: string[];
  aboutYourself: string;
  preferredLocation: string;
  preferredWorkType: WorkType | '';
  experienceYears: string;
  expectedSalary: string;
  noticePeriodDays: string;
  education: string;
  linkedinUrl: string;
}

export default function UpdateJobSeekerProfilePage() {
  const router = useRouter();
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const qualificationInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    fullName: '',
    topSkills: [],
    aboutYourself: '',
    preferredLocation: '',
    preferredWorkType: '',
    experienceYears: '',
    expectedSalary: '',
    noticePeriodDays: '',
    education: '',
    linkedinUrl: '',
  });

  const [existingProfileImage, setExistingProfileImage] = useState<string | undefined>(undefined);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [existingQualificationImages, setExistingQualificationImages] = useState<string[]>([]);
  const [newQualificationImages, setNewQualificationImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    (async () => {
      const result = await jobSeekerAction.getMyProfile();
      if (result.success) {
        const p = result.data;
        setForm({
          fullName: p.fullName,
          topSkills: p.topSkills,
          aboutYourself: p.aboutYourself,
          preferredLocation: p.preferredLocation ?? '',
          preferredWorkType: (p.preferredWorkType as WorkType) ?? '',
          experienceYears: p.experienceYears?.toString() ?? '',
          expectedSalary: p.expectedSalary?.toString() ?? '',
          noticePeriodDays: p.noticePeriodDays?.toString() ?? '',
          education: p.education ?? '',
          linkedinUrl: p.linkedinUrl ?? '',
        });
        setExistingProfileImage(p.profileImage);
        setExistingQualificationImages(p.qualificationImages);
      } else {
        setError(result.message);
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (form.topSkills.length !== 3) {
      setError('Please enter exactly 3 top skills.');
      return;
    }
    if (!form.fullName.trim() || !form.aboutYourself.trim()) {
      setError('Full name and about yourself are required.');
      return;
    }

    setSaving(true);
    setError(null);

    const result = await jobSeekerAction.updateMyProfile({
      fullName: form.fullName,
      topSkills: form.topSkills,
      aboutYourself: form.aboutYourself,
      preferredLocation: form.preferredLocation || undefined,
      preferredWorkType: form.preferredWorkType || undefined,
      experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
      expectedSalary: form.expectedSalary ? Number(form.expectedSalary) : undefined,
      noticePeriodDays: form.noticePeriodDays ? Number(form.noticePeriodDays) : undefined,
      education: form.education || undefined,
      linkedinUrl: form.linkedinUrl || undefined,
      profileImage: newProfileImage ?? undefined,
      newQualificationImages: newQualificationImages.length > 0 ? newQualificationImages : undefined,
    });

    setSaving(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setExistingProfileImage(result.data.profileImage);
    setExistingQualificationImages(result.data.qualificationImages);
    setNewProfileImage(null);
    setNewQualificationImages([]);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const inputClass =
    'mt-2 h-11 w-full rounded border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-all focus:border-indigo-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.10)]';
  const labelClass = 'text-xs font-bold text-stone-600 uppercase tracking-wide';

  const profileImagePreview = newProfileImage ? URL.createObjectURL(newProfileImage) : existingProfileImage;

  if (loading) {
    return (
      <div className={`${dmSans.variable} ${dmSerif.variable} min-h-screen bg-[#F8F7F3] flex items-center justify-center`}>
        <p className="text-sm text-stone-600">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className={`${dmSans.variable} ${dmSerif.variable} min-h-screen bg-[#F8F7F3]`} style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="max-w-[860px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
            Update your profile
          </h1>
          <button onClick={() => router.push('/Features/seeker_dashboard')} className="text-sm font-medium text-stone-600 hover:text-neutral-900">
            ← Back to dashboard
          </button>
        </div>
        <p className="mt-2 text-sm text-stone-600">Keep your profile current to get better job matches.</p>

        {error && (
          <div className="mt-6 rounded border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="mt-6 rounded border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-700">
            ✓ Profile updated successfully.
          </div>
        )}

        {/* Profile image */}
        <div className="mt-8 bg-white border border-neutral-200 rounded p-8 flex items-center gap-6">
          <div className="relative w-20 h-20 rounded-full bg-indigo-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
            {profileImagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-indigo-400">
                {form.fullName ? form.fullName[0].toUpperCase() : '?'}
              </span>
            )}
          </div>
          <div>
            <input
              ref={profileImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setNewProfileImage(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => profileImageInputRef.current?.click()}
              className="h-9 px-5 rounded border border-neutral-200 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              Change photo
            </button>
            <p className="mt-2 text-xs text-stone-500">JPG, PNG or GIF. Max 2MB.</p>
          </div>
        </div>

        {/* Basic info */}
        <div className="mt-6 bg-white border border-neutral-200 rounded p-8">
          <h2 className="text-base text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>Basic information</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <p className={labelClass}>Full name</p>
              <input type="text" value={form.fullName} onChange={(e) => update({ fullName: e.target.value })} className={inputClass} />
            </label>
            <label className="block">
              <p className={labelClass}>Preferred location</p>
              <input
                type="text"
                value={form.preferredLocation}
                onChange={(e) => update({ preferredLocation: e.target.value })}
                placeholder="e.g. Kathmandu"
                className={inputClass}
              />
            </label>
            <label className="block">
              <p className={labelClass}>Preferred work type</p>
              <select
                value={form.preferredWorkType}
                onChange={(e) => update({ preferredWorkType: e.target.value as WorkType })}
                className={inputClass}
              >
                <option value="">Not set</option>
                {WORK_TYPE_OPTIONS.map((w) => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <p className={labelClass}>Education</p>
              <input
                type="text"
                value={form.education}
                onChange={(e) => update({ education: e.target.value })}
                placeholder="e.g. BSc Computer Science"
                className={inputClass}
              />
            </label>
          </div>

          <label className="block mt-5">
            <p className={labelClass}>About yourself</p>
            <textarea
              rows={4}
              value={form.aboutYourself}
              onChange={(e) => update({ aboutYourself: e.target.value })}
              className={`${inputClass} h-auto py-3 resize-none`}
            />
          </label>

          <label className="block mt-5">
            <p className={labelClass}>Top 3 skills</p>
            <div className="mt-2">
              <SkillsInput skills={form.topSkills} onChange={(skills) => update({ topSkills: skills })} />
            </div>
          </label>
        </div>

        {/* Work preferences */}
        <div className="mt-6 bg-white border border-neutral-200 rounded p-8">
          <h2 className="text-base text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>Work preferences</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <label className="block">
              <p className={labelClass}>Experience (years)</p>
              <input
                type="number"
                min={0}
                value={form.experienceYears}
                onChange={(e) => update({ experienceYears: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block">
              <p className={labelClass}>Expected salary (NPR/mo)</p>
              <input
                type="number"
                min={0}
                value={form.expectedSalary}
                onChange={(e) => update({ expectedSalary: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block">
              <p className={labelClass}>Notice period (days)</p>
              <input
                type="number"
                min={0}
                value={form.noticePeriodDays}
                onChange={(e) => update({ noticePeriodDays: e.target.value })}
                className={inputClass}
              />
            </label>
          </div>

          <label className="block mt-5">
            <p className={labelClass}>LinkedIn / portfolio URL</p>
            <input
              type="text"
              value={form.linkedinUrl}
              onChange={(e) => update({ linkedinUrl: e.target.value })}
              placeholder="https://linkedin.com/in/yourname"
              className={inputClass}
            />
          </label>
        </div>

        {/* Qualification documents */}
        <div className="mt-6 bg-white border border-neutral-200 rounded p-8">
          <h2 className="text-base text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>Qualification documents</h2>

          {existingQualificationImages.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-3">
              {existingQualificationImages.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={img} alt={`Qualification ${i + 1}`} className="w-20 h-20 rounded object-cover border border-neutral-200" />
              ))}
            </div>
          )}

          <input
            ref={qualificationInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setNewQualificationImages(Array.from(e.target.files ?? []).slice(0, 5))}
          />
          <button
            type="button"
            onClick={() => qualificationInputRef.current?.click()}
            className="mt-4 h-9 px-5 rounded border border-neutral-200 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
          >
            {newQualificationImages.length > 0 ? `${newQualificationImages.length} new file(s) selected` : 'Add more documents'}
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-11 px-8 rounded bg-indigo-500 text-sm font-medium text-white hover:bg-indigo-600 transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}