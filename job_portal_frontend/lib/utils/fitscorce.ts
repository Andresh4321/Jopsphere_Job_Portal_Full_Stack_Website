// Mirrors services/application.service.ts's computeFitScore on the backend.
// This is used client-side only to rank "Recommended for you" jobs before
// the user applies — the real, authoritative fitScore is always computed
// server-side at apply time and may differ slightly if backend logic changes.

interface FitScoreProfile {
  topSkills: string[];
  preferredLocation?: string;
  preferredWorkType?: string;
}

interface FitScoreJob {
  skills: string[];
  location: string;
  workType: string;
}

export const computeClientFitScore = (profile: FitScoreProfile, job: FitScoreJob): number => {
  const locationScore =
    profile.preferredLocation &&
    profile.preferredLocation.trim().toLowerCase() === job.location.trim().toLowerCase()
      ? 20
      : 0;

  const workTypeScore =
    profile.preferredWorkType && profile.preferredWorkType === job.workType ? 10 : 0;

  let skillsRatio = 0;
  if (profile.topSkills.length > 0 && job.skills.length > 0) {
    const targetText = job.skills.join(' ').toLowerCase();
    const matched = profile.topSkills.filter((skill) => targetText.includes(skill.toLowerCase()));
    skillsRatio = matched.length / profile.topSkills.length;
  }

  if (skillsRatio >= 1) return 94;

  const skillsScore = Math.round(skillsRatio * 80);
  return Math.min(locationScore + skillsScore + workTypeScore, 95);
};