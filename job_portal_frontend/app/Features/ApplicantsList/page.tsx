type Applicant = {
	initials: string;
	name: string;
	headline: string;
	verified?: boolean;
	fit: string;
	stage: string;
	meta: string;
	skills: { label: string; matched: boolean }[];
	highlighted?: boolean;
	avatarTone?: "purple" | "green" | "orange";
};

const tabs = ["All 18", "New 7", "Reviewed 3", "Shortlisted 5", "Interview 3", "Offer 1", "Hired 2", "Rejected 4"];

const applicants: Applicant[] = [
	{
		initials: "SR",
		name: "Sita Rai",
		headline: "Senior Frontend Developer · 5 yrs React",
		verified: true,
		fit: "94% fit",
		stage: "Shortlisted",
		meta: "Kathmandu · 5 yrs · Expects NPR 95,000/mo · Available now · Applied today",
		skills: [
			{ label: "React", matched: true },
			{ label: "TypeScript", matched: true },
			{ label: "TailwindCSS", matched: true },
			{ label: "GraphQL", matched: false },
		],
		highlighted: true,
		avatarTone: "purple",
	},
	{
		initials: "RT",
		name: "Rohan Thapa",
		headline: "Frontend Engineer · Next.js specialist",
		verified: true,
		fit: "88% fit",
		stage: "Interview",
		meta: "Lalitpur · 3 yrs · Expects NPR 80,000/mo · 15d notice · Applied 2d ago",
		skills: [
			{ label: "React", matched: true },
			{ label: "Next.js", matched: true },
			{ label: "TypeScript", matched: true },
			{ label: "AWS", matched: false },
		],
		avatarTone: "green",
	},
	{
		initials: "PS",
		name: "Priya Shrestha",
		headline: "UI Engineer · Vue & React",
		fit: "81% fit",
		stage: "New",
		meta: "Bhaktapur · 2 yrs · Expects NPR 60,000/mo · 30d notice · Applied 5d ago",
		skills: [
			{ label: "React", matched: true },
			{ label: "Vue", matched: true },
			{ label: "TypeScript", matched: false },
			{ label: "AWS", matched: false },
		],
		avatarTone: "orange",
	},
];

const sideStats = [
	{ label: "Fit score", value: "94%" },
	{ label: "Experience", value: "5 yrs" },
	{ label: "Expects", value: "NPR 95k" },
	{ label: "Notice", value: "Now" },
];

function toneClasses(tone?: Applicant["avatarTone"]) {
	if (tone === "green") return "bg-[#E1F5EE] text-[#0F6E56]";
	if (tone === "orange") return "bg-[#FAECE7] text-[#993C1D]";
	return "bg-[#EDE9FB] text-[#6B5FD6]";
}

function stageClasses(stage: string) {
	if (stage === "Shortlisted") return "bg-[#E8F5EC] text-[#22913A]";
	if (stage === "Interview") return "bg-[#EDE9FB] text-[#534AB7]";
	return "bg-[#F7F6F2] text-[#888888]";
}

function ApplicantRow({ applicant }: { applicant: Applicant }) {
	return (
		<article
			className={`rounded border bg-white p-5 ${
				applicant.highlighted ? "border-2 border-[#6B5FD6]" : "border-[#E2E0D8]"
			}`}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-start gap-3">
					<button type="button" className={`mt-1 h-3.5 w-3.5 border ${applicant.highlighted ? "bg-[#6B5FD6] border-[#6B5FD6]" : "border-[#D8D6CE]"}`} />
					<div className={`grid h-11 w-11 place-items-center text-[13px] font-bold ${toneClasses(applicant.avatarTone)}`}>
						{applicant.initials}
					</div>
					<div>
						<p className="text-sm font-bold text-[#1A1A1A]">
							{applicant.name} {applicant.verified && <span className="ml-1 text-[11px] font-normal text-[#22913A]">✔</span>}
						</p>
						<p className="text-xs text-[#666666]">{applicant.headline}</p>
					</div>
				</div>

				<div className="flex gap-2">
					<span className="rounded border border-[#E2E0D8] bg-[#F7F6F2] px-3 py-1 text-[11px] text-[#444444]">✦ {applicant.fit}</span>
					<span className={`rounded px-3 py-1 text-[11px] ${stageClasses(applicant.stage)}`}>{applicant.stage}</span>
				</div>
			</div>

			<p className="mt-3 text-[11px] text-[#888888]">📍 {applicant.meta}</p>

			<div className="mt-3 flex flex-wrap gap-2">
				{applicant.skills.map((skill) => (
					<span
						key={skill.label}
						className={`px-2 py-1 text-[10px] ${skill.matched ? "bg-[#E8F5EC] text-[#22913A]" : "bg-[#F1EFE8] text-[#888888]"}`}
					>
						{skill.matched ? "✔" : "✗"} {skill.label}
					</span>
				))}
			</div>

			<div className="mt-4 flex flex-wrap items-center justify-between gap-2">
				<button type="button" className="text-[11px] text-[#888888]">☆ Star</button>
				<div className="flex flex-wrap gap-2">
					<button type="button" className="h-7 rounded border border-[#D8D6CE] bg-white px-4 text-[11px] text-[#333333]">Reject</button>
					<button type="button" className="h-7 rounded border border-[#D8D6CE] bg-white px-4 text-[11px] text-[#333333]">Shortlist</button>
					<button type="button" className="h-7 rounded bg-[#6B5FD6] px-4 text-[11px] font-bold text-white">Invite to interview ›</button>
				</div>
			</div>
		</article>
	);
}

