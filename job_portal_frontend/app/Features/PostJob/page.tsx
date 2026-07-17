'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobAction } from '../../../lib/actions/job.action';
import { companyAction } from '../../../lib/actions/company.action';
import { authAction } from '../../../lib/actions/auth.action';
import SkillsInput from '../../components/postjob/skillsinput';
import AppHeader from '../../components/appheader';
import { WorkType, ListingType } from '../../../lib/types/job.types';

const WORK_TYPES: { value: WorkType; label: string }[] = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
];

interface FormState {
  jobTitle: string;
  department: string;
  workType: WorkType | '';
  location: string;
  hoursPerWeek: string;
  applicationDeadline: string;
  salaryMin: string;
  salaryMax: string;
  aboutRole: string;
  responsibilitiesRaw: string; // one per line
  requirementsRaw: string; // one per line
  skills: string[];
  listingType: ListingType;
}

const initialForm: FormState = {
  jobTitle: '',
  department: '',
  workType: '',
  location: '',
  hoursPerWeek: '40',
  applicationDeadline: '',
  salaryMin: '',
  salaryMax: '',
  aboutRole: '',
  responsibilitiesRaw: '',
  requirementsRaw: '',
  skills: [],
  listingType: 'standard',
};

const linesToArray = (raw: string): string[] =>
  raw.split('\n').map((line) => line.trim()).filter(Boolean);

