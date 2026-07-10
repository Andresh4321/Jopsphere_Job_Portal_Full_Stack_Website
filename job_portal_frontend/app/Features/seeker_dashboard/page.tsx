'use client';

import { useEffect, useState } from 'react';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import { SiteHeader } from '../../components/seeker_dashboard/site-header';
import { SiteFooter } from '../../components/seeker_dashboard/site-footer';
import {
  SeekerDashboard,
  ApplicationItem,
  ApplicationStatus,
  RecommendedJob,
  DashboardStat,
} from '../../components/seeker_dashboard/seeker-dashboard';
import { applicationAction } from '../../../lib/actions/application.action';
import { jobAction } from '../../../lib/actions/job.action';
import { jobSeekerAction } from '../../../lib/actions/jobseeker.action';
import { savedJobAction } from '../../../lib/actions/savedjob.action';
import { SeekerApplication, ApplicationStage } from '../../../lib/types/application.types';
import { formatRelativeTime, formatSalaryRange } from '../../../lib/utils/job-format';
import { computeClientFitScore } from '../../../lib/utils/fitscorce';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans' });
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: ['400'], variable: '--font-serif' });

// The shared component only supports 4 display statuses; fold the full
// 7-stage pipeline down into the closest bucket for this summary view.
// (The real, unfolded stage is still shown accurately on "My Applications".)
const foldStage = (stage: ApplicationStage): ApplicationStatus => {
  if (stage === 'interview') return 'Interview';
  if (stage === 'viewed' || stage === 'shortlisted') return 'Viewed';
  if (stage === 'offer' || stage === 'hired') return 'Offer';
  return 'Applied'; // applied, rejected
};

export default function SeekerDashboardPage() {
  const [applications, setApplications] = useState<SeekerApplication[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [verifications, setVerifications] = useState<string[]>([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [userName, setUserName] = useState('there');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [appsResult, profileResult, jobsResult, savedResult] = await Promise.all([
        applicationAction.getMyApplications(),
        jobSeekerAction.getMyProfile(),
        jobAction.listAllJobs({ status: 'open' }),
        savedJobAction.getMySavedJobs(),
      ]);

      if (appsResult.success) setApplications(appsResult.data);
      if (savedResult.success) setSavedJobsCount(savedResult.data.length);

      if (profileResult.success) {
        const profile = profileResult.data;
        setUserName(profile.fullName.split(' ')[0]);

        // Profile completeness: 3 fields are always filled at registration
        // (fullName, topSkills, aboutYourself), the rest are optional bonuses.
        const optionalFilled = [
          profile.qualificationImages.length > 0,
          !!profile.preferredLocation,
          !!profile.preferredWorkType,
        ].filter(Boolean).length;
        setProfileCompleteness(Math.round(((3 + optionalFilled) / 6) * 100));

        setVerifications(
          [
            profile.accountVerified ? 'Account verified' : null,
            profile.qualificationImages.length > 0 ? 'Qualification documents uploaded' : null,
            profile.preferredLocation ? 'Preferred location set' : null,
            profile.preferredWorkType ? 'Preferred work type set' : null,
          ].filter((v): v is string => !!v)
        );

        // Recommended jobs: open jobs not yet applied to, ranked by client-side fit score.
        if (jobsResult.success) {
          const appliedJobIds = new Set(
            appsResult.success ? appsResult.data.map((a) => a.jobId) : []
          );
          const candidates = jobsResult.data.filter((j) => !appliedJobIds.has(j.id));

          const ranked = candidates
            .map((job) => ({
              jobId: job.id,
              title: job.jobTitle,
              company: job.companyName,
              location: job.location,
              salary: formatSalaryRange(job.salary),
              match: computeClientFitScore(
                { topSkills: profile.topSkills, preferredLocation: profile.preferredLocation, preferredWorkType: profile.preferredWorkType },
                { skills: job.skills, location: job.location, workType: job.workType }
              ),
              verified: job.companyVerified,
            }))
            .sort((a, b) => b.match - a.match)
            .slice(0, 4);

          setRecommendedJobs(ranked);
        }
      }

      setLoading(false);
    })();
  }, []);

  const applicationItems: ApplicationItem[] = applications.slice(0, 4).map((app) => ({
    jobId: app.jobId,
    title: app.jobTitle,
    company: app.companyName,
    appliedAgo: `Applied ${formatRelativeTime(app.appliedAt)}`,
    status: foldStage(app.stage),
  }));

  const activeCount = applications.filter((a) => a.stage !== 'hired' && a.stage !== 'rejected').length;
  const interviewsOffersCount = applications.filter((a) => ['interview', 'offer', 'hired'].includes(a.stage)).length;
  const respondedCount = applications.filter((a) => a.stage !== 'applied').length;
  const responseRate = applications.length > 0 ? Math.round((respondedCount / applications.length) * 100) : 0;

  const stats: DashboardStat[] = [
    { label: 'Applications', value: String(applications.length), sub: 'All time' },
    { label: 'Active', value: String(activeCount), sub: 'Awaiting a reply' },
    { label: 'Interviews & offers', value: String(interviewsOffersCount), sub: null },
    { label: 'Response rate', value: `${responseRate}%`, sub: 'From employers' },
  ];

  if (loading) {
    return (
      <div
        className={`${dmSans.variable} ${dmSerif.variable} min-h-screen bg-[#F8F7F3] font-sans text-neutral-900 antialiased flex items-center justify-center`}
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <p className="text-sm text-neutral-500">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div
      className={`${dmSans.variable} ${dmSerif.variable} min-h-screen bg-[#F8F7F3] font-sans text-neutral-900 antialiased`}
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <SiteHeader active="seeker" />
      <SeekerDashboard
        userName={userName}
        stats={stats}
        applications={applicationItems}
        recommendedJobs={recommendedJobs}
        profileCompleteness={profileCompleteness}
        verifications={verifications}
        savedJobsCount={savedJobsCount}
      />
      <SiteFooter />
    </div>
  );
}