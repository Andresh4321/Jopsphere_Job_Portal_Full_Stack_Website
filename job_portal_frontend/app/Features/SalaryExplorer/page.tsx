type SalaryRow = {
	role: string;
	industry: string;
	min: string;
	avg: string;
	max: string;
};

const salaryRows: SalaryRow[] = [
	{
		role: "Frontend Engineer",
		industry: "Tech",
		min: "NPR 50,000",
		avg: "NPR 95,000",
		max: "NPR 160,000",
	},
	{
		role: "Product Designer",
		industry: "Tech",
		min: "NPR 45,000",
		avg: "NPR 85,000",
		max: "NPR 140,000",
	},
	{
		role: "Content Writer",
		industry: "Marketing",
		min: "NPR 25,000",
		avg: "NPR 40,000",
		max: "NPR 65,000",
	},
	{
		role: "Sales Executive",
		industry: "Retail",
		min: "NPR 20,000",
		avg: "NPR 35,000",
		max: "NPR 60,000",
	},
	{
		role: "Data Analyst",
		industry: "Finance",
		min: "NPR 40,000",
		avg: "NPR 70,000",
		max: "NPR 120,000",
	},
	{
		role: "Barista",
		industry: "Hospitality",
		min: "NPR 16,000",
		avg: "NPR 22,000",
		max: "NPR 30,000",
	},
];

function SalaryTable() {
	return (
		<div className="overflow-hidden rounded border border-[#D8D6CE] bg-white">
			<div className="grid grid-cols-[1.6fr_1.2fr_1fr_1fr_1fr] bg-[#F7F6F2] px-8 py-4 text-[11px] font-bold tracking-wide text-[#888888]">
				<span>ROLE</span>
				<span>INDUSTRY</span>
				<span className="text-center">MIN</span>
				<span className="text-center">AVG</span>
				<span className="text-right">MAX</span>
			</div>

			<div className="divide-y divide-[#ECEAE3]">
				{salaryRows.map((row) => (
					<div
						key={row.role}
						className="grid grid-cols-[1.6fr_1.2fr_1fr_1fr_1fr] items-center px-8 py-4 text-sm text-[#1A1A1A]"
					>
						<span className="font-bold">{row.role}</span>
						<span className="text-[#888888]">{row.industry}</span>
						<span className="text-center">{row.min}</span>
						<span className="text-center font-bold text-[#6B5FD6]">{row.avg}</span>
						<span className="text-right">{row.max}</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default function SalaryExplorerPage() {
	return (
		<main className="min-h-screen bg-[#F0EEE6] text-[#1A1A1A]">
			<header className="border-b border-[#C8C6BE] bg-[#F0EEE6]">
				<div className="mx-auto flex h-15 w-full max-w-300 items-center justify-between px-8">
					<div className="flex items-center gap-3">
						<div className="grid h-8 w-8 place-items-center bg-[#6B5FD6] text-lg font-bold text-white">J</div>
						<span className="text-[15px] font-bold">Jopsphere</span>
					</div>

					<nav className="hidden items-center gap-8 text-[13px] lg:flex">
						<a href="#" className="text-[#444444]">
							Find Jobs
						</a>
						<a href="#" className="text-[#444444]">
							My Applications
						</a>
						<a href="#" className="border-b-2 border-[#6B5FD6] pb-2 font-bold text-[#1A1A1A]">
							Salary Explorer
						</a>
						<a href="#" className="text-[#444444]">
							For Employers
						</a>
						<a href="#" className="text-[#444444]">
							Applicants
						</a>
					</nav>

					<div className="hidden items-center gap-4 lg:flex">
						<a href="#" className="text-[13px] text-[#1A1A1A]">
							Sign in
						</a>
						<button type="button" className="h-8.5 bg-[#6B5FD6] px-4 text-[13px] font-bold text-white">
							Post a Job
						</button>
					</div>
				</div>
			</header>

			<section className="mx-auto w-full max-w-300 px-8 py-12">
				<h1 className="text-4xl font-bold">Salary Explorer</h1>
				<p className="mt-3 text-sm text-[#666666]">
					Real salary data from verified Kaam listings across Nepal. Updated quarterly.
				</p>

				<div className="mt-8">
					<SalaryTable />
				</div>

				<div className="mt-7 flex justify-center">
					<button
						type="button"
						className="h-11 rounded border border-[#C8C6BE] bg-white px-6 text-sm font-normal text-[#1A1A1A]"
					>
						Browse jobs paying above average
					</button>
				</div>
			</section>
		</main>
	);
}
