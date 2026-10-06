import { cn } from "@/lib/utils";

/** Four thin corner ticks, like a camera viewfinder. Decorative. */
export function ViewfinderTicks({ className }: { className?: string }) {
  const tick = "absolute size-5 border-current";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-[9%] top-[14%]", className)}>
      <span className={cn(tick, "top-0 left-0 rounded-tl-md border-t border-l")} />
      <span className={cn(tick, "top-0 right-0 rounded-tr-md border-t border-r")} />
      <span className={cn(tick, "bottom-0 left-0 rounded-bl-md border-b border-l")} />
      <span className={cn(tick, "right-0 bottom-0 rounded-br-md border-r border-b")} />
    </div>
  );
}
