export default function Loading() {
  return (
    <div className="px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="glass-panel gradient-border rounded-3xl px-6 py-6 sm:px-8">
          <div className="space-y-4">
            <div className="h-3 w-28 rounded-full bg-[rgba(120,240,199,0.18)]" />
            <div className="h-9 w-full max-w-xl rounded-2xl bg-white/8" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-24 rounded-2xl bg-white/6" />
              <div className="h-24 rounded-2xl bg-white/6" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="h-16 rounded-2xl bg-white/6" />
              <div className="h-16 rounded-2xl bg-white/6" />
              <div className="h-16 rounded-2xl bg-white/6" />
            </div>
            <div className="h-12 w-40 rounded-full bg-[rgba(120,240,199,0.16)]" />
          </div>
        </div>

        <div className="muted-copy text-sm">
          Preparing your audit form and restoring your draft state.
        </div>
      </div>
    </div>
  );
}