import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#07111f]/90">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-[#9fb1c8] sm:px-8 md:flex-row md:items-center md:justify-between">
        <p>SpendScope AI keeps the audit logic explainable, reproducible, and human-readable.</p>
        <div className="flex items-center gap-4">
          <Link href="/audit" className="focus-ring hover:text-white">
            Audit
          </Link>
          <Link href="/share" className="focus-ring hover:text-white">
            Share
          </Link>
        </div>
      </div>
    </footer>
  );
}