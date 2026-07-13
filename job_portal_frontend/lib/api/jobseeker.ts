import axiosClient from '../api/axois';
import { MyJobSeekerProfile, ApiResponse, UpdateJobSeekerProfilePayload } from '../types/jobseeker.types';

export const jobSeekerApi = {
  async getMyProfile(): Promise<MyJobSeekerProfile> {
    const res = await axiosClient.get<ApiResponse<MyJobSeekerProfile>>('/api/job-seekers/me');
    return res.data.data;
  },

  async updateMyProfile(payload: UpdateJobSeekerProfilePayload): Promise<MyJobSeekerProfile> {
    const formData = new FormData();

    if (payload.fullName !== undefined) formData.append('fullName', payload.fullName);
    if (payload.topSkills !== undefined) formData.append('topSkills', JSON.stringify(payload.topSkills));
    if (payload.aboutYourself !== undefined) formData.append('aboutYourself', payload.aboutYourself);
    if (payload.preferredLocation !== undefined) formData.append('preferredLocation', payload.preferredLocation);
    if (payload.preferredWorkType !== undefined) formData.append('preferredWorkType', payload.preferredWorkType);
    if (payload.experienceYears !== undefined) formData.append('experienceYears', String(payload.experienceYears));
    if (payload.expectedSalary !== undefined) formData.append('expectedSalary', String(payload.expectedSalary));
    if (payload.noticePeriodDays !== undefined) formData.append('noticePeriodDays', String(payload.noticePeriodDays));
    if (payload.education !== undefined) formData.append('education', payload.education);
    if (payload.linkedinUrl !== undefined) formData.append('linkedinUrl', payload.linkedinUrl);
    if (payload.profileImage) formData.append('profileImage', payload.profileImage);
    payload.newQualificationImages?.forEach((file) => formData.append('qualificationImages', file));

    const res = await axiosClient.patch<ApiResponse<MyJobSeekerProfile>>('/api/job-seekers/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
};