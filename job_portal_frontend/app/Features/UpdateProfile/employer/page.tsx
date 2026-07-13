'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import { companyAction } from '../../../../lib/actions/company.action';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans' });
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: ['400'], variable: '--font-serif' });

const INDUSTRIES = ['Sales', 'IT', 'Finance', 'Marketing', 'Operations', 'Retail', 'Other'];

interface FormState {
  companyName: string;
  industry: string;
  headquarters: string;
  companyWebsite: string;
  aboutCompany: string;
  whyChooseUs: string;
}

export default function UpdateEmployerProfilePage() {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);

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
  const [status, setStatus] = useState<'unverified' | 'verified'>('unverified');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    (async () => {
      const result = await companyAction.getMyCompany();
      if (result.success) {
        const c = result.data;
        setForm({
          companyName: c.companyName,
          industry: c.industry,
          headquarters: c.headquarters,
          companyWebsite: c.companyWebsite,
          aboutCompany: c.aboutCompany ?? '',
          whyChooseUs: c.whyChooseUs ?? '',
        });
        setExistingLogo(c.companyLogo);
        setStatus(c.status);
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

    setExistingLogo(result.data.companyLogo);
    setNewLogo(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const inputClass =
    'mt-2 h-11 w-full rounded border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-all focus:border-indigo-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.10)]';
  const labelClass = 'text-xs font-bold text-stone-600 uppercase tracking-wide';

  const logoPreview = newLogo ? URL.createObjectURL(newLogo) : existingLogo;

  if (loading) {
    return (
      <div className={`${dmSans.variable} ${dmSerif.variable} min-h-screen bg-[#F8F7F3] flex items-center justify-center`}>
        <p className="text-sm text-stone-600">Loading company profile...</p>
      </div>
    );
  }

  return (
    <div className={`${dmSans.variable} ${dmSerif.variable} min-h-screen bg-[#F8F7F3]`} style={{ fontFamily: 'var(--font-sans)' }}>
      <div className="max-w-[860px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>
            Update company profile
          </h1>
          <button onClick={() => router.push('/Features/employer_dashboard')} className="text-sm font-medium text-stone-600 hover:text-neutral-900">
            ← Back to dashboard
          </button>
        </div>
        <p className="mt-2 text-sm text-stone-600">
          {status === 'verified' ? '✓ Verified business' : 'Verification pending — you can still update your details.'}
        </p>

        {error && (
          <div className="mt-6 rounded border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="mt-6 rounded border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm text-emerald-700">
            ✓ Company profile updated successfully.
          </div>
        )}

        {/* Logo */}
        <div className="mt-8 bg-white border border-neutral-200 rounded p-8 flex items-center gap-6">
          <div className="relative w-20 h-20 rounded bg-indigo-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="Company logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-indigo-400">
                {form.companyName ? form.companyName[0].toUpperCase() : '?'}
              </span>
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
              className="h-9 px-5 rounded border border-neutral-200 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              Change logo
            </button>
            <p className="mt-2 text-xs text-stone-500">JPG, PNG or GIF. Max 2MB.</p>
          </div>
        </div>

        {/* Basic details */}
        <div className="mt-6 bg-white border border-neutral-200 rounded p-8">
          <h2 className="text-base text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>Company basic details</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <p className={labelClass}>Company name</p>
              <input type="text" value={form.companyName} onChange={(e) => update({ companyName: e.target.value })} className={inputClass} />
            </label>
            <label className="block">
              <p className={labelClass}>Industry</p>
              <select value={form.industry} onChange={(e) => update({ industry: e.target.value })} className={inputClass}>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <p className={labelClass}>Headquarters</p>
              <input type="text" value={form.headquarters} onChange={(e) => update({ headquarters: e.target.value })} className={inputClass} />
            </label>
            <label className="block">
              <p className={labelClass}>Company website</p>
              <input type="text" value={form.companyWebsite} onChange={(e) => update({ companyWebsite: e.target.value })} className={inputClass} />
            </label>
          </div>
        </div>

        {/* Public profile */}
        <div className="mt-6 bg-white border border-neutral-200 rounded p-8">
          <h2 className="text-base text-neutral-900" style={{ fontFamily: 'var(--font-serif)' }}>Public company profile</h2>
          <label className="block mt-6">
            <p className={labelClass}>About company</p>
            <textarea
              rows={4}
              value={form.aboutCompany}
              onChange={(e) => update({ aboutCompany: e.target.value })}
              className={`${inputClass} h-auto py-3 resize-none`}
            />
          </label>
          <label className="block mt-5">
            <p className={labelClass}>Why candidates should choose you</p>
            <textarea
              rows={3}
              value={form.whyChooseUs}
              onChange={(e) => update({ whyChooseUs: e.target.value })}
              className={`${inputClass} h-auto py-3 resize-none`}
            />
          </label>
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