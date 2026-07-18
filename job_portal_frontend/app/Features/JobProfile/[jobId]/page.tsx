'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { jobAction } from '../../../../lib/actions/job.action';
import { companyAction } from '../../../../lib/actions/company.action';
import { applicationAction } from '../../../../lib/actions/application.action';
import { savedJobAction } from '../../../../lib/actions/savedjob.action';
import { authAction } from '../../../../lib/actions/auth.action';
import { JobResponse } from '../../../../lib/types/job.types';
import { CompanyProfileFull } from '../../../../lib/types/company.types';
import {
  formatSalaryRange,
  WORK_TYPE_LABELS,
  formatRelativeTime,
  formatDeadline,
} from '../../../../lib/utils/job-format';
import { ROUTES } from '../../../../lib/route';
import { getBackendImageUrl } from '../../../../lib/utils/image-url';
import AppHeader from '../../../components/appheader';

export default function JobProfilePage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<JobResponse | null>(null);
  const [company, setCompany] = useState<CompanyProfileFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  const [saved, setSaved] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    (async () => {
      const jobResult = await jobAction.getJobById(jobId);
      if (!jobResult.success) {
        setError(jobResult.message);
        setLoading(false);
        return;
      }
      setJob(jobResult.data);

      // Enrich "About employer" with real company details rather than
      // fabricated stats — this is a second call, but only fires once.
      const companyResult = await companyAction.getCompanyProfile(jobResult.data.companyId);
      if (companyResult.success) {
        setCompany(companyResult.data);
      }

      // Check saved status + whether the seeker already applied
      // (only meaningful for logged-in job seekers)
      if (authAction.isAuthenticated() && authAction.getStoredRole() === 'job_seeker') {
        const savedResult = await savedJobAction.isJobSaved(jobId);
        if (savedResult.success) setSaved(savedResult.data);

        const myApplicationsResult = await applicationAction.getMyApplications();
        if (myApplicationsResult.success) {
          const alreadyApplied = myApplicationsResult.data.some((app) => app.jobId === jobId);
          if (alreadyApplied) setApplied(true);
        }
      }

      setLoading(false);
    })();
  }, [jobId]);

  const handleApply = async () => {
    if (!authAction.isAuthenticated()) {
      router.push(`${ROUTES.login}?next=${ROUTES.jobProfile(jobId)}`);
      return;
    }
    if (authAction.getStoredRole() !== 'job_seeker') {
      setApplyError('Only job seeker accounts can apply to jobs.');
      return;
    }

    setApplying(true);
    setApplyError(null);

    const result = await applicationAction.applyToJob(jobId);

    setApplying(false);

    if (!result.success) {
      // If it's a duplicate-application 409, the user is already applied —
      // show the applied state instead of an error banner.
      if (result.message.toLowerCase().includes('already applied')) {
        setApplied(true);
        return;
      }
      setApplyError(result.message);
      return;
    }

    setApplied(true);
  };

  const handleToggleSave = async () => {
    if (!authAction.isAuthenticated()) {
      router.push(`${ROUTES.login}?next=${ROUTES.jobProfile(jobId)}`);
      return;
    }
    if (authAction.getStoredRole() !== 'job_seeker') return;

    setSavingToggle(true);
    const result = saved ? await savedJobAction.unsaveJob(jobId) : await savedJobAction.saveJob(jobId);
    if (result.success) setSaved(result.data.saved);
    setSavingToggle(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-neutral-500 text-sm">Loading job...</p>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-900 font-bold">{error || 'Job not found.'}</p>
        <button
          type="button"
          onClick={() => router.push(ROUTES.findJobs)}
          className="text-sm font-bold text-[#6D4AFF]"
        >
          ← Back to jobs
        </button>
      </main>
    );
  }

  const overviewItems = [
    { label: 'Work type', value: WORK_TYPE_LABELS[job.workType] },
    { label: 'Location', value: job.location },
    ...(job.hoursPerWeek ? [{ label: 'Hours/week', value: `${job.hoursPerWeek} hours` }] : []),
    { label: 'Deadline', value: formatDeadline(job.applicationDeadline) },
  ];

  const trustSignals = [
    'Salary range is publicly shown',
    ...(job.company.companyVerified ? ['Verified employer account'] : []),
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-10 text-neutral-900">
      <AppHeader portal="seeker" />

      <section className="mx-auto w-full max-w-312 px-4 pt-8 lg:px-0">
        <button
          type="button"
          onClick={() => router.push(ROUTES.findJobs)}
          className="text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          ← Back to jobs
        </button>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_394px]">
          <div className="space-y-7">
            <article className="rounded border border-neutral-200 bg-white p-8">
              <div className="flex flex-wrap items-start gap-6">
                <div className="h-17 w-17 overflow-hidden rounded bg-[#F0ECFF] shrink-0 border border-neutral-100">
                  <img
                    src={company?.companyLogo ? getBackendImageUrl(company.companyLogo) : '/company.png'}
                    alt={company?.companyName || job.company.companyName}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/company.png'; }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-[34px] font-bold leading-tight">{job.jobTitle}</h2>
                  <p className="mt-3 text-base">
                    <span className="font-bold text-neutral-900">{job.company.companyName}</span>
                    {job.company.companyVerified && (
                      <span className="ml-3 text-[#19A15F]">✓ Verified employer</span>
                    )}
                  </p>
                  <p className="mt-2 text-[15px] text-neutral-500">
                    📍 {job.location} · {WORK_TYPE_LABELS[job.workType]}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="rounded bg-[#EAF8F0] px-5 py-2 text-sm font-bold text-[#148A50]">
                      {formatSalaryRange(job.salary)}
                    </span>
                    {job.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="rounded bg-[#F0ECFF] px-5 py-2 text-sm font-bold text-[#6D4AFF]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-7 text-sm text-neutral-500">
                {formatRelativeTime(job.createdAt)} · Application deadline: {formatDeadline(job.applicationDeadline)}
              </p>
            </article>

            <article className="rounded border border-neutral-200 bg-white p-8">
              <h3 className="text-[26px] font-bold">About the role</h3>
              <p className="mt-6 text-[15px] text-neutral-500 whitespace-pre-line">{job.aboutRole}</p>
            </article>

            <article className="rounded border border-neutral-200 bg-white p-8">
              <h3 className="text-[26px] font-bold">Responsibilities</h3>
              <ul className="mt-7 space-y-5">
                {job.responsibilities.map((item) => (
                  <li key={item} className="flex items-start gap-4 text-[15px]">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 bg-[#6D4AFF]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded border border-neutral-200 bg-white p-8">
              <h3 className="text-[26px] font-bold">Requirements</h3>
              <ul className="mt-7 space-y-5">
                {job.requirements.map((item) => (
                  <li key={item} className="flex items-start gap-4 text-[15px]">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 bg-[#19A15F]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {job.skills.length > 0 && (
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <span className="mr-2 text-sm font-bold">Skills</span>
                  {job.skills.map((skill) => (
                    <span key={skill} className="rounded bg-[#EAF8F0] px-4 py-1.5 text-xs text-[#148A50]">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </article>
          </div>

          <aside className="space-y-7">
            <div className="rounded border border-neutral-200 bg-white p-8">
              <h3 className="text-2xl font-bold">Apply with confidence</h3>
              <p className="mt-3 text-sm text-neutral-500">
                {job.company.companyVerified
                  ? 'This employer is verified and salary is disclosed.'
                  : 'Salary is disclosed for this listing.'}
              </p>

              {applyError && (
                <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-4 py-2.5">
                  {applyError}
                </div>
              )}

              {applied ? (
                <div className="mt-5 h-11.5 w-full rounded bg-[#EAF8F0] text-[#148A50] text-[15px] font-bold flex items-center justify-center">
                  ✓ Application submitted
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={applying}
                  className="mt-5 h-11.5 w-full rounded bg-[#6D4AFF] text-[15px] font-bold text-white hover:bg-[#5F3CF0] transition-colors disabled:opacity-60"
                >
                  {applying ? 'Submitting...' : 'Apply now'}
                </button>
              )}
              <button
                type="button"
                onClick={handleToggleSave}
                disabled={savingToggle}
                className={`mt-3 h-11.5 w-full rounded border text-[15px] font-bold transition-colors disabled:opacity-60 ${
                  saved
                    ? 'border-[#6D4AFF] bg-[#F0ECFF] text-[#6D4AFF]'
                    : 'border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {saved ? '★ Saved' : 'Save job'}
              </button>

              {trustSignals.length > 0 && (
                <>
                  <p className="mt-8 text-[13px] font-bold text-neutral-500">JOB TRUST SIGNALS</p>
                  <ul className="mt-5 space-y-3 text-[15px]">
                    {trustSignals.map((item) => (
                      <li key={item}>✓ {item}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="rounded border border-neutral-200 bg-white p-8">
              <h3 className="text-2xl font-bold">Job overview</h3>
              <div className="mt-7 space-y-5">
                {overviewItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-neutral-500">{item.label}</span>
                    <span className="font-bold text-neutral-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded border border-neutral-200 bg-white p-8">
              <h3 className="text-2xl font-bold">About employer</h3>

              <Link
                href={ROUTES.companyProfile(job.company.companyId)}
                className="mt-5 flex items-start gap-4 rounded-xl border border-transparent p-2 -m-2 transition-colors hover:border-[#BCAEFF] hover:bg-[#FAFAFA]"
              >
                <div className="h-13.5 w-13.5 overflow-hidden rounded bg-[#F0ECFF] shrink-0 border border-neutral-100">
                  <img
                    src={company?.companyLogo ? getBackendImageUrl(company.companyLogo) : '/company.png'}
                    alt={company?.companyName || job.company.companyName}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/company.png'; }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-bold">{company?.companyName || job.company.companyName}</p>
                  <p className="mt-1 text-[13px] text-neutral-500">
                    {company ? `${company.industry} · ${company.headquarters}` : 'View company profile'}
                  </p>
                  {job.company.companyVerified ? (
                    <p className="mt-1 text-[13px] text-[#19A15F]">✓ Verified business</p>
                  ) : (
                    <p className="mt-1 text-[13px] text-neutral-400">Verification pending</p>
                  )}
                  {company && (
                    <p className="mt-4 text-sm text-neutral-600 line-clamp-4">{company.aboutCompany}</p>
                  )}
                </div>
              </Link>
            </div>
          </aside>
        </div>

        <section className="mt-7 flex flex-wrap items-center justify-between gap-6 rounded bg-[#F0ECFF] px-8 py-6">
          <div>
            <h3 className="text-[22px] font-bold">Salary transparency</h3>
            <p className="mt-2 text-[15px] text-neutral-500">
              Jopsphere requires salary disclosure before jobs are published. This helps applicants make informed
              decisions before applying.
            </p>
          </div>
          <button
            type="button"
            onClick={handleApply}
            disabled={applying || applied}
            className="h-9.5 rounded bg-[#6D4AFF] px-8 text-sm font-bold text-white hover:bg-[#5F3CF0] transition-colors disabled:opacity-60"
          >
            {applied ? '✓ Applied' : applying ? 'Submitting...' : 'Apply now'}
          </button>
        </section>
      </section>
    </main>
  );
}