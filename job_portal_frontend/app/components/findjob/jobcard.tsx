import Link from 'next/link';
import { JobListItem } from '../../../lib/types/job.types';
import { formatSalaryRange, WORK_TYPE_LABELS, LISTING_TYPE_LABELS, formatRelativeTime } from '../../../lib/utils/job-format';

export default function JobCard({ job }: { job: JobListItem }) {
  return (
    <Link href={`/Features/JobProfile/${job.id}`} className="block">
      <article className="rounded-md border border-neutral-200 bg-white p-7 transition-all hover:border-[#BCAEFF] hover:shadow-[0_4px_16px_rgba(109,74,255,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-bold text-neutral-900">{job.jobTitle}</h2>
            <p className="mt-2 text-[15px]">
              <span className="font-bold text-neutral-900">{job.companyName}</span>
              {job.companyVerified && <span className="ml-3 text-[#19A15F]">✓ Verified</span>}
              <span className="ml-3 text-neutral-500">· {job.location}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded bg-[#EAF8F0] px-4 py-2 text-[13px] font-bold text-[#148A50]">
            {formatSalaryRange(job.salary)}
          </span>
          <span className="rounded bg-[#F4F4F5] px-4 py-2 text-[13px] text-[#444444]">
            {WORK_TYPE_LABELS[job.workType]}
          </span>
          {job.listingType === 'walk_in' && (
            <span className="rounded bg-[#F4F4F5] px-4 py-2 text-[13px] text-[#444444]">
              {LISTING_TYPE_LABELS.walk_in}
            </span>
          )}
          {job.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="rounded bg-[#F0ECFF] px-4 py-2 text-[13px] text-[#6D4AFF]">
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[13px] text-neutral-500">
          <span>◷ {formatRelativeTime(job.createdAt)}</span>
        </div>
      </article>
    </Link>
  );
}