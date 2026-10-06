import { cn } from "@/lib/utils";

// Stem, four leaves (outline + midrib) and a bud, merged into one path: a single dash sweeps
// through the subpaths in order, so the sprig draws itself with one animation instead of ten.
const d = [
  "M100 250 C 98 200, 104 150, 100 60",
  "M101 205 C 125 195, 150 175, 158 150 C 135 152, 112 172, 101 205",
  "M101 205 Q 128 178, 158 150",
  "M100 175 C 76 165, 52 145, 44 118 C 68 121, 90 140, 100 175",
  "M100 175 Q 70 150, 44 118",
  "M101 135 C 122 125, 140 105, 146 82 C 126 86, 108 104, 101 135",
  "M101 135 Q 124 110, 146 82",
  "M100 105 C 82 96, 66 78, 62 58 C 80 62, 96 78, 100 105",
  "M100 105 Q 80 82, 62 58",
  "M100 60 C 92 48, 94 32, 100 22 C 106 32, 108 48, 100 60",
].join(" ");

/** Hand-drawn style sprig, stroked in on mount. Purely decorative. */
export function BotanicalSprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 260"
      aria-hidden
      className={cn("draw-sprig", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} pathLength={1} />
    </svg>
  );
}
