import { cn } from "@/lib/utils";

/** Abstract leaf with a scan line — the FloraScan mark. */
export function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={cn("size-8", className)}>
      <path
        d="M24 6c8 4.6 12 12 10.8 20-1 6.4-5.2 10.8-10.8 12.4-5.6-1.6-9.8-6-10.8-12.4C12 18 16 10.6 24 6z"
        fill="currentColor"
      />
      <path
        d="M24 11v26M24 19l-5-4M24 19l5-4M24 26l-6-4.4M24 26l6-4.4"
        stroke="var(--paper)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="9" y="24.2" width="30" height="1.3" rx=".65" fill="var(--lichen)" />
    </svg>
  );
}
