export default function Loading() {
  return (
    <div className="px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="glass-panel-strong gradient-border rounded-[2rem] px-6 py-8 sm:px-10">
          <div className="space-y-5">
            <div className="h-3 w-24 rounded-full bg-[rgba(120,240,199,0.18)]" />
            <div className="h-12 w-full max-w-2xl rounded-2xl bg-white/8" />
            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4 rounded-3xl border border-white/8 bg-white/4 p-5">
                <div className="h-5 w-32 rounded-full bg-white/10" />
                <div className="h-28 rounded-2xl bg-white/6" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="h-20 rounded-2xl bg-white/6" />
                  <div className="h-20 rounded-2xl bg-white/6" />
                </div>
              </div>
              <div className="space-y-4 rounded-3xl border border-white/8 bg-white/4 p-5">
                <div className="h-5 w-28 rounded-full bg-white/10" />
                <div className="space-y-3">
                  <div className="h-4 w-full rounded-full bg-white/6" />
                  <div className="h-4 w-5/6 rounded-full bg-white/6" />
                  <div className="h-4 w-2/3 rounded-full bg-white/6" />
                </div>
                <div className="h-12 w-full rounded-full bg-[rgba(120,240,199,0.16)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="muted-copy text-sm">
          Loading your result, recommendation breakdown, and share controls.
        </div>
      </div>
    </div>
  );
}