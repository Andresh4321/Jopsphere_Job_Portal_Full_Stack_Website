import React, { useState } from "react";

const RoleSelectionPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<"seeker" | "employer">(
    "seeker"
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>

            <h1 className="text-2xl font-bold text-neutral-900">
              Jopsphere
            </h1>
          </div>

          <nav className="hidden lg:flex items-center gap-10 text-sm text-neutral-500">
            <a href="#">Find Jobs</a>
            <a href="#">My Applications</a>
            <a href="#">Salary Explorer</a>
            <a href="#">For Employers</a>
            <a href="#">Applicants</a>
          </nav>

          <div className="flex items-center gap-5">
            <button className="font-semibold text-sm text-neutral-900">
              Sign in
            </button>

            <button className="bg-violet-600 text-white px-5 py-2 rounded font-semibold text-sm">
              Post a Job
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-[260px_1fr_260px] gap-10">
            {/* Left Side */}
            <div className="space-y-8">
              <div className="bg-white border p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-violet-100 flex items-center justify-center">
                    <span className="font-bold text-violet-600">1</span>
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Personalized flow
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Choose seeker or employer experience
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center */}
            <div>
              {/* Progress */}
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-sm">
                  Step 2 of 3
                </span>

                <span className="text-sm text-neutral-500">
                  ~1 min
                </span>
              </div>

              <div className="h-2 bg-violet-100 rounded mb-10">
                <div className="h-full w-2/3 bg-violet-600 rounded" />
              </div>

              {/* Card */}
              <div className="bg-white border p-10">
                <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                  What brings you to Kaam?
                </h2>

                <p className="text-neutral-500 mb-10">
                  Choose your role so we can personalize your
                  experience.
                </p>

                {/* Role Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  <button
                    onClick={() => setSelectedRole("seeker")}
                    className={`text-left p-6 border transition ${
                      selectedRole === "seeker"
                        ? "border-violet-600 bg-violet-50"
                        : "border-neutral-300"
                    }`}
                  >
                    <div className="w-11 h-11 rounded bg-violet-100 flex items-center justify-center mb-4">
                      👤
                    </div>

                    <h3 className="font-bold text-lg mb-2">
                      Job Seeker
                    </h3>

                    <p className="text-sm text-neutral-500">
                      Find verified jobs that respond.
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedRole("employer")}
                    className={`text-left p-6 border transition ${
                      selectedRole === "employer"
                        ? "border-green-600 bg-green-50"
                        : "border-neutral-300"
                    }`}
                  >
                    <div className="w-11 h-11 rounded bg-green-100 flex items-center justify-center mb-4">
                      🏢
                    </div>

                    <h3 className="font-bold text-lg mb-2">
                      Employer
                    </h3>

                    <p className="text-sm text-neutral-500">
                      Hire faster with verified candidates.
                    </p>
                  </button>
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                  <button className="px-8 py-2.5 font-semibold border">
                    Back
                  </button>

                  <div className="flex gap-3">
                    <button className="px-6 py-2.5 border font-semibold">
                      For Employer
                    </button>

                    <button className="px-8 py-2.5 bg-violet-600 text-white font-semibold">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-8">
              <div className="bg-white border p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded bg-green-100 flex items-center justify-center">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Verified platform
                    </h3>

                    <p className="text-sm text-neutral-500">
                      Real employers and real candidates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white border p-6">
              <h3 className="font-bold text-lg mb-3">
                For job seekers
              </h3>

              <p className="text-neutral-500 text-sm">
                Track applications and get real responses.
              </p>
            </div>

            <div className="bg-white border p-6">
              <h3 className="font-bold text-lg mb-3">
                For employers
              </h3>

              <p className="text-neutral-500 text-sm">
                Post verified jobs and manage applicants.
              </p>
            </div>

            <div className="bg-white border p-6">
              <h3 className="font-bold text-lg mb-3">
                Fast setup
              </h3>

              <p className="text-neutral-500 text-sm">
                Complete onboarding in about one minute.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-10">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-wrap justify-between items-center gap-6">
          <div>
            <h3 className="font-bold text-2xl">Kaam</h3>
            <p className="text-sm text-neutral-500 mt-2">
              Nepal's first verified job portal.
            </p>
          </div>

          <div className="flex gap-8 text-sm text-neutral-500">
            <a href="#">How it works</a>
            <a href="#">FAQ</a>
            <a href="#">Privacy</a>
            <a href="#">Contact</a>
          </div>

          <div className="text-sm text-neutral-500">
            © 2026 Kaam. Made in Nepal.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RoleSelectionPage;