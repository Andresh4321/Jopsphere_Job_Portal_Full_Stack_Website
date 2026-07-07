import { WorkType, ListingType, SalaryRange } from '../types/job.types';

export const formatSalaryRange = (salary: SalaryRange): string =>
  `NPR ${salary.min.toLocaleString('en-IN')}-${salary.max.toLocaleString('en-IN')}/mo`;

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  remote: 'Remote',
};

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  standard: 'Online applications',
  walk_in: 'Walk-in Hiring',
};

export const formatRelativeTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Posted today';
  if (diffDays === 1) return 'Posted 1 day ago';
  if (diffDays < 30) return `Posted ${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return 'Posted 1 month ago';
  return `Posted ${diffMonths} months ago`;
};

export const formatDeadline = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });