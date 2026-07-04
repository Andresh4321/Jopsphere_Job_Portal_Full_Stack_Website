'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterShell from '../../components/register/RegisterShell';
import StepTransition from '../../components/register/StepTransition';
import Step1Credentials from '../../components/register/Step1Credentials';
import Step2RoleSelect from '../../components/register/Step2RoleSelect';
import Step3JobSeeker from '../../components/register/Step3JobSeeker';
import Step3Employer from '../../components/register/Step3Employer';
import { RegisterFormState, initialRegisterFormState, parseTopSkills } from '../../components/register/types';
import { authAction } from '../../../lib/actions/auth.action';

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [formData, setFormData] = useState<RegisterFormState>(initialRegisterFormState);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateData = (patch: Partial<RegisterFormState>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const goNext = () => {
    setDirection(1);
    setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));
  };

  // Registers the account, then immediately logs in (register endpoints
  // don't return a token) and routes to the correct dashboard.
  const handleFinish = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (formData.role === 'job_seeker') {
        const registerResult = await authAction.registerJobSeeker({
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          fullName: formData.fullName,
          topSkills: parseTopSkills(formData.topSkillsRaw),
          aboutYourself: formData.aboutYourself,
          qualificationImages: formData.qualificationImages,
        });

        if (!registerResult.success) {
          setSubmitError(registerResult.message);
          return;
        }
      } else if (formData.role === 'employer') {
        if (!formData.companyDocument) {
          setSubmitError('Please upload your business registration document.');
          return;
        }

        const registerResult = await authAction.registerEmployer({
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          companyName: formData.companyName,
          industry: formData.industry,
          headquarters: formData.headquarters,
          companyWebsite: formData.companyWebsite,
          aboutCompany: formData.aboutCompany,
          whyChooseUs: formData.whyChooseUs,
          businessRegistrationNumber: formData.businessRegistrationNumber,
          companyDocument: formData.companyDocument,
        });

        if (!registerResult.success) {
          setSubmitError(registerResult.message);
          return;
        }
      } else {
        setSubmitError('Please choose a role before finishing.');
        return;
      }

      // Registration succeeded — log in immediately to get a token + redirect.
      const loginResult = await authAction.login({
        email: formData.email,
        password: formData.password,
      });

      if (!loginResult.success) {
        // Account was created but auto-login failed (rare) — send to login page.
        router.push('/login');
        return;
      }

      router.push(loginResult.redirectTo);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RegisterShell step={step}>
      <StepTransition step={step} direction={direction}>
        {step === 1 && (
          <Step1Credentials data={formData} updateData={updateData} onNext={goNext} />
        )}

        {step === 2 && (
          <Step2RoleSelect data={formData} updateData={updateData} onNext={goNext} onBack={goBack} />
        )}

        {step === 3 && formData.role === 'job_seeker' && (
          <Step3JobSeeker
            data={formData}
            updateData={updateData}
            onBack={goBack}
            onSubmit={handleFinish}
            submitting={submitting}
            submitError={submitError}
          />
        )}

        {step === 3 && formData.role === 'employer' && (
          <Step3Employer
            data={formData}
            updateData={updateData}
            onBack={goBack}
            onSubmit={handleFinish}
            submitting={submitting}
            submitError={submitError}
          />
        )}
      </StepTransition>
    </RegisterShell>
  );
}