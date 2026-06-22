import React, { useState } from "react";

const JobSeekerSetupStep3: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    skills: "",
    expectedSalary: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

          <nav className="hidden lg:flex gap-10 text-sm text-neutral-500">
            <a href="#">Find Jobs</a>
            <a href="#">My Applications</a>
            <a href="#">Salary Explorer</a>
            <a href="#">For Employers</a>
            <a href="#">Applicants</a>
          </nav>

          <div className="flex items-center gap-5">
            <button className="text-sm text-neutral-900">
              Sign in
            </button>

            <button className="bg-violet-600 text-white px-5 py-2 rounded font-semibold text-sm">
              Post a Job
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-14">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-[250px_1fr_250px] gap-8">
            {/* Left Sidebar */}
            <div>
              <div className="bg-white border p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded flex items-center justify-center">
                    <span className="text-violet-600 font-bold">
                      3
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Complete profile
                    </h3>

                    <p className="text-sm text-neutral-500 mt-1">
                      Add name, skills and salary expectation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Content */}
            <div>
              {/* Progress */}
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-sm">
                  Step 3 of 3
                </span>

                <span className="text-sm text-neutral-500">
                  ~1 min
                </span>
              </div>

              <div className="h-2 bg-violet-100 rounded mb-10">
                <div className="h-full w-full bg-violet-600 rounded" />
              </div>

              {/* Form Card */}
              <div className="bg-white border p-10">
                <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                  Tell us about you
                </h2>

                <p className="text-neutral-500 mb-10">
                  Auto-saved as you type.
                </p>

                {/* Full Name */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    Full name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Sita Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full h-11 border px-4"
                  />
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    Top 3 skills
                  </label>

                  <input
                    type="text"
                    name="skills"
                    placeholder="React, TypeScript, Figma"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full h-11 border px-4"
                  />
                </div>

                {/* Salary */}
                <div className="mb-10">
                  <label className="block text-sm font-semibold mb-2">
                    Expected salary (NPR/mo)
                  </label>

                  <input
                    type="number"
                    name="expectedSalary"
                    placeholder="60000"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                    className="w-full h-11 border px-4"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                  <button className="border px-8 py-2.5 font-semibold">
                    Back
                  </button>

                  <div className="flex gap-3">
                    <button className="border px-6 py-2.5 font-semibold">
                      Verify First
                    </button>

                    <button className="bg-violet-600 text-white px-8 py-2.5 font-semibold">
                      Finish
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div>
              <div className="bg-white border p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded bg-green-100 flex items-center justify-center">
                    ✓
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Auto-saved
                    </h3>

                    <p className="text-sm text-neutral-500 mt-1">
                      Your information is saved as you type.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="bg-white border p-6">
              <h3 className="font-bold text-lg mb-3">
                Name
              </h3>

              <p className="text-sm text-neutral-500">
                Use your real name for verified applications.
              </p>
            </div>

            <div className="bg-white border p-6">
              <h3 className="font-bold text-lg mb-3">
                Skills
              </h3>

              <p className="text-sm text-neutral-500">
                Add your top skills to improve job matching.
              </p>
            </div>

            <div className="bg-white border p-6">
              <h3 className="font-bold text-lg mb-3">
                Salary
              </h3>

              <p className="text-sm text-neutral-500">
                Set expected salary for better job suggestions.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-wrap justify-between items-center gap-6">
          <div>
            <h3 className="font-bold text-2xl">
              Kaam
            </h3>

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

export default JobSeekerSetupStep3;