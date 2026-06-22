import React from "react";

const VerifyPage: React.FC = () => {
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

          <nav className="hidden md:flex items-center gap-10 text-sm text-neutral-500">
            <a href="#">Find Jobs</a>
            <a href="#">My Applications</a>
            <a href="#">Salary Explorer</a>
            <a href="#">For Employers</a>
            <a href="#">Applicants</a>
          </nav>

          <div className="flex items-center gap-5">
            <button className="text-sm text-neutral-900">Sign in</button>

            <button className="bg-violet-600 text-white px-5 py-2 rounded font-semibold text-sm">
              Post a Job
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-[240px_1fr_260px] gap-10">
            {/* Left Sidebar */}
            <div className="space-y-8">
              <div className="bg-white border p-6">
                <div className="flex gap-4 items-center">
                  <div className="w-11 h-11 rounded bg-violet-100 flex items-center justify-center">
                    <span className="font-bold text-violet-600">1</span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm">OTP signup</h3>
                    <p className="text-xs text-neutral-500">
                      No password needed
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-violet-100 p-8">
                <h3 className="text-lg font-bold text-neutral-900 mb-3">
                  Get started faster
                </h3>

                <p className="text-sm text-neutral-500">
                  Create your profile and apply in under a minute.
                </p>
              </div>
            </div>

            {/* Center Content */}
            <div>
              {/* Progress */}
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-sm text-neutral-900">
                  Step 1 of 3
                </span>

                <span className="text-sm text-neutral-500">~1 min</span>
              </div>

              <div className="h-2 bg-violet-100 rounded mb-10">
                <div className="h-full w-1/3 bg-violet-600 rounded" />
              </div>

              {/* Card */}
              <div className="bg-white border p-10">
                <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                  Let's verify it's really you
                </h2>

                <p className="text-neutral-500 mb-10">
                  No passwords. We'll send a one-time code.
                </p>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full h-11 border px-4 outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    Phone
                  </label>

                  <input
                    type="tel"
                    placeholder="98XXXXXXXX"
                    className="w-full h-11 border px-4 outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {/* OTP */}
                <div className="mb-12">
                  <label className="block text-sm font-semibold mb-2">
                    OTP CODE
                  </label>

                  <div className="flex gap-4 items-center">
                    <input
                      type="text"
                      className="w-[220px] h-11 border px-4 outline-none focus:ring-2 focus:ring-violet-500"
                    />

                    <button className="bg-amber-100 px-6 py-2 font-semibold text-sm">
                      SEND
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="border px-8 py-2.5 font-semibold">
                    Back
                  </button>

                  <button className="border px-8 py-2.5 font-semibold">
                    Browse first
                  </button>

                  <button className="bg-violet-600 text-white px-10 py-2.5 font-semibold">
                    Continue
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              <div className="bg-white border p-6">
                <div className="flex gap-4 items-center">
                  <div className="w-11 h-11 rounded bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-bold">✓</span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm">
                      Verified only
                    </h3>

                    <p className="text-xs text-neutral-500">
                      Real jobs, real replies
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-100 p-8">
                <h3 className="text-lg font-bold text-neutral-900 mb-3">
                  Response guarantee
                </h3>

                <p className="text-sm text-neutral-500">
                  Track every application with real status updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-wrap justify-between items-center gap-6">
          <div>
            <h3 className="font-bold text-2xl text-neutral-900">Kaam</h3>
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

export default VerifyPage;