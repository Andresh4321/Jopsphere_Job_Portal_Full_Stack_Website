type Job = {
	title: string;
	company: string;
	location: string;
	verified: boolean;
	match: string;
	salary: string;
	tags: string[];
	posted: string;
	applicants: string;
	promoted?: boolean;
	highlighted?: boolean;
	competition?: string;
};

const jobs: Job[] = [
	{
		title: "Frontend Engineer (React)",
		company: "Daraz Nepal",
		location: "Kathmandu",
		verified: true,
		match: "91%",
		salary: "NPR 80,000-130,000/mo",
		tags: ["Full-time", "Mid level"],
		posted: "Posted 2d ago · Replies in ~2d",
		applicants: "87 applicants",
		highlighted: true,
	},
	{
		title: "Content Writer (Remote)",
		company: "Insight Workshop",
		location: "Remote · Nepal",
		verified: true,
		match: "84%",
		salary: "NPR 30,000-45,000/mo",
		tags: ["Remote", "Entry level"],
		posted: "Posted 1d ago · Replies in ~1d",
		applicants: "211 applicants",
		competition: "High competition",
	},
	{
		title: "Product Designer",
		company: "CG App",
		location: "Lalitpur",
		verified: true,
		match: "78%",
		salary: "NPR 70,000-110,000/mo",
		tags: ["Full-time", "Mid level"],
		posted: "Posted 5d ago · Replies in ~3d",
		applicants: "134 applicants",
	},
	{
		title: "Barista (Walk-in Hiring)",
		company: "Himalayan Java",
		location: "Pulchowk, Lalitpur",
		verified: true,
		match: "72%",
		salary: "NPR 18,000-24,000/mo",
		tags: ["Walk-in", "Entry level"],
		posted: "Posted 3d ago · Replies in ~1d",
		applicants: "42 applicants",
	},
	{
		title: "Sales Executive",
		company: "Daraz Nepal",
		location: "Kathmandu",
		verified: true,
		match: "65%",
		salary: "NPR 25,000-40,000/mo",
		tags: ["Full-time", "Entry level"],
		posted: "Posted 4d ago · Replies in ~2d",
		applicants: "96 applicants",
		promoted: true,
	},
];

function FilterChip({ label }: { label: string }) {
	return (
		<button
			type="button"
			className="h-10 min-w-32.5 rounded-md border border-neutral-300 bg-white px-5 text-sm text-neutral-900"
		>
			<span className="inline-flex items-center gap-2">
				{label}
				<span aria-hidden="true" className="text-xs text-neutral-500">
					▼
				</span>
			</span>
		</button>
	);
}

function Toggle({ label, enabled }: { label: string; enabled?: boolean }) {
	return (
		<button type="button" className="inline-flex items-center gap-3 text-sm text-neutral-900">
			<span
				className={`relative inline-flex h-5.5 w-9.5 items-center rounded-full ${
					enabled ? "bg-[#6D4AFF]" : "bg-[#DADADA]"
				}`}
			>
				<span
					className={`h-4 w-4 rounded-full bg-white transition ${enabled ? "translate-x-4.5" : "translate-x-0.75"}`}
				/>
			</span>
			{label}
		</button>
	);
}

