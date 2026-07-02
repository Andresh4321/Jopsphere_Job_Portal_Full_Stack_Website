type ApplicationStatus =
	| "Interview"
	| "Viewed"
	| "Applied"
	| "Shortlisted"
	| "Offer";

type Application = {
	title: string;
	company: string;
	verified: boolean;
	location: string;
	status: ApplicationStatus;
	applied: string;
	updated: string;
	statusTone: "gold" | "violet" | "slate";
	highlighted?: boolean;
	timeline: {
		label: string;
		time: string;
		active?: boolean;
	}[];
};

const navigationItems = [
	{ label: "Find Jobs", href: "#" },
	{ label: "My Applications", href: "/Features/Applications", active: true },
	{ label: "Salary Explorer", href: "#" },
	{ label: "For Employers", href: "#" },
	{ label: "Applicants", href: "#" },
];

const applications: Application[] = [
	{
		title: "Frontend Engineer (React)",
		company: "Leapfrog Technology",
		verified: true,
		location: "Kathmandu",
		status: "Interview",
		applied: "Applied 6d ago",
		updated: "Updated 1d ago",
		statusTone: "gold",
		highlighted: true,
		timeline: [
			{ label: "Applied", time: "6d ago", active: true },
			{ label: "Viewed by employer", time: "5d ago", active: true },
			{ label: "Shortlisted", time: "3d ago", active: true },
			{ label: "Interview scheduled", time: "1d ago", active: true },
			{ label: "Offer", time: "Pending" },
		],
	},
	{
		title: "Product Designer",
		company: "CG App",
		verified: true,
		location: "Lalitpur",
		status: "Viewed",
		applied: "Applied 3d ago",
		updated: "Updated 2d ago",
		statusTone: "violet",
		timeline: [
			{ label: "Applied", time: "3d ago", active: true },
			{ label: "Viewed by employer", time: "2d ago", active: true },
			{ label: "Shortlisted", time: "Pending" },
			{ label: "Interview scheduled", time: "Pending" },
		],
	},
	{
		title: "Content Writer (Remote)",
		company: "Insight Workshop",
		verified: true,
		location: "Remote · Nepal",
		status: "Applied",
		applied: "Applied 1d ago",
		updated: "Updated 1d ago",
		statusTone: "slate",
		timeline: [
			{ label: "Applied", time: "1d ago", active: true },
			{ label: "Viewed by employer", time: "Pending" },
			{ label: "Shortlisted", time: "Pending" },
		],
	},
];

const statusClasses: Record<ApplicationStatus, string> = {
	Interview: "bg-amber-100 text-amber-900",
	Viewed: "bg-violet-100 text-violet-700",
	Applied: "bg-zinc-100 text-zinc-900",
	Shortlisted: "bg-emerald-100 text-emerald-800",
	Offer: "bg-emerald-100 text-emerald-800",
};

function BrandMark() {
	return (
		<div className="flex h-10 w-10 items-center justify-center rounded-sm bg-violet-600 shadow-sm">
			<div className="relative h-4 w-4 text-white">
				<span className="absolute inset-x-0 top-0 mx-auto h-2 w-2 rounded-full border-2 border-current" />
				<span className="absolute inset-x-0 bottom-0 mx-auto h-3 w-4 rounded-sm border-2 border-current" />
			</div>
		</div>
	);
}

function ApplicationCard({ application }: { application: Application }) {
	return (
		<article
			className={[
				"rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
				application.highlighted ? "border-violet-500 ring-1 ring-violet-500" : "border-zinc-200",
			].join(" ")}
		>
			<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
				<div className="space-y-4">
					<div>
						<h2 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
							{application.title}
						</h2>
						<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-600">
							<span className="font-semibold text-zinc-900">{application.company}</span>
							{application.verified ? (
								<span className="inline-flex items-center gap-1 text-emerald-600">
									<span aria-hidden="true">✓</span>
									Verified
								</span>
							) : null}
							<span>📍 {application.location}</span>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
						<span aria-hidden="true">◷</span>
						<span>{application.applied}</span>
						<span aria-hidden="true">·</span>
						<span>{application.updated}</span>
					</div>
				</div>

				<div className="flex items-center gap-3 lg:flex-col lg:items-end">
					<span
						className={[
							"inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold",
							statusClasses[application.status],
						].join(" ")}
					>
						{application.status}
					</span>
					<a href="#timeline" className="text-sm font-semibold text-zinc-900 hover:text-violet-700">
						View timeline ›
					</a>
				</div>
			</div>
		</article>
	);
}

