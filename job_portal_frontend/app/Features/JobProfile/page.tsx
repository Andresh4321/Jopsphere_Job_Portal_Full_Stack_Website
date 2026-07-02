const trustSignals = [
	"Verified employer account",
	"Salary range is publicly shown",
	"Real application status tracking",
];

const responsibilities = [
	"Build reusable React components using TypeScript and clean UI patterns.",
	"Convert Figma designs into responsive, accessible frontend interfaces.",
	"Collaborate with backend teams to integrate REST APIs and handle state properly.",
	"Improve frontend performance, maintainability, and user experience.",
];

const requirements = [
	"Strong understanding of React, TypeScript, JavaScript, HTML and CSS.",
	"Experience with API integration, reusable components, and modern frontend tooling.",
	"Ability to work with design systems, Figma files, and responsive layouts.",
	"Good communication skills and willingness to collaborate in a product team.",
];

const preferredSkills = ["React", "TypeScript", "Figma", "REST API"];

const overviewItems = [
	{ label: "Work type", value: "Full-time" },
	{ label: "Level", value: "Mid level" },
	{ label: "Location", value: "Kathmandu" },
	{ label: "Hours/week", value: "40 hours" },
	{ label: "Deadline", value: "June 20, 2026" },
];

export default function JobProfilePage() {
	return (
		<main className="min-h-screen bg-[#FAFAFA] pb-10 text-neutral-900">
			<header className="border-b border-neutral-200 bg-white">
				<div className="mx-auto flex h-18 w-full max-w-312 items-center justify-between px-4 lg:px-0">
					<div className="flex items-center gap-4">
						<div className="relative h-9.5 w-9.5 rounded bg-[#6D4AFF]">
							<div className="absolute left-2.5 top-4 h-3.5 w-4 border-2 border-white" />
							<div className="absolute left-3.75 top-2 h-1.75 w-2 border-2 border-white" />
						</div>
						<h1 className="text-[28px] font-bold">Jopsphere</h1>
					</div>

					<nav className="hidden items-center gap-8 text-[15px] lg:flex">
						<a href="#" className="font-bold text-neutral-900">
							Find Jobs
						</a>
						<a href="#" className="text-neutral-500">
							My Applications
						</a>
						<a href="#" className="text-neutral-500">
							Salary Explorer
						</a>
						<a href="#" className="text-neutral-500">
							For Employers
						</a>
						<a href="#" className="text-neutral-500">
							Applicants
						</a>
					</nav>

					<div className="hidden items-center gap-6 lg:flex">
						<a href="#" className="text-[15px] text-neutral-900">
							Sign in
						</a>
						<button type="button" className="h-9 rounded bg-[#6D4AFF] px-6 text-sm font-bold text-white">
							Post a Job
						</button>
					</div>
				</div>
			</header>

			<section className="mx-auto w-full max-w-312 px-4 pt-8 lg:px-0">
				<a href="#" className="text-sm font-bold text-neutral-500">
					← Back to jobs
				</a>

				<div className="mt-6 grid gap-8 lg:grid-cols-[1fr_394px]">
					<div className="space-y-7">
						<article className="rounded border border-neutral-200 bg-white p-8">
							<div className="flex flex-wrap items-start gap-6">
								<div className="relative h-17 w-17 rounded bg-[#F0ECFF]">
									<div className="absolute left-5.25 top-4.25 h-8.5 w-6.5 border-[3px] border-[#6D4AFF]" />
									<div className="absolute left-6.5 top-6.5 h-2.75 w-4 border-[2.5px] border-[#6D4AFF]" />
								</div>

								<div className="min-w-0 flex-1">
									<h2 className="text-[34px] font-bold leading-tight">Frontend Engineer (React)</h2>
									<p className="mt-3 text-base">
										<span className="font-bold text-neutral-900">Leapfrog Technology</span>
										<span className="ml-3 text-[#19A15F]">✓ Verified employer</span>
									</p>
									<p className="mt-2 text-[15px] text-neutral-500">📍 Kathmandu, Nepal · Full-time · Mid level</p>

									<div className="mt-5 flex flex-wrap gap-3">
										<span className="rounded bg-[#EAF8F0] px-5 py-2 text-sm font-bold text-[#148A50]">
											NPR 80,000-130,000/mo
										</span>
										<span className="rounded bg-[#F0ECFF] px-5 py-2 text-sm font-bold text-[#6D4AFF]">91% match</span>
										<span className="rounded bg-[#F4F4F5] px-5 py-2 text-sm text-[#444444]">87 applicants</span>
									</div>
								</div>
							</div>

							<p className="mt-7 text-sm text-neutral-500">
								Posted 2 days ago · Employer replies in around 2 days · Application deadline: June 20, 2026
							</p>
						</article>

						<article className="rounded border border-neutral-200 bg-white p-8">
							<h3 className="text-[26px] font-bold">About the role</h3>
							<div className="mt-6 space-y-3 text-[15px] text-neutral-500">
								<p>
									Leapfrog Technology is looking for a Frontend Engineer who can build clean, responsive, and scalable
									web interfaces using React, TypeScript, and modern UI development practices.
								</p>
								<p>
									You will work closely with designers, backend engineers, and product teams to deliver
									production-ready features for real users.
								</p>
							</div>
						</article>

						<article className="rounded border border-neutral-200 bg-white p-8">
							<h3 className="text-[26px] font-bold">Responsibilities</h3>
							<ul className="mt-7 space-y-5">
								{responsibilities.map((item) => (
									<li key={item} className="flex items-start gap-4 text-[15px]">
										<span className="mt-1.5 h-2.5 w-2.5 bg-[#6D4AFF]" />
										<span>{item}</span>
									</li>
								))}
							</ul>
						</article>

						<article className="rounded border border-neutral-200 bg-white p-8">
							<h3 className="text-[26px] font-bold">Requirements</h3>
							<ul className="mt-7 space-y-5">
								{requirements.map((item) => (
									<li key={item} className="flex items-start gap-4 text-[15px]">
										<span className="mt-1.5 h-2.5 w-2.5 bg-[#19A15F]" />
										<span>{item}</span>
									</li>
								))}
							</ul>

							<div className="mt-7 flex flex-wrap items-center gap-3">
								<span className="mr-2 text-sm font-bold">Preferred skills</span>
								{preferredSkills.map((skill) => (
									<span key={skill} className="rounded bg-[#EAF8F0] px-4 py-1.5 text-xs text-[#148A50]">
										{skill}
									</span>
								))}
							</div>
						</article>
					</div>

					<aside className="space-y-7">
						<div className="rounded border border-neutral-200 bg-white p-8">
							<h3 className="text-2xl font-bold">Apply with confidence</h3>
							<p className="mt-3 text-sm text-neutral-500">
								This employer is verified and salary is disclosed.
							</p>

							<button type="button" className="mt-5 h-11.5 w-full rounded bg-[#6D4AFF] text-[15px] font-bold text-white">
								Apply now
							</button>
							<button
								type="button"
								className="mt-3 h-11.5 w-full rounded border border-neutral-300 bg-white text-[15px] font-bold text-neutral-900"
							>
								Save job
							</button>

							<p className="mt-8 text-[13px] font-bold text-neutral-500">JOB TRUST SIGNALS</p>
							<ul className="mt-5 space-y-3 text-[15px]">
								{trustSignals.map((item) => (
									<li key={item}>✓ {item}</li>
								))}
							</ul>
						</div>

						<div className="rounded border border-neutral-200 bg-white p-8">
							<h3 className="text-2xl font-bold">Job overview</h3>
							<div className="mt-7 space-y-5">
								{overviewItems.map((item) => (
									<div key={item.label} className="flex items-center justify-between gap-4 text-sm">
										<span className="text-neutral-500">{item.label}</span>
										<span className="font-bold text-neutral-900">{item.value}</span>
									</div>
								))}
							</div>
						</div>

						<div className="rounded border border-neutral-200 bg-white p-8">
							<h3 className="text-2xl font-bold">About employer</h3>

							<div className="mt-5 flex items-start gap-4">
								<div className="relative h-13.5 w-13.5 rounded bg-[#F0ECFF]">
									<div className="absolute left-4.75 top-3.75 h-7 w-4.25 border-[2.5px] border-[#6D4AFF]" />
								</div>
								<div>
									<p className="text-[17px] font-bold">Daraz Nepal</p>
									<p className="mt-1 text-[13px] text-[#19A15F]">✓ Verified business</p>
								</div>
							</div>

							<div className="mt-7 grid grid-cols-3 rounded border border-neutral-200 bg-[#FAFAFA] p-5 text-center">
								<div>
									<p className="text-[28px] font-bold">96%</p>
									<p className="text-[13px] text-neutral-500">response rate</p>
								</div>
								<div>
									<p className="text-[28px] font-bold">~2d</p>
									<p className="text-[13px] text-neutral-500">avg reply</p>
								</div>
								<div>
									<p className="text-[28px] font-bold">42</p>
									<p className="text-[13px] text-neutral-500">hires</p>
								</div>
							</div>

							<a href="#" className="mt-4 inline-block text-sm font-bold text-[#6D4AFF]">
								View company profile →
							</a>
						</div>
					</aside>
				</div>

				<section className="mt-7 flex flex-wrap items-center justify-between gap-6 rounded bg-[#F0ECFF] px-8 py-6">
					<div>
						<h3 className="text-[22px] font-bold">Salary transparency</h3>
						<p className="mt-2 text-[15px] text-neutral-500">
							Kaam requires salary disclosure before jobs are published. This helps applicants make informed decisions
							before applying.
						</p>
					</div>
					<button type="button" className="h-9.5 rounded bg-[#6D4AFF] px-8 text-sm font-bold text-white">
						Apply now
					</button>
				</section>
			</section>
		</main>
	);
}