function JobCard({ job }: { job: Job }) {
	return (
		<article
			className={`rounded-md border bg-white p-7 ${job.highlighted ? "border-[#BCAEFF] border-[1.5px]" : "border-neutral-200"}`}
		>
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<div className="flex flex-wrap items-center gap-3">
						<h2 className="text-[20px] font-bold text-neutral-900">{job.title}</h2>
						{job.promoted && (
							<span className="rounded border border-neutral-300 px-3 py-1 text-[11px] font-bold text-neutral-500">
								PROMOTED
							</span>
						)}
					</div>
					<p className="mt-2 text-[15px]">
						<span className="font-bold text-neutral-900">{job.company}</span>
						{job.verified && <span className="ml-3 text-[#19A15F]">✓ Verified</span>}
						<span className="ml-3 text-neutral-500">· {job.location}</span>
					</p>
				</div>
				<span className="rounded bg-[#F0ECFF] px-4 py-2 text-[13px] font-bold text-[#6D4AFF]">
					✓ {job.match} match
				</span>
			</div>

			<div className="mt-6 flex flex-wrap gap-3">
				<span className="rounded bg-[#EAF8F0] px-4 py-2 text-[13px] font-bold text-[#148A50]">{job.salary}</span>
				{job.tags.map((tag) => (
					<span key={tag} className="rounded bg-[#F4F4F5] px-4 py-2 text-[13px] text-[#444444]">
						{tag}
					</span>
				))}
				{job.competition && (
					<span className="rounded bg-[#FDECEC] px-4 py-2 text-[13px] text-[#D93025]">🔥 {job.competition}</span>
				)}
			</div>

			<div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[13px] text-neutral-500">
				<span>◷ {job.posted}</span>
				<span>{job.applicants}</span>
			</div>
		</article>
	);
}

export default function FindJobsPage() {
	return (
		<main className="min-h-screen bg-[#FAFAFA] text-neutral-900">
			<header className="border-b border-neutral-200 bg-white">
				<div className="mx-auto flex h-18 w-full max-w-312 items-center justify-between px-4 lg:px-0">
					<div className="flex items-center gap-4">
						<div className="relative h-9.5 w-9.5 rounded bg-[#6D4AFF]">
							<div className="absolute left-2.5 top-4 h-3.5 w-4 border-2 border-white" />
							<div className="absolute left-3.75 top-2 h-1.75 w-2 border-2 border-white" />
						</div>
						<h1 className="text-[28px] font-bold">Jopsphere</h1>
					</div>

					<nav className="hidden items-center gap-10 text-[15px] lg:flex">
						<a href="#" className="font-bold text-neutral-900">
							Find Jobs
						</a>
						<a href="#" className="text-neutral-500">
							My Applications
						</a>
						<a href="#" className="text-neutral-500">
							Salary Explorer
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

			<section className="border-b border-neutral-200 bg-white/90">
				<div className="mx-auto flex w-full max-w-312 flex-wrap items-center gap-5 px-4 py-5 lg:px-0">
					<div>
						<p className="text-[13px] text-neutral-500">Min salary: NPR 0/mo</p>
						<div className="mt-2 relative h-6 w-65">
							<div className="absolute top-2.5 h-1.5 w-full rounded bg-[#E9E4FF]" />
							<div className="absolute left-0 top-1 h-4.5 w-4.5 rounded-full border border-[#6D4AFF] bg-white" />
						</div>
					</div>

					<FilterChip label="All" />
					<FilterChip label="All" />
					<FilterChip label="Best match" />
					<Toggle label="Verified only" enabled />
					<Toggle label="Hide promoted" />
				</div>
			</section>

			<section className="mx-auto w-full max-w-312 px-4 py-9 lg:px-0">
				<h2 className="text-4xl font-bold">Jobs in Nepal</h2>
				<p className="mt-3 text-[15px] text-neutral-500">Showing 5 of 6 jobs · Verified employers shown first</p>

				<div className="mt-9 space-y-5">
					{jobs.map((job) => (
						<JobCard key={job.title} job={job} />
					))}
				</div>

				<aside className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded bg-[#F3F0FF] px-8 py-8">
					<div>
						<h3 className="text-2xl font-bold">Find verified jobs faster</h3>
						<p className="mt-3 text-[15px] text-neutral-500">
							Browse trusted employers, compare salary ranges, and apply to jobs with quick response times.
						</p>
					</div>
					<button type="button" className="h-11 rounded bg-[#6D4AFF] px-10 text-[15px] font-bold text-white">
						Apply Now
					</button>
				</aside>
			</section>
		</main>
	);
}
