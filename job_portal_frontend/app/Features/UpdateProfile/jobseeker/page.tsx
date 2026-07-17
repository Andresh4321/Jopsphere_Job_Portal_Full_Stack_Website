'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { jobSeekerAction } from '../../../../lib/actions/jobseeker.action';
import { MyJobSeekerProfile } from '../../../../lib/types/jobseeker.types';
import AppHeader from '../../../components/appheader';
import SkillsInput from '../../../components/postjob/skillsinput';
import { WorkType } from '../../../../lib/types/job.types';
import { ROUTES } from '../../../../lib/route';
import { getBackendImageUrl, getDocumentInfo } from '../../../../lib/utils/image-url';

const WORK_TYPE_OPTIONS: { value: WorkType; label: string }[] = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
];

const WORK_TYPE_LABEL_MAP: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  remote: 'Remote',
};

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

type TabView = 'profile' | 'edit';

// Profile completeness calculator
function calculateCompleteness(profile: MyJobSeekerProfile | null): { percent: number; missing: string[] } {
  if (!profile) return { percent: 0, missing: [] };

  const fields: { key: string; label: string; check: () => boolean }[] = [
    { key: 'fullName', label: 'Full name', check: () => !!profile.fullName },
    { key: 'topSkills', label: 'Top skills (3)', check: () => profile.topSkills.length === 3 },
    { key: 'aboutYourself', label: 'About yourself', check: () => !!profile.aboutYourself },
    { key: 'preferredLocation', label: 'Preferred location', check: () => !!profile.preferredLocation },
    { key: 'preferredWorkType', label: 'Preferred work type', check: () => !!profile.preferredWorkType },
    { key: 'education', label: 'Education', check: () => !!profile.education },
    { key: 'experienceYears', label: 'Experience years', check: () => profile.experienceYears !== undefined && profile.experienceYears !== null },
    { key: 'expectedSalary', label: 'Expected salary', check: () => !!profile.expectedSalary },
    { key: 'profileImage', label: 'Profile photo', check: () => !!profile.profileImage },
    { key: 'linkedinUrl', label: 'LinkedIn/Portfolio URL', check: () => !!profile.linkedinUrl },
  ];

  const filled = fields.filter((f) => f.check());
  const missing = fields.filter((f) => !f.check()).map((f) => f.label);
  return { percent: Math.round((filled.length / fields.length) * 100), missing };
}

