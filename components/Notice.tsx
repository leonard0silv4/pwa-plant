import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Calm inline message for errors and hints — never alarming. */
export function Notice({
  title,
  children,
  icon,
  className,
}: {
  title: string;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div role="status" className={cn("rise-in rounded-[1.5rem] bg-card p-5 ring-1 ring-ink/[0.05]", className)}>
      <div className="flex items-start gap-3">
        {icon && <span className="mt-0.5 shrink-0 text-clay">{icon}</span>}
        <div>
          <p className="font-display text-lg leading-snug font-[460] text-ink">{title}</p>
          {children && <div className="mt-1.5 text-[0.93rem] leading-relaxed text-ink-soft">{children}</div>}
        </div>
      </div>
    </div>
  );
}