export default function ApplicantsListPage() {
	return (
		<main className="min-h-screen bg-[#F0EEE6] pb-6 text-[#1A1A1A]">
			<header className="border-b border-[#C8C6BE]">
				<div className="mx-auto flex h-[60px] w-full max-w-[1400px] items-center justify-between px-8">
					<div className="flex items-center gap-3">
						<div className="grid h-8 w-8 place-items-center bg-[#6B5FD6] text-[17px] font-bold text-white">K</div>
						<h1 className="text-[28px] font-bold">Jopsphere</h1>
					</div>

					<nav className="hidden items-center gap-8 text-[13px] text-[#555555] lg:flex">
						<a href="#">Find Jobs</a>
						<a href="#">My Applications</a>
						<a href="#">Salary Explorer</a>
						<a href="#">For Employers</a>
						<a href="#" className="border-b-2 border-[#6B5FD6] pb-4 font-bold text-[#1A1A1A]">Applicants</a>
					</nav>

					<div className="hidden items-center gap-4 lg:flex">
						<a href="#" className="text-[13px]">Sign in</a>
						<button type="button" className="h-8 rounded bg-[#6B5FD6] px-4 text-[13px] font-bold text-white">Post a Job</button>
					</div>
				</div>
			</header>

			<section className="mx-auto w-full max-w-[1400px] px-8 pt-6">
				<p className="text-[11px] font-bold text-[#888888]">EMPLOYER DASHBOARD</p>
				<div className="mt-1 flex flex-wrap items-center justify-between gap-4">
					<div>
						<h2 className="text-[28px] font-bold">Applicants</h2>
						<p className="mt-2 text-[13px] text-[#666666]">
							Review, shortlist and hire - every applicant is identity-verified, no fake profiles.
						</p>
					</div>

					<div className="flex flex-wrap gap-3">
						<button type="button" className="h-9 min-w-[280px] rounded border border-[#D8D6CE] bg-white px-5 text-left text-[13px] text-[#333333]">
							Frontend Engineer <span className="float-right text-[11px] text-[#AAAAAA]">▾</span>
						</button>
						<button type="button" className="h-9 rounded border border-[#D8D6CE] bg-white px-5 text-[13px] text-[#333333]">View a job</button>
					</div>
				</div>

				<div className="mt-6 rounded border border-[#E2E0D8] bg-white px-5 py-3 text-[12px]">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div className="flex flex-wrap items-center gap-4">
							<span className="text-[13px] font-bold">Frontend Engineer</span>
							<span className="text-[#22913A]">✔ Verified employer</span>
							<span className="text-[#888888]">📍 Kathmandu</span>
							<span className="text-[#888888]">Salary disclosed: NPR 60,000-120,000</span>
						</div>
						<span className="text-[#888888]">18 total · 5 shortlisted · 3 in interview</span>
					</div>
				</div>

				<div className="mt-4 flex flex-wrap gap-2">
					{tabs.map((tab, index) => (
						<button
							key={tab}
							type="button"
							className={`h-7 rounded px-3 text-[12px] ${
								index === 0 ? "bg-[#6B5FD6] font-bold text-white" : "border border-[#E2E0D8] bg-white text-[#555555]"
							}`}
						>
							{tab}
						</button>
					))}
				</div>

				<div className="mt-4 grid gap-4 lg:grid-cols-[820px_1fr] xl:grid-cols-[820px_492px]">
					<div>
						<div className="mb-4 flex flex-wrap gap-2">
							<button type="button" className="h-9 min-w-[320px] rounded border border-[#D8D6CE] bg-white px-5 text-left text-[12px] text-[#AAAAAA]">
								🔍 Search by name, skill or headline
							</button>
							<button type="button" className="h-9 min-w-[190px] rounded border border-[#D8D6CE] bg-white px-4 text-left text-[12px] text-[#555555]">
								⇅ Best fit <span className="float-right text-[11px] text-[#AAAAAA]">▾</span>
							</button>
							<button type="button" className="h-9 rounded border border-[#D8D6CE] bg-white px-4 text-[12px] text-[#555555]">✔ Verified only</button>
							<button type="button" className="h-9 rounded border border-[#D8D6CE] bg-white px-4 text-[12px] text-[#555555]">⚙ More filters</button>
						</div>

						<div className="space-y-3">
							{applicants.map((applicant) => (
								<ApplicantRow key={applicant.name} applicant={applicant} />
							))}
						</div>
					</div>

					<aside className="rounded border border-[#E2E0D8] bg-white p-4">
						<div className="flex items-start justify-between gap-4">
							<div className="flex items-start gap-3">
								<div className="grid h-14 w-14 place-items-center bg-[#EDE9FB] text-base font-bold text-[#6B5FD6]">SR</div>
								<div>
									<h3 className="text-lg font-bold">Sita Rai</h3>
									<p className="text-xs text-[#888888]">Senior Frontend Developer · 5 yrs React</p>
								</div>
							</div>
							<span className="rounded bg-[#E8F5EC] px-3 py-1 text-[11px] text-[#22913A]">Shortlisted</span>
						</div>

						<div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-4">
							{sideStats.map((stat) => (
								<div key={stat.label} className="border border-[#E2E0D8] bg-[#F7F6F2] px-3 py-2 text-center">
									<p className="text-[10px] text-[#888888]">{stat.label}</p>
									<p className="mt-1 text-base font-bold">{stat.value}</p>
								</div>
							))}
						</div>

						<div className="mt-4">
							<p className="text-[10px] font-bold text-[#888888]">VERIFICATIONS</p>
							<div className="mt-2 space-y-1 text-[12px]">
								<p className="text-[#22913A]">📱 Phone verified ✔</p>
								<p className="text-[#22913A]">🪪 Government ID verified ✔</p>
								<p className="text-[#888888]">🎓 Education verified ✗</p>
							</div>
						</div>

						<div className="mt-4">
							<p className="text-[10px] font-bold text-[#888888]">COVER NOTE</p>
							<p className="mt-2 bg-[#F7F6F2] p-3 text-[11px] text-[#666666]">
								"I&apos;ve been building production React apps for 5 years and would love to bring that experience to
								your team. Excited about the role!"
							</p>
						</div>

						<div className="mt-4">
							<p className="text-[10px] font-bold text-[#888888]">SKILLS MATCH</p>
							<div className="mt-2 flex flex-wrap gap-2 text-[10px]">
								<span className="bg-[#E8F5EC] px-2 py-1 text-[#22913A]">✔ React</span>
								<span className="bg-[#E8F5EC] px-2 py-1 text-[#22913A]">✔ TypeScript</span>
								<span className="bg-[#E8F5EC] px-2 py-1 text-[#22913A]">✔ Tailwind</span>
								<span className="text-[#888888]">✗ GraphQL</span>
							</div>
						</div>

						<button type="button" className="mt-4 h-9 w-full rounded bg-[#6B5FD6] text-[13px] font-bold text-white">✍ Select & make offer</button>

						<div className="mt-2 grid grid-cols-2 gap-2">
							<button type="button" className="h-8 rounded border border-[#D8D6CE] bg-white text-[12px] text-[#333333]">Shortlist</button>
							<button type="button" className="h-8 rounded border border-[#D8D6CE] bg-white text-[12px] text-[#333333]">Interview</button>
							<button type="button" className="h-8 rounded border border-[#D8D6CE] bg-white text-[12px] text-[#333333]">💬 Message</button>
							<button type="button" className="h-8 rounded border border-[#D8D6CE] bg-white text-[12px] text-[#333333]">⬇ Resume</button>
						</div>

						<button type="button" className="mt-2 w-full text-[12px] text-[#CC3333]">Reject with reason</button>
					</aside>
				</div>

				<div className="mt-6 max-w-[492px] rounded border border-[#E2E0D8] bg-white p-4 text-[11px] text-[#666666] lg:ml-auto">
					<p>⚠ Respond within 5 days to keep your "No-ghosting" badge.</p>
					<p>Auto-reminder set for tomorrow.</p>
				</div>
			</section>
		</main>
	);
}
