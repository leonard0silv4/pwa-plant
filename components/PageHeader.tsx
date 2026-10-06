import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="px-6 pt-[max(2.5rem,calc(env(safe-area-inset-top)+1.5rem))] pb-6">
      <p className="label-mono rise-in text-ink-soft">{eyebrow}</p>
      <h1
        className="font-display rise-in mt-3 text-[2.5rem] leading-[1.02] font-[420] tracking-[-0.02em] text-balance text-ink"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {title}
      </h1>
      {children && (
        <div className="rise-in mt-4 text-[0.98rem] leading-relaxed text-ink-soft" style={{ "--i": 2 } as React.CSSProperties}>
          {children}
        </div>
      )}
    </header>
  );
}
