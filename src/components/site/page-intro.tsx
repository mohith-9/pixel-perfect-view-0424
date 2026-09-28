export function PageIntro({
  label,
  lead,
  accent,
  text,
}: {
  label: string;
  lead: string;
  accent: string;
  text: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/60">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[50rem] -translate-x-1/2 rounded-full opacity-35 blur-[130px]"
        style={{ background: "var(--gradient-red)" }}
      />
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <p className="flex items-center gap-2 text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
          <span className="text-primary">✦</span> {label}
        </p>
        <h1
          className="mt-4 text-[clamp(3.5rem,11vw,8rem)] leading-[0.85] uppercase"
          style={{ fontFamily: "Anton, var(--font-display)" }}
        >
          {lead} <span className="text-primary">{accent}</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm text-muted-foreground sm:text-base">{text}</p>
      </div>
    </section>
  );
}
