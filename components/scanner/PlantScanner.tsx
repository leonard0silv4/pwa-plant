"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./scanner.module.css";

const MESSAGES = [
  "Olhando a planta com atenção…",
  "Procurando pistas nas folhas…",
  "Comparando com outras plantas…",
  "Vendo se ela está saudável…",
  "Juntando dicas para cuidar dela…",
];

// Decorative markers only — they do NOT correspond to anything the model detected.
const MARKERS = [
  { x: 28, y: 30, delay: 600 },
  { x: 68, y: 22, delay: 1700 },
  { x: 58, y: 56, delay: 2800 },
  { x: 24, y: 70, delay: 3900 },
  { x: 76, y: 74, delay: 5000 },
];

export type ScannerPhase = "scanning" | "finishing" | "done";

export function PlantScanner({
  src,
  phase,
  doneLabel = "Planta identificada",
}: {
  src: string;
  phase: ScannerPhase;
  doneLabel?: string | null;
}) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (phase !== "scanning") return;
    const id = setInterval(() => setMessageIndex((i) => (i + 1) % MESSAGES.length), 2600);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <main className="flex flex-1 flex-col px-5 pt-[max(1.5rem,calc(env(safe-area-inset-top)+0.75rem))]">
      <div className="flex items-baseline justify-between px-1">
        <p className="label-mono text-ink-soft">Olhando sua planta</p>
        <span className="label-mono flex items-center gap-1.5 text-moss" aria-hidden>
          <span className={cn("size-1.5 rounded-full bg-moss", phase === "scanning" && styles.blink)} />
          IA
        </span>
      </div>

      <div
        className={cn(
          "relative mt-3 overflow-hidden rounded-[2rem] bg-ink shadow-[0_30px_60px_-30px_rgb(28_33_29/0.55)]",
          styles.frame,
        )}
        data-phase={phase}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- local object URL */}
        <img src={src} alt="Foto da planta em análise" className={cn("aspect-[4/5] w-full object-cover", styles.photo)} />

        <div aria-hidden className={styles.overlay}>
          <div className={styles.vignette} />
          <div className={styles.grid} />
          <div className={styles.beam}>
            <div className={styles.line} />
          </div>
          {/* Herbarium-style annotation: thin leaders linking the markers in the order they appear. */}
          <svg className={styles.links} viewBox="0 0 100 100" preserveAspectRatio="none">
            {MARKERS.slice(1).map((m, i) => (
              <line
                key={i}
                x1={MARKERS[i].x}
                y1={MARKERS[i].y}
                x2={m.x}
                y2={m.y}
                pathLength={1}
                vectorEffect="non-scaling-stroke"
                style={{ "--delay": `${m.delay}ms` } as CSSProperties}
              />
            ))}
          </svg>
          {MARKERS.map((m, i) => (
            <span
              key={i}
              className={styles.marker}
              style={{ left: `${m.x}%`, top: `${m.y}%`, "--delay": `${m.delay}ms` } as CSSProperties}
            />
          ))}
          <span className={cn(styles.corner, styles.tl)} />
          <span className={cn(styles.corner, styles.tr)} />
          <span className={cn(styles.corner, styles.bl)} />
          <span className={cn(styles.corner, styles.br)} />
        </div>

        {doneLabel && (
          <div className={styles.done} aria-hidden={phase === "scanning"}>
            <span className="relative flex items-center gap-2 rounded-full bg-paper/95 px-4 py-2 text-sm font-medium text-moss shadow-lg backdrop-blur">
              <span aria-hidden className={styles.ripple} />
              <Check className="size-4" strokeWidth={2.4} />
              {doneLabel}
            </span>
          </div>
        )}
      </div>

      <div className="mt-7 px-1 text-center" aria-live="polite">
        <p key={messageIndex} className={cn("font-display text-[1.45rem] leading-tight font-[420] text-ink", styles.message)}>
          {phase === "scanning" ? MESSAGES[messageIndex] : "Quase lá…"}
        </p>
        <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
          {MESSAGES.map((_, k) => (
            <span
              key={k}
              className={cn(
                "size-1.5 rounded-full transition-all duration-500 ease-[var(--ease-organic)]",
                phase !== "scanning" || k <= messageIndex ? "w-4 bg-moss" : "bg-ink/15",
              )}
            />
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-soft">Leva só alguns segundos</p>
      </div>
    </main>
  );
}
