import Link from "next/link";

const navItems = [
  { href: "/audit", label: "Run audit" },
  { href: "/share", label: "Share view" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[#07111f]/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/12 bg-white/6 text-sm font-semibold text-[#dffdf4] shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
            S
          </span>
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-[#dffdf4] uppercase">
              SpendScope AI
            </p>
            <p className="text-xs text-[#9fb1c8]">Audit your tool stack with clarity</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-full border border-white/8 bg-white/4 px-4 py-2 text-sm text-[#c8d8ea] transition hover:border-white/18 hover:bg-white/8"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/audit"
            className="focus-ring rounded-full bg-[#7bf0c7] px-4 py-2 text-sm font-semibold text-[#07201a] transition hover:bg-[#94f4d2]"
          >
            Start audit
          </Link>
        </nav>
      </div>
    </header>
  );
}