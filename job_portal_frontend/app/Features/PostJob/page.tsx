type FieldProps = {
	label: string;
	required?: boolean;
	placeholder?: string;
	isSelect?: boolean;
	defaultValue?: string;
};

function Field({ label, required, placeholder, isSelect, defaultValue }: FieldProps) {
	return (
		<label className="block">
			<p className="text-sm font-bold text-neutral-900">
				{label}
				{required && <span className="ml-1 text-[#D93025]">*</span>}
			</p>
			<div className="mt-2 flex h-10.5 items-center justify-between rounded border border-neutral-300 bg-white px-4 text-sm text-neutral-400">
				<span className={defaultValue ? "text-neutral-900" : "text-neutral-400"}>{defaultValue ?? placeholder}</span>
				{isSelect && <span className="text-xs text-neutral-500">▼</span>}
			</div>
		</label>
	);
}

function TextAreaField({
	label,
	required,
	placeholder,
	rowsClass,
}: {
	label: string;
	required?: boolean;
	placeholder?: string;
	rowsClass: string;
}) {
	return (
		<label className="block">
			<p className="text-sm font-bold text-neutral-900">
				{label}
				{required && <span className="ml-1 text-[#D93025]">*</span>}
			</p>
			<div className={`mt-2 rounded border border-neutral-300 bg-white p-4 text-sm text-neutral-400 ${rowsClass}`}>
				{placeholder}
			</div>
		</label>
	);
}

export default function PostJobPage() {
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

					<nav className="hidden items-center gap-8 text-[15px] lg:flex">
						<a href="#" className="text-neutral-500">
							Find Jobs
						</a>
						<a href="#" className="text-neutral-500">
							My Applications
						</a>
						<a href="#" className="text-neutral-500">
							Salary Explorer
						</a>
						<a href="#" className="font-bold text-neutral-900">
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

			<section className="mx-auto w-full max-w-312 px-4 py-9 lg:px-0">
				<h2 className="text-[42px] font-bold leading-tight">Post a Job</h2>
				<p className="mt-3 text-base text-neutral-500">
					Verified employers get priority placement. Salary disclosure is required to publish.
				</p>

				<div className="mt-7 rounded border border-neutral-200 bg-white px-8 py-6">
					<div className="flex items-center justify-between text-[15px]">
						<span className="font-bold text-neutral-900">Listing completeness</span>
						<span className="text-neutral-500">0%</span>
					</div>
					<div className="mt-5 h-2 rounded bg-[#E9E4FF]" />
				</div>

				<div className="mt-7 rounded border border-neutral-200 bg-white px-8 py-6">
					<h3 className="text-2xl font-bold">Role basics</h3>
					<div className="mt-6 grid gap-5 md:grid-cols-2">
						<Field label="Job title" required placeholder="e.g. Frontend Engineer" />
						<Field label="Department" required placeholder="e.g. Engineering" />
						<Field label="Work type" required placeholder="Select" isSelect />
						<Field label="Location" required placeholder="e.g. Kathmandu" />
						<Field label="Hours per week" defaultValue="40" />
						<Field label="Application deadline" required placeholder="mm/dd/yyyy" />
					</div>
				</div>

				<div className="mt-6 rounded border border-neutral-200 bg-white px-8 py-6">
					<h3 className="text-2xl font-bold">
						Salary <span className="text-[#D93025]">*</span>
					</h3>
					<p className="mt-4 text-[15px] text-neutral-500">
						Nepal market average for similar roles: <span className="font-bold text-neutral-900">NPR 35,000 - 55,000/mo</span>
					</p>

					<div className="mt-6 grid gap-5 md:grid-cols-2">
						<Field label="Min (NPR / month)" required placeholder="35000" />
						<Field label="Max (NPR / month)" required placeholder="55000" />
					</div>

					<div className="mt-4 rounded bg-[#FFF4D8] px-4 py-2.5 text-sm text-[#8A5A00]">
						⚠ Listings without salary cannot be published on Kaam.
					</div>
				</div>

				<div className="mt-6 rounded border border-neutral-200 bg-white px-8 py-6">
					<h3 className="text-2xl font-bold">Description</h3>
					<div className="mt-6 space-y-5">
						<TextAreaField label="About the role" required rowsClass="h-[92px]" />
						<TextAreaField label="Responsibilities" required placeholder="One per line" rowsClass="h-[78px]" />
						<TextAreaField label="Requirements" required placeholder="One per line" rowsClass="h-[78px]" />
					</div>
				</div>

				<div className="mt-6 rounded border border-neutral-200 bg-white px-8 py-6">
					<h3 className="text-2xl font-bold">Listing type</h3>
					<div className="mt-6 grid gap-5 md:grid-cols-2">
						<button
							type="button"
							  className="h-17.5 rounded border border-[#6D4AFF] bg-[#F0ECFF] px-6 text-left"
						>
							<p className="text-base font-bold text-neutral-900">Standard</p>
							<p className="mt-1 text-sm text-neutral-500">Online applications via Kaam.</p>
						</button>
						<button
							type="button"
							  className="h-17.5 rounded border border-neutral-300 bg-white px-6 text-left"
						>
							<p className="text-base font-bold text-neutral-900">Walk-in Hiring</p>
							<p className="mt-1 text-sm text-neutral-500">On-site interviews. Adds address & time slots.</p>
						</button>
					</div>
				</div>

				<div className="mt-5 flex flex-wrap items-center justify-between gap-4 pb-6">
					<p className="text-sm text-neutral-500">Complete all required fields to enable publish.</p>
					<div className="flex items-center gap-3">
						<button type="button" className="h-10 rounded border border-neutral-300 bg-white px-6 text-sm font-bold text-neutral-900">
							Preview
						</button>
						<button type="button" className="h-10 rounded bg-[#6D4AFF] px-6 text-sm font-bold text-white opacity-55">
							Publish job
						</button>
					</div>
				</div>
			</section>
		</main>
	);
}
