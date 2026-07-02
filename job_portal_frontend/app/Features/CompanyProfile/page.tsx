const summaryStats = [
	{ label: "★ Trust score", value: "4.4 / 5" },
	{ label: "↗ Response rate", value: "82%" },
	{ label: "◷ Avg reply", value: "4.0 days" },
	{ label: "👥 Hires on Kaam", value: "156+" },
];

const glanceItems = [
	{ label: "Industry", value: "Sales" },
	{ label: "Headquarters", value: "Kathmandu" },
	{ label: "Status", value: "✓ Verified", accent: true },
	{ label: "Open roles", value: "1" },
];

const candidateReasons = [
	"Guaranteed response within 5 days",
	"Salary disclosed on every listing",
	"Clear interview process - no surprises",
	"Feedback shared after every interview round",
];

export default function CompanyProfilePage() {
	return (
		<main className="min-h-screen bg-[#FAFAFA] pb-8 text-neutral-900">
			<header className="border-b border-neutral-200 bg-white">
				<div className="mx-auto flex h-18 w-full max-w-312 items-center justify-between px-4 lg:px-0">
					<div className="flex items-center gap-4">
						<div className="relative h-9.5 w-9.5 rounded bg-[#6D4AFF]">
							<div className="absolute left-2.5 top-4 h-3.5 w-4 border-2 border-white" />
							<div className="absolute left-3.75 top-2 h-1.75 w-2 border-2 border-white" />
						</div>
						<h1 className="text-[28px] font-bold">Jopsphere</h1>
					</div>

					<nav className="hidden items-center gap-8 text-[15px] text-neutral-500 lg:flex">
						<a href="#">My Applications</a>
						<a href="#">Salary Explorer</a>
						<a href="#">For Employers</a>
						<a href="#">Applicants</a>
					</nav>

					<button type="button" className="hidden h-9 rounded bg-[#6D4AFF] px-6 text-sm font-bold text-white lg:block">
						Post a Job
					</button>
				</div>
			</header>

			<section className="mx-auto w-full max-w-312 px-4 pt-8 lg:px-0">
				<a href="#" className="text-sm text-neutral-500">
					← All companies
				</a>

				<div className="mt-6 rounded border border-neutral-200 bg-white p-8">
					<div className="flex flex-wrap items-start justify-between gap-5">
						<div className="flex items-start gap-7">
							<div className="relative h-18 w-18 rounded bg-[#F0ECFF]">
								<div className="absolute left-5 top-3.5 h-12 w-8 border-[3px] border-[#6D4AFF]" />
								<div className="absolute left-7.5 top-7 h-6 w-3 border-[2.5px] border-[#6D4AFF]" />
								<div className="absolute left-7 top-12.5 h-3.5 w-4 border-[3px] border-[#6D4AFF]" />
							</div>

							<div>
								<h2 className="text-[34px] font-bold leading-tight">Daraz Nepal</h2>
								<div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
									<span className="text-[#19A15F]">✓ Verified business</span>
									<span className="text-neutral-500">📍 Kathmandu</span>
									<span className="text-neutral-500">💼 Sales</span>
								</div>
							</div>
						</div>

						<button type="button" className="h-9.5 rounded bg-[#6D4AFF] px-6 text-sm font-bold text-white">
							View all jobs
						</button>
					</div>

					<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
						{summaryStats.map((stat) => (
							<div key={stat.label} className="rounded border border-neutral-200 bg-[#FAFAFA] px-5 py-3.5">
								<p className="text-xs text-neutral-500">{stat.label}</p>
								<p className="mt-1 text-base font-bold">{stat.value}</p>
							</div>
						))}
					</div>
				</div>

				<div className="mt-8 grid gap-8 lg:grid-cols-[1fr_319px]">
					<div className="space-y-8">
						<article className="rounded border border-neutral-200 bg-white p-8">
							<h3 className="text-xl font-bold">About Daraz Nepal</h3>
							<div className="mt-5 space-y-2 text-sm text-neutral-500">
								<p>Daraz Nepal is a verified employer on Kaam, headquartered in Kathmandu.</p>
								<p>
									They&apos;ve completed business registration, verified phone number, and have successful hires through
									Kaam - meaning every listing is reviewed before going live.
								</p>
								<p>
									The team primarily hires in Sales and responds to <span className="font-bold text-neutral-900">82%</span>{" "}
									of applicants within 4.0 days on average - well above the Kaam average.
								</p>
							</div>
						</article>

						<article className="rounded border border-neutral-200 bg-white p-8">
							<h3 className="text-xl font-bold">Open roles (1)</h3>

							<div className="mt-6 rounded border border-neutral-200 bg-white p-6">
								<div className="flex flex-wrap items-start justify-between gap-4">
									<div>
										<div className="flex items-center gap-3">
											<p className="text-[17px] font-bold">Sales Executive</p>
											<span className="rounded border border-neutral-300 px-3 py-1 text-[11px] font-bold text-neutral-500">
												PROMOTED
											</span>
										</div>
										<p className="mt-2 text-sm">
											<span className="font-bold">Daraz Nepal</span>
											<span className="ml-3 text-[#19A15F]">✓ Verified</span>
											<span className="ml-3 text-neutral-500">· Kathmandu</span>
										</p>
									</div>

									<span className="rounded bg-[#F0ECFF] px-4 py-2 text-xs font-bold text-[#6D4AFF]">65% match</span>
								</div>

								<div className="mt-5 flex flex-wrap gap-2.5">
									<span className="rounded bg-[#EAF8F0] px-4 py-2 text-xs font-bold text-[#148A50]">
										NPR 25,000-40,000/mo
									</span>
									<span className="rounded bg-[#F4F4F5] px-4 py-2 text-xs text-[#444444]">Full-time</span>
									<span className="rounded bg-[#F4F4F5] px-4 py-2 text-xs text-[#444444]">Entry level</span>
									<span className="rounded bg-[#FDECEC] px-4 py-2 text-xs text-[#D93025]">🔥 High competition</span>
								</div>

								<div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
									<span>◷ Posted 7d ago · Replies in ~4d</span>
									<span>312 applicants</span>
								</div>
							</div>
						</article>

						<article className="rounded border border-neutral-200 bg-white p-8">
							<h3 className="text-xl font-bold">Why candidates choose us</h3>
							<div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
								{candidateReasons.map((reason) => (
									<p key={reason}>✓ {reason}</p>
								))}
							</div>
						</article>
					</div>

					<aside className="space-y-8">
						<article className="rounded border border-neutral-200 bg-white p-7">
							<p className="text-xs font-bold text-neutral-500">COMPANY AT A GLANCE</p>
							<div className="mt-6 space-y-5 text-sm">
								{glanceItems.map((item) => (
									<div key={item.label} className="flex items-center justify-between gap-4">
										<span className="text-neutral-500">{item.label}</span>
										<span className={item.accent ? "font-bold text-[#19A15F]" : "font-bold text-neutral-900"}>{item.value}</span>
									</div>
								))}
							</div>
						</article>

						<article className="rounded border border-neutral-200 bg-white p-7">
							<p className="text-[15px] font-bold">🌐 Hiring on Kaam since 2024</p>
							<p className="mt-4 text-sm text-neutral-500">156+ candidates hired through</p>
							<p className="text-sm text-neutral-500">Kaam with 82% response rate.</p>
						</article>
					</aside>
				</div>
			</section>

			<footer className="mt-8 h-8.75 bg-white" />
		</main>
	);
}
