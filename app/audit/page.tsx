import { AuditForm } from "../../components/audit/audit-form";

export const metadata = {
	title: "Run audit",
	description: "Audit AI and productivity spend with a polished startup-style workflow.",
};

export default function AuditPage() {
	return (
		<div className="relative overflow-hidden px-5 py-10 sm:px-8 sm:py-14">
			<div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
				<aside className="glass-panel-strong rounded-[32px] p-6 lg:sticky lg:top-28 lg:self-start">
					<span className="pill">Audit input</span>
					<h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-white">Tell SpendScope AI what you pay for.</h1>
					<p className="mt-4 text-base leading-7 text-[#9fb1c8]">
						Add the tools that matter, the size of your team, and the workflow you actually run. The engine keeps the logic transparent and the outputs shareable.
					</p>

					<div className="mt-6 space-y-3 text-sm text-[#cddcf0]">
						{[
							"Multiple tools are supported in one audit.",
							"Local draft persistence is enabled automatically.",
							"The final result renders as a public share link.",
						].map((item) => (
							<div key={item} className="rounded-[18px] border border-white/8 bg-white/4 px-4 py-3">
								{item}
							</div>
						))}
					</div>
				</aside>

				<section className="glass-panel-strong rounded-[32px] p-5 sm:p-6">
					<AuditForm />
				</section>
			</div>
		</div>
	);
}