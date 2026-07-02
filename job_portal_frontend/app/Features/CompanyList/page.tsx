type Company = {
	name: string;
	location: string;
	openRoles: string;
	response: string;
};

const companies: Company[] = [
	{ name: "Leapfrog Technology", location: "Kathmandu", openRoles: "1 open role", response: "96% response" },
	{ name: "CG App", location: "Lalitpur", openRoles: "1 open role", response: "89% response" },
	{ name: "Insight Workshop", location: "Remote · Nepal", openRoles: "1 open role", response: "98% response" },
	{ name: "Daraz Nepal", location: "Kathmandu", openRoles: "1 open role", response: "82% response" },
	{ name: "Himalayan Java", location: "Pulchowk, Lalitpur", openRoles: "1 open role", response: "91% response" },
	{ name: "Fonepay", location: "Kathmandu", openRoles: "1 open role", response: "71% response" },
];

function CompanyCard({ company }: { company: Company }) {
	return (
		<article className="rounded border border-neutral-200 bg-white p-7">
			<div className="flex items-start gap-5">
				<div className="relative h-13.5 w-13.5 rounded bg-[#F0ECFF]">
					<div className="absolute left-4.75 top-3.5 h-7.5 w-4.25 border-[2.5px] border-[#6D4AFF]" />
					<div className="absolute left-6 top-5.5 h-2 w-2.25 border-2 border-[#6D4AFF]" />
				</div>
				<div className="min-w-0 flex-1">
					<h3 className="truncate text-[19px] font-bold text-neutral-900">{company.name}</h3>
					<p className="mt-2 flex flex-wrap items-center gap-3 text-[13px]">
						<span className="text-[#19A15F]">✓ Verified</span>
						<span className="text-neutral-500">📍 {company.location}</span>
					</p>
				</div>
			</div>

			<div className="mt-6 flex items-center justify-between text-sm">
				<span className="text-neutral-500">{company.openRoles}</span>
				<span className="font-bold text-neutral-900">{company.response}</span>
			</div>
		</article>
	);
}

export default function CompanyListPage() {
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

					<nav className="hidden items-center gap-8 text-[15px] text-neutral-500 lg:flex">
						<a href="#">Find Jobs</a>
						<a href="#">My Applications</a>
						<a href="#">Salary Explorer</a>
						<a href="#">For Employers</a>
						<a href="#">Applicants</a>
						<a href="#" className="text-neutral-900">
							Sign in
						</a>
					</nav>

					<button type="button" className="hidden h-9 rounded bg-[#6D4AFF] px-6 text-sm font-bold text-white lg:block">
						Post a Job
					</button>
				</div>
			</header>

			<section className="mx-auto w-full max-w-312 px-4 py-9 lg:px-0">
				<h2 className="text-[40px] font-bold leading-tight">Companies on Jobsphere</h2>
				<p className="mt-3 text-base text-neutral-500">6 verified employers actively hiring</p>

				<div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
					{companies.map((company) => (
						<CompanyCard key={company.name} company={company} />
					))}
				</div>

				<div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded bg-[#F0ECFF] px-10 py-7">
					<div>
						<h3 className="text-[28px] font-bold">Want to hire on Jopsphere?</h3>
						<p className="mt-3 text-base text-neutral-500">
							Post verified job listings, disclose salary, and reach active candidates across Nepal.
						</p>
					</div>
					<button type="button" className="h-11 rounded bg-[#6D4AFF] px-8 text-[15px] font-bold text-white">
						Post a Job
					</button>
				</div>
			</section>

			<footer className="mt-10 bg-white">
				<div className="mx-auto flex w-full max-w-312 flex-wrap items-center justify-between gap-5 px-4 py-10 text-sm lg:px-0">
					<div>
						<p className="text-[22px] font-bold text-neutral-900">Kaam</p>
						<p className="mt-2 text-neutral-500">Nepal&apos;s first verified job portal.</p>
					</div>

					<div className="flex items-center gap-6 text-neutral-500">
						<a href="#">How it works</a>
						<a href="#">FAQ</a>
						<a href="#">Privacy</a>
						<a href="#">Contact</a>
					</div>

					<p className="text-neutral-500">© 2026 Kaam. Made in Nepal.</p>
				</div>
			</footer>
		</main>
	);
}
