'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { companyAction } from '../../../../lib/actions/company.action';
import { MyCompany } from '../../../../lib/types/company.types';
import AppHeader from '../../../components/appheader';
import { ROUTES } from '../../../../lib/route';
import { getBackendImageUrl } from '../../../../lib/utils/image-url';

const INDUSTRIES = ['Sales', 'IT', 'Finance', 'Marketing', 'Operations', 'Retail', 'Other'];

interface FormState {
  companyName: string;
  industry: string;
  headquarters: string;
  companyWebsite: string;
  aboutCompany: string;
  whyChooseUs: string;
}

type TabView = 'profile' | 'edit';

// Profile completeness calculator
function calculateCompleteness(company: MyCompany | null): { percent: number; missing: string[] } {
  if (!company) return { percent: 0, missing: [] };

  const fields: { key: string; label: string; check: () => boolean }[] = [
    { key: 'companyName', label: 'Company name', check: () => !!company.companyName },
    { key: 'industry', label: 'Industry', check: () => !!company.industry },
    { key: 'headquarters', label: 'Headquarters', check: () => !!company.headquarters },
    { key: 'companyWebsite', label: 'Company website', check: () => !!company.companyWebsite },
    { key: 'aboutCompany', label: 'About company', check: () => !!company.aboutCompany },
    { key: 'whyChooseUs', label: 'Why choose us', check: () => !!company.whyChooseUs },
    { key: 'companyLogo', label: 'Company logo', check: () => !!company.companyLogo },
  ];

  const filled = fields.filter((f) => f.check());
  const missing = fields.filter((f) => !f.check()).map((f) => f.label);
  return { percent: Math.round((filled.length / fields.length) * 100), missing };
}