function TimelinePanel() {
	const featured = applications[0];

	return (
		<aside
			id="timeline"
			className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm lg:sticky lg:top-6"
		>
			<div className="space-y-6 p-6">
				<div className="flex items-start justify-between gap-4">
					<span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
						{featured.status}
					</span>
				</div>

				<div>
					<h2 className="text-2xl font-bold tracking-tight text-zinc-900">{featured.title}</h2>
					<p className="mt-2 text-sm text-zinc-500">{featured.company}</p>
				</div>

				<div>
					<p className="text-xs font-semibold tracking-[0.2em] text-zinc-500">STATUS TIMELINE</p>
					<ol className="mt-5 space-y-5">
						{featured.timeline.map((step) => (
							<li key={step.label} className="flex gap-4">
								<span
									className={[
										"mt-1.5 h-3 w-3 shrink-0 rounded-full",
										step.active ? "bg-violet-600" : "bg-zinc-300",
									].join(" ")}
									aria-hidden="true"
								/>
								<div>
									<p className={step.active ? "font-medium text-zinc-900" : "text-zinc-500"}>{step.label}</p>
									<p className="mt-1 text-sm text-zinc-500">{step.time}</p>
								</div>
							</li>
						))}
					</ol>
				</div>
			</div>

			<div className="border-t border-zinc-200 bg-zinc-50 p-6">
				<div className="flex items-center justify-between text-sm">
					<span className="font-semibold text-zinc-900">Fit score: 91%</span>
					<span className="text-zinc-500">96% response rate</span>
				</div>
				<p className="mt-2 text-sm text-zinc-500">Employer typically responds in 2 days</p>

				<div className="mt-6 space-y-3">
					<button className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700">
						View job
					</button>
					<button className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100">
						Message employer
					</button>
				</div>
			</div>
		</aside>
	);
}

export default function ApplicationsPage() {
	return (
		<div className="min-h-screen bg-[linear-gradient(180deg,#fafafa_0%,#f4f4f5_100%)] text-zinc-900">
			<header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-4">
						<BrandMark />
						<span className="text-2xl font-bold tracking-tight text-zinc-900">Kaam</span>
					</div>

					<nav className="hidden items-center gap-8 xl:flex" aria-label="Primary">
						{navigationItems.map((item) => (
							<a
								key={item.label}
								href={item.href}
								className={[
									"text-sm transition hover:text-zinc-900",
									item.active ? "font-semibold text-zinc-900" : "text-zinc-500",
								].join(" ")}
							>
								{item.label}
							</a>
						))}
					</nav>

					<div className="flex items-center gap-4">
						<a href="#" className="hidden text-sm text-zinc-900 hover:text-violet-700 sm:inline">
							Sign in
						</a>
						<a
							href="#"
							className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
						>
							Post a Job
						</a>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">My applications</h1>
						<p className="mt-3 text-sm text-zinc-500 sm:text-base">
							5 applications · Real status updates from verified employers
						</p>
					</div>

					<a
						href="#"
						className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
					>
						Find more jobs
					</a>
				</div>

				<section className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-100 p-1 sm:inline-flex">
					{[
						{ label: "All", active: false },
						{ label: "Active", active: true },
						{ label: "Closed", active: false },
					].map((tab) => (
						<button
							key={tab.label}
							className={[
								"rounded-xl px-5 py-2 text-sm font-semibold transition",
								tab.active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-900",
							].join(" ")}
						>
							{tab.label}
						</button>
					))}
				</section>

				<div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.8fr)_minmax(340px,0.9fr)]">
					<section className="space-y-4">
						{applications.map((application) => (
							<ApplicationCard key={application.title} application={application} />
						))}
					</section>

					<TimelinePanel />
				</div>
			</main>

			<footer className="mt-auto border-t border-zinc-200 bg-white">
				<div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
					<div>
						<p className="text-xl font-bold tracking-tight text-zinc-900">Kaam</p>
						<p className="mt-2 text-sm text-zinc-500">Nepal&apos;s first verified job portal.</p>
					</div>

					<div className="flex flex-wrap items-center gap-5 text-sm text-zinc-500">
						<a href="#" className="hover:text-zinc-900">
							How it works
						</a>
						<a href="#" className="hover:text-zinc-900">
							FAQ
						</a>
						<a href="#" className="hover:text-zinc-900">
							Privacy
						</a>
						<a href="#" className="hover:text-zinc-900">
							Contact
						</a>
					</div>

					<p className="text-sm text-zinc-500">© 2026 Kaam. Made in Nepal.</p>
				</div>
			</footer>
		</div>
	);
}
