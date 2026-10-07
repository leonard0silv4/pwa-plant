import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const OUTLINE = "#3b2a20";

// Pixel heart on the pot's screen, 7×6 cells of 3 units.
const HEART = [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."]
  .flatMap((row, y) => [...row].map((c, x) => (c === "X" ? `M${89.5 + x * 3} ${146 + y * 3}h3v3h-3z` : "")))
  .join("");

// Tap reactions and how long each one plays, in ms (kept in sync with globals.css).
export const REACTIONS = { jump: 1100, dance: 1400, love: 1700 } as const;
export type Reaction = keyof typeof REACTIONS;

const heart = (x: number, y: number, s: number) =>
  `M${x} ${y + s}C${x - s * 1.7} ${y - s * 0.2} ${x - s * 0.7} ${y - s * 1.5} ${x} ${y - s * 0.4}` +
  `C${x + s * 0.7} ${y - s * 1.5} ${x + s * 1.7} ${y - s * 0.2} ${x} ${y + s}Z`;
const sparkle = (x: number, y: number, s: number) =>
  `M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`;

// Floating hearts (love): [x, y, size, horizontal drift, delay ms].
const HEARTS = [
  [70, 70, 6, -14, 0],
  [130, 66, 7, 12, 180],
  [100, 52, 5, 4, 380],
  [52, 92, 4.5, -10, 560],
  [148, 88, 5, 10, 720],
] as const;
// Sparkles (jump, dance): [x, y, size, delay ms].
const SPARKLES = [
  [30, 70, 6, 0],
  [170, 60, 7, 90],
  [22, 128, 5, 180],
  [178, 122, 5.5, 60],
  [100, 14, 6, 140],
  [58, 30, 4, 220],
  [144, 24, 4.5, 30],
] as const;

/**
 * The Plantagotchi mascot: a sprout peeking out of a little virtual-pet pot.
 * Pops out of the pot on mount, then breathes, waves its leaves, blinks and its heart beats.
 * Pass a `reaction` to play one of its tap animations. Purely decorative.
 */
export function Plantagotchi({ className, reaction }: { className?: string; reaction?: Reaction | null }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      overflow="visible"
      data-react={reaction ?? undefined}
      className={cn("pg", className)}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <defs>
        <linearGradient id="pg-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9ed15e" />
          <stop offset="1" stopColor="#6fae3f" />
        </linearGradient>
        <linearGradient id="pg-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cdeb8f" />
          <stop offset="1" stopColor="#a5d160" />
        </linearGradient>
        <linearGradient id="pg-pot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf4e4" />
          <stop offset="1" stopColor="#efe2c6" />
        </linearGradient>
      </defs>

      <ellipse className="pg-shadow" cx="100" cy="186" rx="58" ry="5" fill="#1f3324" opacity=".12" />

      <g className="pg-pet">
        {/* Feet, rim and soil sit behind the sprout. */}
        <g fill="#efe2c6" stroke={OUTLINE} strokeWidth="3.5">
          <rect x="58" y="168" width="22" height="16" rx="6" />
          <rect x="120" y="168" width="22" height="16" rx="6" />
        </g>
        <ellipse cx="100" cy="118" rx="64" ry="14" fill="#fbf4e4" stroke={OUTLINE} strokeWidth="3.5" />
        <ellipse cx="100" cy="118" rx="54" ry="9" fill="#6b4a35" />

        <g className="pg-peek">
          <g className="pg-bob">
            <g className="pg-sprout">
              <path d="M100 76 C100 66 100 60 100 54" fill="none" stroke={OUTLINE} strokeWidth="10" />
              <path d="M100 76 C100 66 100 60 100 54" fill="none" stroke="#86c04f" strokeWidth="4.5" />
              <g className="pg-flap-l">
                <g className="pg-leaf-l">
                  <path
                    d="M98 58 C78 66 38 62 25 38 C21 30 27 23 36 23 C64 22 90 36 98 58 Z"
                    fill="url(#pg-leaf)"
                    stroke={OUTLINE}
                    strokeWidth="3.5"
                  />
                  <path d="M92 53 C76 42 58 35 42 33" fill="none" stroke="#4f8a2c" strokeWidth="2.5" />
                  <ellipse cx="44" cy="31" rx="8" ry="3.5" fill="#fff" opacity=".45" transform="rotate(-8 44 31)" />
                </g>
              </g>
              <g className="pg-flap-r">
                <g className="pg-leaf-r">
                  <path
                    d="M102 58 C122 66 162 62 175 38 C179 30 173 23 164 23 C136 22 110 36 102 58 Z"
                    fill="url(#pg-leaf)"
                    stroke={OUTLINE}
                    strokeWidth="3.5"
                  />
                  <path d="M108 53 C124 42 142 35 158 33" fill="none" stroke="#4f8a2c" strokeWidth="2.5" />
                  <ellipse cx="156" cy="31" rx="8" ry="3.5" fill="#fff" opacity=".45" transform="rotate(8 156 31)" />
                </g>
              </g>

              <path
                d="M54 124 C52 85 72 62 100 62 C128 62 148 85 146 124 Z"
                fill="url(#pg-head)"
                stroke={OUTLINE}
                strokeWidth="3.5"
              />
              <ellipse cx="80" cy="79" rx="9" ry="4.5" fill="#fff" opacity=".55" transform="rotate(-28 80 79)" />

              <g className="pg-blink" fill={OUTLINE}>
                <circle cx="79" cy="97" r="7.5" />
                <circle cx="121" cy="97" r="7.5" />
                <circle cx="76.5" cy="94.2" r="2.6" fill="#fff" />
                <circle cx="118.5" cy="94.2" r="2.6" fill="#fff" />
                <circle cx="81.5" cy="100" r="1.2" fill="#fff" />
                <circle cx="123.5" cy="100" r="1.2" fill="#fff" />
              </g>
              {/* Happy closed eyes (^ ^), shown while reacting. */}
              <path
                className="pg-happy"
                d="M71 99 Q79 89 87 99 M113 99 Q121 89 129 99"
                fill="none"
                stroke={OUTLINE}
                strokeWidth="4"
              />
              <ellipse className="pg-cheek" cx="69" cy="108" rx="7" ry="4.5" fill="#f59d86" opacity=".75" />
              <ellipse className="pg-cheek" cx="131" cy="108" rx="7" ry="4.5" fill="#f59d86" opacity=".75" />
              <g className="pg-mouth">
                <path d="M92.5 103.5 Q100 101.5 107.5 103.5 Q107 114 100 114 Q93 114 92.5 103.5 Z" fill={OUTLINE} />
                <path d="M95.5 111 Q100 107.5 104.5 111 Q102.5 113 100 113 Q97.5 113 95.5 111 Z" fill="#f2767a" />
              </g>
            </g>
          </g>
        </g>

        {/* Pot front: its top edge is the lower half of the rim, so it hides the sprout's base. */}
        <path
          d="M36 118 A64 14 0 0 0 164 118 L160 160 C158 172 148 178 136 178 L64 178 C52 178 42 172 40 160 Z"
          fill="url(#pg-pot)"
          stroke={OUTLINE}
          strokeWidth="3.5"
        />
        <path d="M40 128 A61 12 0 0 0 160 128" fill="none" stroke="#e2d3b3" strokeWidth="2.5" />
        <path d="M45 140 C45 152 47 160 51 166" fill="none" stroke="#fff" strokeWidth="3" opacity=".8" />

        <rect x="77" y="139" width="46" height="31" rx="6" fill="#bccb92" stroke={OUTLINE} strokeWidth="3.5" />
        <path d="M82 145 h10" stroke="#fff" strokeWidth="2.5" opacity=".6" />
        <g className="pg-screen">
          <path className="pg-heart" d={HEART} fill="#4a6236" />
        </g>

        <g stroke={OUTLINE} strokeWidth="3.5" fill="#f2866a">
          <circle className="pg-btn" cx="57" cy="154" r="9" />
          <circle className="pg-btn pg-btn-r" cx="143" cy="154" r="9" />
        </g>
        <circle cx="54.5" cy="151" r="2.6" fill="#fff" opacity=".7" />
        <circle cx="140.5" cy="151" r="2.6" fill="#fff" opacity=".7" />

        {/* Little hands resting on the rim. */}
        <g className="pg-hands" fill="#b3da6c" stroke={OUTLINE} strokeWidth="3.5">
          <ellipse cx="71" cy="124" rx="11" ry="8" />
          <ellipse cx="129" cy="124" rx="11" ry="8" />
        </g>
      </g>

      {HEARTS.map(([x, y, size, dx, delay], k) => (
        <path
          key={k}
          className="pg-float"
          d={heart(x, y, size)}
          fill="#f2767a"
          stroke={OUTLINE}
          strokeWidth="2"
          style={{ "--dx": `${dx}px`, "--d": `${delay}ms` } as CSSProperties}
        />
      ))}
      {SPARKLES.map(([x, y, size, delay], k) => (
        <path
          key={k}
          className="pg-sparkle"
          d={sparkle(x, y, size)}
          fill={k % 2 ? "#f6c94c" : "#fff7c2"}
          stroke="#c99a2e"
          strokeWidth="1"
          style={{ "--d": `${delay}ms` } as CSSProperties}
        />
      ))}
    </svg>
  );
}