// Generate resume as printable HTML in new window
function generateResume(profile: MyJobSeekerProfile) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${profile.fullName} — Resume</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1a1a1a; padding: 48px 56px; max-width: 800px; margin: 0 auto; line-height: 1.5; }
  h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
  .subtitle { color: #666; font-size: 14px; margin-bottom: 24px; }
  .section { margin-top: 28px; }
  .section-title { font-size: 12px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: #6D4AFF; border-bottom: 2px solid #F0ECFF; padding-bottom: 6px; margin-bottom: 14px; }
  .about { font-size: 14px; color: #333; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 32px; }
  .field-label { font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
  .field-value { font-size: 14px; font-weight: 500; color: #1a1a1a; margin-top: 2px; }
  .skills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .skill-tag { background: #F0ECFF; color: #6D4AFF; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #aaa; text-align: center; }
  @media print { body { padding: 32px 40px; } .footer { display: none; } }
</style>
</head>
<body>
<h1>${profile.fullName}</h1>
<p class="subtitle">${[profile.preferredLocation, profile.education, profile.linkedinUrl].filter(Boolean).join(' • ')}</p>

<div class="section">
  <div class="section-title">About</div>
  <p class="about">${profile.aboutYourself || 'Not provided'}</p>
</div>

<div class="section">
  <div class="section-title">Skills</div>
  <div class="skills">
    ${profile.topSkills.map((s) => `<span class="skill-tag">${s}</span>`).join('')}
  </div>
</div>

<div class="section">
  <div class="section-title">Details</div>
  <div class="grid">
    <div><p class="field-label">Preferred Work Type</p><p class="field-value">${profile.preferredWorkType ? WORK_TYPE_LABEL_MAP[profile.preferredWorkType] || profile.preferredWorkType : '—'}</p></div>
    <div><p class="field-label">Experience</p><p class="field-value">${profile.experienceYears !== undefined ? profile.experienceYears + ' year(s)' : '—'}</p></div>
    <div><p class="field-label">Expected Salary</p><p class="field-value">${profile.expectedSalary ? 'NPR ' + profile.expectedSalary.toLocaleString('en-IN') + '/mo' : '—'}</p></div>
    <div><p class="field-label">Notice Period</p><p class="field-value">${profile.noticePeriodDays ? profile.noticePeriodDays + ' days' : '—'}</p></div>
    <div><p class="field-label">Education</p><p class="field-value">${profile.education || '—'}</p></div>
    <div><p class="field-label">Location</p><p class="field-value">${profile.preferredLocation || '—'}</p></div>
  </div>
</div>

${profile.linkedinUrl ? `<div class="section"><div class="section-title">Links</div><p class="about"><a href="${profile.linkedinUrl}" style="color:#6D4AFF">${profile.linkedinUrl}</a></p></div>` : ''}

<p class="footer">Generated from Jopsphere on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onload = () => {
      setTimeout(() => win.print(), 500);
    };
  }
}

export default function JobSeekerProfilePage() {
  const router = useRouter();
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const qualificationInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<MyJobSeekerProfile | null>(null);
  const [tab, setTab] = useState<TabView>('profile');

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

  const { percent, missing } = useMemo(() => calculateCompleteness(profile), [profile]);

  useEffect(() => {
    (async () => {
      const result = await jobSeekerAction.getMyProfile();
      if (result.success) {
        const p = result.data;
        setProfile(p);
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

    setProfile(result.data);
    setExistingProfileImage(result.data.profileImage);
    setExistingQualificationImages(result.data.qualificationImages);
    setNewProfileImage(null);
    setNewQualificationImages([]);
    setSuccess(true);
    setTab('profile');
    setTimeout(() => setSuccess(false), 4000);
  };

  const profileImagePreview = newProfileImage
    ? URL.createObjectURL(newProfileImage)
    : getBackendImageUrl(existingProfileImage);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <AppHeader portal="seeker" />
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#6D4AFF] border-t-transparent animate-spin" />
            <p className="text-sm text-neutral-500">Loading your profile...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <AppHeader portal="seeker" />

      <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">My Profile</h1>
            <p className="mt-1 text-sm text-neutral-500">
              View and manage your professional profile.
            </p>
          </div>
          <button
            onClick={() => router.push(ROUTES.seekerDashboard)}
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            ← Back to dashboard
          </button>
        </div>

        {/* Tab switcher */}
        <div className="mt-6 flex gap-1 p-1 rounded-xl bg-neutral-100 w-fit">
          <button
            type="button"
            onClick={() => setTab('profile')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'profile'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={() => setTab('edit')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'edit'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Edit Profile
          </button>
        </div>

        {/* Success/error messages */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-700">
            Profile updated successfully.
          </div>
        )}

        {/* ===== VIEW TAB ===== */}
        {tab === 'profile' && profile && (
          <div className="mt-6 space-y-6">
            {/* Profile card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-[#F0ECFF] flex-shrink-0 overflow-hidden flex items-center justify-center border-2 border-neutral-100">
                  {existingProfileImage ? (
                    <img src={getBackendImageUrl(existingProfileImage)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <img src="/Profile.png" alt="Profile" className="w-12 h-12 object-contain opacity-60" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-neutral-900">{profile.fullName}</h2>
                    {profile.accountVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.59L7 10l-2.41-2.41L5.3 6.88 7 8.59l3.7-3.7.71.7z"/></svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    {[profile.education, profile.preferredLocation].filter(Boolean).join(' • ') || 'No details yet'}
                  </p>
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm text-[#6D4AFF] hover:underline">
                      {profile.linkedinUrl}
                    </a>
                  )}
                </div>
              </div>

              {/* About */}
              {profile.aboutYourself && (
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">About</h3>
                  <p className="text-sm text-neutral-700 leading-relaxed">{profile.aboutYourself}</p>
                </div>
              )}

              {/* Skills */}
              {profile.topSkills.length > 0 && (
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Top Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.topSkills.map((skill) => (
                      <span key={skill} className="rounded-full bg-[#F0ECFF] px-3.5 py-1.5 text-sm font-medium text-[#6D4AFF]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work details */}
              <div className="mt-6 pt-6 border-t border-neutral-100">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Work Preferences</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  <div>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase">Work Type</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">
                      {profile.preferredWorkType ? WORK_TYPE_LABEL_MAP[profile.preferredWorkType] : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase">Experience</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">
                      {profile.experienceYears !== undefined ? `${profile.experienceYears} year(s)` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase">Expected Salary</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">
                      {profile.expectedSalary ? `NPR ${profile.expectedSalary.toLocaleString('en-IN')}/mo` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase">Notice Period</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">
                      {profile.noticePeriodDays ? `${profile.noticePeriodDays} days` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase">Location</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">{profile.preferredLocation || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase">Education</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">{profile.education || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Qualification documents */}
              {existingQualificationImages.length > 0 && (
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Qualification Documents</h3>
                  <div className="flex flex-wrap gap-3">
                    {existingQualificationImages.map((img, i) => {
                      const doc = getDocumentInfo(img);
                      if (doc.isPdf) {
                        return (
                          <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" className="w-20 h-20 rounded-lg border border-neutral-200 bg-red-50 flex flex-col items-center justify-center gap-1 hover:border-[#6D4AFF] transition-colors">
                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                            <span className="text-[9px] font-bold text-red-600">PDF</span>
                          </a>
                        );
                      }
                      return (
                        <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer">
                          <img src={doc.url} alt={`Qualification ${i + 1}`} className="w-20 h-20 rounded-lg object-cover border border-neutral-200 hover:border-[#6D4AFF] transition-colors" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Profile completeness + Resume section */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Completeness card */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <h3 className="text-sm font-bold text-neutral-900">Profile Completeness</h3>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent === 100 ? 'bg-emerald-500' : 'bg-[#6D4AFF]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${percent === 100 ? 'text-emerald-600' : 'text-[#6D4AFF]'}`}>
                    {percent}%
                  </span>
                </div>

                {missing.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-neutral-500 mb-2">Missing fields:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {missing.map((m) => (
                        <span key={m} className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-medium text-amber-700">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {missing.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTab('edit')}
                    className="mt-4 w-full h-9 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
                  >
                    Complete profile
                  </button>
                )}
              </div>

              {/* Resume card */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <h3 className="text-sm font-bold text-neutral-900">Auto Resume</h3>
                <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                  {percent === 100
                    ? 'Your profile is complete! Generate a professional resume document from your profile data.'
                    : 'Complete all profile fields to unlock auto-resume generation.'}
                </p>
                <button
                  type="button"
                  disabled={percent < 100}
                  onClick={() => profile && generateResume(profile)}
                  className={`mt-4 w-full h-9 rounded-lg text-sm font-medium transition-all ${
                    percent === 100
                      ? 'bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] text-white hover:brightness-95'
                      : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  {percent === 100 ? 'Generate & Print Resume' : `${100 - percent}% remaining`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== EDIT TAB ===== */}
        {tab === 'edit' && (
          <div className="mt-6 space-y-6">
            {/* Profile image */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex items-center gap-6">
              <div className="relative w-20 h-20 rounded-full bg-[#F0ECFF] flex-shrink-0 overflow-hidden flex items-center justify-center border-2 border-neutral-100">
                {profileImagePreview ? (
                  <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img src="/Profile.png" alt="Profile" className="w-12 h-12 object-contain opacity-60" />
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
                  className="h-9 px-5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  Change photo
                </button>
                <p className="mt-2 text-xs text-neutral-400">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            {/* Basic info */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-8">
              <h2 className="text-base font-bold text-neutral-900">Basic Information</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Full name</p>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => update({ fullName: e.target.value })}
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                  />
                </label>
                <label className="block">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Preferred location</p>
                  <input
                    type="text"
                    value={form.preferredLocation}
                    onChange={(e) => update({ preferredLocation: e.target.value })}
                    placeholder="e.g. Kathmandu"
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                  />
                </label>
                <label className="block">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Preferred work type</p>
                  <select
                    value={form.preferredWorkType}
                    onChange={(e) => update({ preferredWorkType: e.target.value as WorkType })}
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                  >
                    <option value="">Not set</option>
                    {WORK_TYPE_OPTIONS.map((w) => (
                      <option key={w.value} value={w.value}>{w.label}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Education</p>
                  <input
                    type="text"
                    value={form.education}
                    onChange={(e) => update({ education: e.target.value })}
                    placeholder="e.g. BSc Computer Science"
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                  />
                </label>
              </div>

              <label className="block mt-5">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">About yourself</p>
                <textarea
                  rows={4}
                  value={form.aboutYourself}
                  onChange={(e) => update({ aboutYourself: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none resize-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                />
              </label>

              <div className="mt-5">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Top 3 skills</p>
                <div className="mt-2">
                  <SkillsInput skills={form.topSkills} onChange={(skills) => update({ topSkills: skills })} />
                </div>
              </div>
            </div>

            {/* Work preferences */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-8">
              <h2 className="text-base font-bold text-neutral-900">Work Preferences</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                <label className="block">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Experience (years)</p>
                  <input
                    type="number"
                    min={0}
                    value={form.experienceYears}
                    onChange={(e) => update({ experienceYears: e.target.value })}
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                  />
                </label>
                <label className="block">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Expected salary (NPR/mo)</p>
                  <input
                    type="number"
                    min={0}
                    value={form.expectedSalary}
                    onChange={(e) => update({ expectedSalary: e.target.value })}
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                  />
                </label>
                <label className="block">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Notice period (days)</p>
                  <input
                    type="number"
                    min={0}
                    value={form.noticePeriodDays}
                    onChange={(e) => update({ noticePeriodDays: e.target.value })}
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                  />
                </label>
              </div>

              <label className="block mt-5">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">LinkedIn / portfolio URL</p>
                <input
                  type="text"
                  value={form.linkedinUrl}
                  onChange={(e) => update({ linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/yourname"
                  className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                />
              </label>
            </div>

            {/* Qualification documents */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-8">
              <h2 className="text-base font-bold text-neutral-900">Qualification Documents</h2>

              {existingQualificationImages.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {existingQualificationImages.map((img, i) => {
                    const doc = getDocumentInfo(img);
                    if (doc.isPdf) {
                      return (
                        <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" className="w-20 h-20 rounded-lg border border-neutral-200 bg-red-50 flex flex-col items-center justify-center gap-1">
                          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                          <span className="text-[9px] font-bold text-red-600">PDF</span>
                        </a>
                      );
                    }
                    return (
                      <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer">
                        <img src={doc.url} alt={`Qualification ${i + 1}`} className="w-20 h-20 rounded-lg object-cover border border-neutral-200" />
                      </a>
                    );
                  })}
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
                className="mt-4 h-9 px-5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                {newQualificationImages.length > 0 ? `${newQualificationImages.length} new file(s) selected` : 'Add more documents'}
              </button>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="h-11 px-8 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#6D4AFF] text-sm font-bold text-white shadow-[0_4px_12px_rgba(109,74,255,0.25)] hover:brightness-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
