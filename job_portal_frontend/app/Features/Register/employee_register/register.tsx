import React, { useState } from "react";

const EmployerSetupStep3: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: "Daraz Nepal",
    industry: "Sales",
    location: "Kathmandu",
    website: "",
    about:
      "Daraz Nepal is a verified employer on Kaam, headquartered in Kathmandu. The company hires sales, operations, and digital commerce talent with transparent salary ranges.",
    whyChoose:
      "Guaranteed response within 5 days, salary disclosed on every listing, clear interview process, and feedback after interviews.",
    registrationNumber: "",
    document: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
            <div className="w-10 h-10 rounded bg-violet-600 flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>

            <h1 className="text-2xl font-bold">Jopsphere</h1>
          </div>

          <nav className="hidden lg:flex gap-10 text-sm text-neutral-500">
            <a href="#">Find Jobs</a>
            <a href="#">My Applications</a>
            <a href="#">Salary Explorer</a>
            <a href="#" className="font-semibold text-neutral-900">
              For Employers
            </a>
            <a href="#">Applicants</a>
          </nav>

          <div className="flex items-center gap-5">
            <button className="text-sm">Sign in</button>

            <button className="bg-violet-600 text-white px-5 py-2 rounded font-semibold text-sm">
              Post a Job
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-14">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-[260px_1fr_260px] gap-8">
            {/* Left Sidebar */}
            <div>
              <div className="bg-white border p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded flex items-center justify-center">
                    <span className="text-violet-600 font-bold">3</span>
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Final setup
                    </h3>

                    <p className="text-sm text-neutral-500 mt-1">
                      Complete your company profile
                    </p>
                  </div>
                </div>

                <p className="text-sm text-neutral-500 mt-6">
                  This creates your public employer page.
                </p>
              </div>
            </div>

            {/* Center Content */}
            <div>
              {/* Progress */}
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-sm">
                  Employer setup · Step 3 of 3
                </span>

                <span className="text-sm text-neutral-500">
                  ~3 min
                </span>
              </div>

              <div className="h-2 bg-violet-100 rounded mb-10">
                <div className="h-full w-full bg-violet-600 rounded" />
              </div>

              {/* Form Card */}
              <div className="bg-white border p-10">
                <h2 className="text-3xl font-bold mb-3">
                  Verify your company
                </h2>

                <p className="text-neutral-500 mb-10">
                  Add company details that will appear on your
                  public company profile.
                </p>

                {/* Basic Details */}
                <div className="mb-10">
                  <h3 className="text-xs font-bold tracking-wide text-neutral-500 mb-6">
                    COMPANY BASIC DETAILS
                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Company name
                      </label>

                      <input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full border h-11 px-4"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Industry
                      </label>

                      <select
                        className="w-full border h-11 px-4 bg-white"
                        value={formData.industry}
                      >
                        <option>Sales</option>
                        <option>IT</option>
                        <option>Finance</option>
                        <option>Marketing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Headquarters / Location
                      </label>

                      <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border h-11 px-4"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Company website
                      </label>

                      <input
                        name="website"
                        placeholder="https://company.com"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full border h-11 px-4"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Profile */}
                <div className="mb-10">
                  <h3 className="text-xs font-bold tracking-wide text-neutral-500 mb-6">
                    PUBLIC COMPANY PROFILE
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        About company
                      </label>

                      <textarea
                        rows={5}
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        className="w-full border p-4 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Why candidates should choose your company
                      </label>

                      <textarea
                        rows={4}
                        name="whyChoose"
                        value={formData.whyChoose}
                        onChange={handleChange}
                        className="w-full border p-4 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Verification */}
                <div>
                  <h3 className="text-xs font-bold tracking-wide text-neutral-500 mb-6">
                    VERIFICATION DOCUMENTS
                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Business registration number
                      </label>

                      <input
                        placeholder="e.g. 123456/080/081"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        className="w-full border h-11 px-4"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Upload company document
                      </label>

                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="w-full border h-11 px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-12">
                  <button className="border px-8 py-2.5 font-semibold">
                    Back
                  </button>

                  <div className="flex gap-3">
                    <button className="border px-8 py-2.5 font-semibold">
                      Save Draft
                    </button>

                    <button className="bg-violet-600 text-white px-8 py-2.5 font-semibold">
                      Submit for Verification
                    </button>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="bg-amber-100 text-amber-900 text-sm px-6 py-4 mt-6">
                Your company will be marked verified after Kaam
                reviews your submitted document.
              </div>
            </div>

            {/* Right Sidebar */}
            <div>
              <div className="bg-white border p-6">
                <h3 className="font-bold text-lg mb-6">
                  Verification checklist
                </h3>

                <ul className="space-y-4 text-sm">
                  <li className="text-green-600">
                    ✓ Company name
                  </li>

                  <li className="text-green-600">
                    ✓ Location
                  </li>

                  <li className="text-green-600">
                    ✓ Company profile
                  </li>

                  <li className="text-amber-700">
                    ○ Business document
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerSetupStep3;