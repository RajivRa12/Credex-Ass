import Link from "next/link";
import { getCatalogCopy } from "../lib/pricing";

const features = [
	{
		title: "Honest savings logic",
		copy: "Built around deterministic rules so every recommendation is explainable and easy to challenge.",
	},
	{
		title: "Shareable results",
		copy: "Each audit can be copied into a public link that looks good enough for founders, clients, and teammates.",
	},
	{
		title: "Pricing grounded in source notes",
		copy: "The pricing layer is structured, sourced, and ready to be swapped for live APIs when needed.",
	},
];

export default function Home() {
	const catalog = getCatalogCopy().slice(0, 4);

	return (
		<div className="relative overflow-hidden px-5 py-10 sm:px-8 sm:py-14">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12">
				<section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
					<div className="space-y-6">
						<span className="pill">Startup-style audit experience</span>
						<div className="space-y-5">
							<h1 className="section-title max-w-4xl font-semibold text-white">
								SpendScope AI helps teams audit their tool stack without guessing.
							</h1>
							<p className="max-w-2xl text-lg leading-8 text-[#9fb1c8]">
								Review AI and productivity spend, catch overlap, trim waste, and share a polished result page that feels credible in a real review.
							</p>
						</div>

						<div className="flex flex-wrap gap-3">
							<Link
								href="/audit"
								className="focus-ring rounded-full bg-[#7bf0c7] px-5 py-3 text-sm font-semibold text-[#07201a] transition hover:bg-[#94f4d2]"
							>
								Run an audit
							</Link>
							<Link
								href="/audit"
								className="focus-ring rounded-full border border-white/12 bg-white/5 px-5 py-3 text-sm font-medium text-[#dce8f5] transition hover:border-white/18 hover:bg-white/10"
							>
								View audit flow
							</Link>
						</div>

						<div className="grid gap-3 sm:grid-cols-3">
							{[
								["Rule-based", "Savings are reproducible and easy to explain."],
								["Shareable", "Copy a public result URL in one click."],
								["Polished", "Built to feel strong on desktop and mobile."],
							].map(([title, copy]) => (
								<div key={title} className="glass-panel rounded-[22px] p-4">
									<p className="text-sm font-semibold text-white">{title}</p>
									<p className="mt-2 text-sm leading-6 text-[#9fb1c8]">{copy}</p>
								</div>
							))}
						</div>
					</div>

					<div className="glass-panel-strong gradient-border rounded-[32px] p-6 sm:p-7">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-sm uppercase tracking-[0.18em] text-[#9fb1c8]">Product snapshot</p>
								<h2 className="mt-2 text-2xl font-semibold text-white">Built for clarity, not theatrics</h2>
							</div>
							<span className="rounded-full border border-[#7bf0c7]/18 bg-[#7bf0c7]/10 px-3 py-1 text-xs font-medium text-[#dffdf4]">
								Ready to audit
							</span>
						</div>

						<div className="mt-6 space-y-4">
							{features.map((feature) => (
								<article key={feature.title} className="rounded-[22px] border border-white/8 bg-white/4 p-4">
									<h3 className="text-lg font-semibold text-white">{feature.title}</h3>
									<p className="mt-2 text-sm leading-6 text-[#9fb1c8]">{feature.copy}</p>
								</article>
							))}
						</div>

						<div className="mt-6 grid gap-3 sm:grid-cols-2">
							{catalog.map((tool) => (
								<div key={tool.value} className="rounded-[20px] border border-white/8 bg-white/4 p-4">
									<p className="text-sm font-semibold text-white">{tool.label}</p>
									<p className="mt-1 text-sm text-[#9fb1c8]">{tool.helper}</p>
									<p className="mt-3 mono text-sm text-[#78f0c7]">{tool.price}/mo baseline</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="grid gap-4 md:grid-cols-3">
					{[
						["01", "Audit stack", "Enter tools, seats, spend, and use case."],
						["02", "Review logic", "Get savings, seat trims, and overlap cuts."],
						["03", "Share result", "Copy a polished public URL instantly."],
					].map(([step, title, copy]) => (
						<div key={step} className="glass-panel rounded-[24px] p-5">
							<p className="mono text-sm text-[#78f0c7]">{step}</p>
							<h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
							<p className="mt-2 text-sm leading-6 text-[#9fb1c8]">{copy}</p>
						</div>
					))}
				</section>
			</div>
		</div>
	);
}