export default function EmployerProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const initialTab = searchParams.get('tab') === 'edit' ? 'edit' : 'profile';
  const [company, setCompany] = useState<MyCompany | null>(null);
  const [tab, setTab] = useState<TabView>(initialTab);

  const [form, setForm] = useState<FormState>({
    companyName: '',
    industry: 'Sales',
    headquarters: '',
    companyWebsite: '',
    aboutCompany: '',
    whyChooseUs: '',
  });

  const [existingLogo, setExistingLogo] = useState<string | undefined>(undefined);
  const [newLogo, setNewLogo] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }));

  const { percent, missing } = useMemo(() => calculateCompleteness(company), [company]);

  useEffect(() => {
    (async () => {
      const result = await companyAction.getMyCompany();
      if (result.success) {
        const c = result.data;
        setCompany(c);
        setForm({
          companyName: c.companyName,
          industry: c.industry,
          headquarters: c.headquarters,
          companyWebsite: c.companyWebsite,
          aboutCompany: c.aboutCompany ?? '',
          whyChooseUs: c.whyChooseUs ?? '',
        });
        setExistingLogo(c.companyLogo);
      } else {
        setError(result.message);
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (!form.companyName.trim() || !form.headquarters.trim()) {
      setError('Company name and headquarters are required.');
      return;
    }

    setSaving(true);
    setError(null);

    const result = await companyAction.updateMyCompany({
      companyName: form.companyName,
      industry: form.industry,
      headquarters: form.headquarters,
      companyWebsite: form.companyWebsite,
      aboutCompany: form.aboutCompany,
      whyChooseUs: form.whyChooseUs,
      companyLogo: newLogo ?? undefined,
    });

    setSaving(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Update local state with the response
    setCompany(result.data);
    setExistingLogo(result.data.companyLogo);
    setNewLogo(null);
    setSuccess(true);
    setTab('profile');
    setTimeout(() => setSuccess(false), 4000);
  };

  const logoPreview = newLogo ? URL.createObjectURL(newLogo) : getBackendImageUrl(existingLogo);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA]">
        <AppHeader portal="employer" />
        <div className="flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#6D4AFF] border-t-transparent animate-spin" />
            <p className="text-sm text-neutral-500">Loading company profile...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <AppHeader portal="employer" />

      <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Company Profile</h1>
            <p className="mt-1 text-sm text-neutral-500">
              View and manage your company information.
            </p>
          </div>
          <button
            onClick={() => router.push(ROUTES.employerDashboard)}
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
            Company profile updated successfully.
          </div>
        )}

        {/* Verification pending banner */}
        {company && company.status !== 'verified' && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-amber-900">Verification Pending</h3>
                <p className="mt-1 text-sm text-amber-700">
                  We&apos;re reviewing your submitted business document. This usually takes a few business days.
                </p>
                <a
                  href={`/Features/CompanyProfile/${company.companyId}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#6D4AFF] hover:underline"
                >
                  View company profile
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ===== VIEW TAB ===== */}
        {tab === 'profile' && company && (
          <div className="mt-6 space-y-6">
            {/* Company card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-xl bg-[#F0ECFF] flex-shrink-0 overflow-hidden flex items-center justify-center border-2 border-neutral-100">
                  {existingLogo ? (
                    <img src={getBackendImageUrl(existingLogo)} alt="Company logo" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/company.png'; }} />
                  ) : (
                    <img src="/company.png" alt="Company" className="w-12 h-12 object-contain opacity-60" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-neutral-900">{company.companyName}</h2>
                    {company.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.59L7 10l-2.41-2.41L5.3 6.88 7 8.59l3.7-3.7.71.7z"/></svg>
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        Verification pending
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">
                    {[company.industry, company.headquarters].filter(Boolean).join(' • ')}
                  </p>
                  {company.companyWebsite && (
                    <a href={company.companyWebsite.startsWith('http') ? company.companyWebsite : `https://${company.companyWebsite}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm text-[#6D4AFF] hover:underline">
                      {company.companyWebsite}
                    </a>
                  )}
                </div>
              </div>

              {/* About */}
              {company.aboutCompany && (
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">About the Company</h3>
                  <p className="text-sm text-neutral-700 leading-relaxed">{company.aboutCompany}</p>
                </div>
              )}

              {/* Why choose us */}
              {company.whyChooseUs && (
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Why Candidates Should Join</h3>
                  <p className="text-sm text-neutral-700 leading-relaxed">{company.whyChooseUs}</p>
                </div>
              )}

              {/* Details grid */}
              <div className="mt-6 pt-6 border-t border-neutral-100">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Company Details</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  <div>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase">Industry</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">{company.industry || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase">Headquarters</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">{company.headquarters || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase">Website</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900">{company.companyWebsite || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase">Status</p>
                    <p className="mt-1 text-sm font-medium text-neutral-900 capitalize">{company.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile completeness */}
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

              {percent === 100 && (
                <p className="mt-3 text-xs text-emerald-600">
                  Your company profile is complete. It looks great to job seekers!
                </p>
              )}
            </div>
          </div>
        )}

        {/* ===== EDIT TAB ===== */}
        {tab === 'edit' && (
          <div className="mt-6 space-y-6">
            {/* Logo */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex items-center gap-6">
              <div className="relative w-20 h-20 rounded-xl bg-[#F0ECFF] flex-shrink-0 overflow-hidden flex items-center justify-center border-2 border-neutral-100">
                {logoPreview ? (
                  <img src={logoPreview} alt="Company logo" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/company.png'; }} />
                ) : (
                  <img src="/company.png" alt="Company" className="w-12 h-12 object-contain opacity-60" />
                )}
              </div>
              <div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setNewLogo(e.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="h-9 px-5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  Change logo
                </button>
                <p className="mt-2 text-xs text-neutral-400">JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            {/* Basic details */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-8">
              <h2 className="text-base font-bold text-neutral-900">Company Details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Company name</p>
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => update({ companyName: e.target.value })}
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                  />
                </label>
                <label className="block">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Industry</p>
                  <select
                    value={form.industry}
                    onChange={(e) => update({ industry: e.target.value })}
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                  >
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Headquarters</p>
                  <input
                    type="text"
                    value={form.headquarters}
                    onChange={(e) => update({ headquarters: e.target.value })}
                    placeholder="e.g. Kathmandu, Nepal"
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                  />
                </label>
                <label className="block">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Company website</p>
                  <input
                    type="text"
                    value={form.companyWebsite}
                    onChange={(e) => update({ companyWebsite: e.target.value })}
                    placeholder="https://yourcompany.com"
                    className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                  />
                </label>
              </div>
            </div>

            {/* Public profile */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-8">
              <h2 className="text-base font-bold text-neutral-900">Public Profile</h2>
              <label className="block mt-6">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">About company</p>
                <textarea
                  rows={4}
                  value={form.aboutCompany}
                  onChange={(e) => update({ aboutCompany: e.target.value })}
                  placeholder="Tell candidates about your company, culture, and mission..."
                  className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                />
              </label>
              <label className="block mt-5">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">Why candidates should choose you</p>
                <textarea
                  rows={3}
                  value={form.whyChooseUs}
                  onChange={(e) => update({ whyChooseUs: e.target.value })}
                  placeholder="What makes your company a great place to work?"
                  className="mt-2 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-none transition-all focus:border-[#6D4AFF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,74,255,0.08)]"
                />
              </label>
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