export default function PostJobPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(initialForm);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [publishedJobId, setPublishedJobId] = useState<string | null>(null);

  const update = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }));

  // Resolve the logged-in employer's company on mount — every job post
  // needs companyId, which isn't returned by /login (only by /register).
  useEffect(() => {
    if (!authAction.isAuthenticated() || authAction.getStoredRole() !== 'employer') {
      router.push('/login');
      return;
    }

    (async () => {
      const result = await companyAction.getMyCompany();
      if (result.success) {
        setCompanyId(result.data.companyId);
        setCompanyName(result.data.companyName);
      } else {
        setCompanyError(result.message);
      }
      setLoadingCompany(false);
    })();
  }, [router]);

  // Live "listing completeness" — mirrors the required fields the backend enforces.
  const completeness = useMemo(() => {
    const checks = [
      !!form.jobTitle.trim(),
      !!form.department.trim(),
      !!form.workType,
      !!form.location.trim(),
      !!form.applicationDeadline,
      !!form.salaryMin && !!form.salaryMax,
      !!form.aboutRole.trim(),
      linesToArray(form.responsibilitiesRaw).length > 0,
      linesToArray(form.requirementsRaw).length > 0,
      form.skills.length > 0,
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [form]);

  const isComplete = completeness === 100;

  const handlePublish = async () => {
    if (!companyId) {
      setSubmitError('Could not determine your company. Please refresh and try again.');
      return;
    }
    if (!isComplete) {
      setSubmitError('Please complete all required fields before publishing.');
      return;
    }

    const min = Number(form.salaryMin);
    const max = Number(form.salaryMax);
    if (Number.isNaN(min) || Number.isNaN(max) || max < min) {
      setSubmitError('Please enter a valid salary range (max must be ≥ min).');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const result = await jobAction.createJob({
      companyId,
      jobTitle: form.jobTitle.trim(),
      department: form.department.trim(),
      workType: form.workType as WorkType,
      location: form.location.trim(),
      hoursPerWeek: form.hoursPerWeek ? Number(form.hoursPerWeek) : undefined,
      applicationDeadline: new Date(form.applicationDeadline).toISOString(),
      salary: { min, max },
      aboutRole: form.aboutRole.trim(),
      responsibilities: linesToArray(form.responsibilitiesRaw),
      requirements: linesToArray(form.requirementsRaw),
      skills: form.skills,
      listingType: form.listingType,
    });

    setSubmitting(false);

    if (!result.success) {
      setSubmitError(result.message);
      return;
    }

    setPublishedJobId(result.data.id);
  };

  const inputClass =
    'mt-2 h-[42px] w-full rounded border border-neutral-300 bg-white px-4 text-sm text-neutral-900 outline-none transition-all focus:border-[#6D4AFF] focus:shadow-[0_0_0_4px_rgba(109,74,255,0.12)]';
  const textAreaClass =
    'mt-2 w-full rounded border border-neutral-300 bg-white p-4 text-sm text-neutral-900 outline-none transition-all resize-none focus:border-[#6D4AFF] focus:shadow-[0_0_0_4px_rgba(109,74,255,0.12)]';
  const labelClass = 'text-sm font-bold text-neutral-900';

  // ---- Success state ----
  if (publishedJobId) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-neutral-200 rounded-lg p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#EAF8F0] flex items-center justify-center mb-5">
            <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
              <path d="M4 9.5L7.2 12.7L14 5.5" stroke="#148A50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900">Job published</h2>
          <p className="text-neutral-500 mt-2">
            {form.jobTitle} is now live under {companyName}.
          </p>
          <div className="flex gap-3 mt-8 justify-center">
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setPublishedJobId(null);
              }}
              className="h-10 px-6 rounded border border-neutral-300 text-sm font-bold text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              Post another
            </button>
            <button
              type="button"
              onClick={() => router.push(`/jobs/${publishedJobId}`)}
              className="h-10 px-6 rounded bg-[#6D4AFF] text-sm font-bold text-white hover:bg-[#5F3CF0] transition-colors"
            >
              View listing
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-neutral-900">
      <AppHeader portal="employer" />

      <section className="mx-auto w-full max-w-312 px-4 py-9 lg:px-0">
        <h2 className="text-[42px] font-bold leading-tight">Post a Job</h2>
        <p className="mt-3 text-base text-neutral-500">
          Verified employers get priority placement. Salary disclosure is required to publish.
        </p>

        {companyError && (
          <div className="mt-6 rounded bg-red-50 border border-red-200 px-6 py-4 text-sm text-red-700">
            {companyError} — make sure you&apos;re logged in as an employer.
          </div>
        )}

        {submitError && (
          <div className="mt-6 rounded bg-red-50 border border-red-200 px-6 py-4 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* Completeness */}
        <div className="mt-7 rounded border border-neutral-200 bg-white px-8 py-6">
          <div className="flex items-center justify-between text-[15px]">
            <span className="font-bold text-neutral-900">Listing completeness</span>
            <span className="text-neutral-500">{completeness}%</span>
          </div>
          <div className="mt-5 h-2 rounded bg-[#E9E4FF] overflow-hidden">
            <div
              className="h-full rounded bg-gradient-to-r from-[#8467FF] to-[#6D4AFF] transition-all duration-300 ease-out"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        {/* Role basics */}
        <div className="mt-7 rounded border border-neutral-200 bg-white px-8 py-6">
          <h3 className="text-2xl font-bold">Role basics</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block">
              <p className={labelClass}>Job title <span className="text-[#D93025]">*</span></p>
              <input
                type="text"
                value={form.jobTitle}
                onChange={(e) => update({ jobTitle: e.target.value })}
                placeholder="e.g. Frontend Engineer"
                className={inputClass}
              />
            </label>

            <label className="block">
              <p className={labelClass}>Department <span className="text-[#D93025]">*</span></p>
              <input
                type="text"
                value={form.department}
                onChange={(e) => update({ department: e.target.value })}
                placeholder="e.g. Engineering"
                className={inputClass}
              />
            </label>

            <label className="block">
              <p className={labelClass}>Work type <span className="text-[#D93025]">*</span></p>
              <select
                value={form.workType}
                onChange={(e) => update({ workType: e.target.value as WorkType })}
                className={`${inputClass} bg-white`}
              >
                <option value="">Select</option>
                {WORK_TYPES.map((w) => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <p className={labelClass}>Location <span className="text-[#D93025]">*</span></p>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update({ location: e.target.value })}
                placeholder="e.g. Kathmandu"
                className={inputClass}
              />
            </label>

            <label className="block">
              <p className={labelClass}>Hours per week</p>
              <input
                type="number"
                min={0}
                value={form.hoursPerWeek}
                onChange={(e) => update({ hoursPerWeek: e.target.value })}
                className={inputClass}
              />
            </label>

            <label className="block">
              <p className={labelClass}>Application deadline <span className="text-[#D93025]">*</span></p>
              <input
                type="date"
                value={form.applicationDeadline}
                onChange={(e) => update({ applicationDeadline: e.target.value })}
                className={inputClass}
              />
            </label>
          </div>
        </div>

        {/* Salary */}
        <div className="mt-6 rounded border border-neutral-200 bg-white px-8 py-6">
          <h3 className="text-2xl font-bold">Salary <span className="text-[#D93025]">*</span></h3>
          <p className="mt-4 text-[15px] text-neutral-500">
            Nepal market average for similar roles: <span className="font-bold text-neutral-900">NPR 35,000 - 55,000/mo</span>
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block">
              <p className={labelClass}>Min (NPR / month) <span className="text-[#D93025]">*</span></p>
              <input
                type="number"
                min={0}
                value={form.salaryMin}
                onChange={(e) => update({ salaryMin: e.target.value })}
                placeholder="35000"
                className={inputClass}
              />
            </label>
            <label className="block">
              <p className={labelClass}>Max (NPR / month) <span className="text-[#D93025]">*</span></p>
              <input
                type="number"
                min={0}
                value={form.salaryMax}
                onChange={(e) => update({ salaryMax: e.target.value })}
                placeholder="55000"
                className={inputClass}
              />
            </label>
          </div>

          <div className="mt-4 rounded bg-[#FFF4D8] px-4 py-2.5 text-sm text-[#8A5A00]">
            ⚠ Listings without salary cannot be published on Jopsphere.
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 rounded border border-neutral-200 bg-white px-8 py-6">
          <h3 className="text-2xl font-bold">Description</h3>
          <div className="mt-6 space-y-5">
            <label className="block">
              <p className={labelClass}>About the role <span className="text-[#D93025]">*</span></p>
              <textarea
                rows={4}
                value={form.aboutRole}
                onChange={(e) => update({ aboutRole: e.target.value })}
                placeholder="Give candidates a sense of what this role is about."
                className={`${textAreaClass} h-[92px]`}
              />
            </label>

            <label className="block">
              <p className={labelClass}>Responsibilities <span className="text-[#D93025]">*</span></p>
              <textarea
                rows={4}
                value={form.responsibilitiesRaw}
                onChange={(e) => update({ responsibilitiesRaw: e.target.value })}
                placeholder={'One per line\ne.g. Build and maintain the customer-facing app'}
                className={`${textAreaClass} h-[78px]`}
              />
            </label>

            <label className="block">
              <p className={labelClass}>Requirements <span className="text-[#D93025]">*</span></p>
              <textarea
                rows={4}
                value={form.requirementsRaw}
                onChange={(e) => update({ requirementsRaw: e.target.value })}
                placeholder={'One per line\ne.g. 2+ years of React experience'}
                className={`${textAreaClass} h-[78px]`}
              />
            </label>

            <label className="block">
              <p className={labelClass}>Skills <span className="text-[#D93025]">*</span></p>
              <div className="mt-2">
                <SkillsInput
                  skills={form.skills}
                  onChange={(skills) => update({ skills })}
                  placeholder="e.g. React, Node.js — press Enter after each"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Listing type */}
        <div className="mt-6 rounded border border-neutral-200 bg-white px-8 py-6">
          <h3 className="text-2xl font-bold">Listing type</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <button
              type="button"
              onClick={() => update({ listingType: 'standard' })}
              className={`h-17.5 rounded border px-6 text-left transition-all ${
                form.listingType === 'standard'
                  ? 'border-[#6D4AFF] bg-[#F0ECFF]'
                  : 'border-neutral-300 bg-white hover:border-neutral-400'
              }`}
            >
              <p className="text-base font-bold text-neutral-900">Standard</p>
              <p className="mt-1 text-sm text-neutral-500">Online applications via Jopsphere.</p>
            </button>
            <button
              type="button"
              onClick={() => update({ listingType: 'walk_in' })}
              className={`h-17.5 rounded border px-6 text-left transition-all ${
                form.listingType === 'walk_in'
                  ? 'border-[#6D4AFF] bg-[#F0ECFF]'
                  : 'border-neutral-300 bg-white hover:border-neutral-400'
              }`}
            >
              <p className="text-base font-bold text-neutral-900">Walk-in Hiring</p>
              <p className="mt-1 text-sm text-neutral-500">On-site interviews. Adds address & time slots.</p>
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pb-6">
          <p className="text-sm text-neutral-500">
            {isComplete ? 'All required fields complete.' : 'Complete all required fields to enable publish.'}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="h-10 rounded border border-neutral-300 bg-white px-6 text-sm font-bold text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={!isComplete || submitting || loadingCompany || !companyId}
              className="h-10 rounded bg-[#6D4AFF] px-6 text-sm font-bold text-white transition-all hover:bg-[#5F3CF0] disabled:opacity-55 disabled:hover:bg-[#6D4AFF]"
            >
              {submitting ? 'Publishing...' : 'Publish job'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}