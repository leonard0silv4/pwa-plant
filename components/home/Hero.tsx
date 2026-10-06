import type { CSSProperties } from "react";
import { Camera, ImageIcon } from "lucide-react";
import { InstallPrompt } from "@/components/InstallPrompt";
import { BotanicalSprig } from "@/components/brand/BotanicalSprig";
import { LeafMark } from "@/components/brand/LeafMark";
import { ViewfinderTicks } from "@/components/home/ViewfinderTicks";

// Pollen motes drifting up inside the arch: [left %, bottom %, duration s, delay s, horizontal drift px, opacity].
const POLLEN = [
  [30, 14, 9, 0.4, 8, 0.7],
  [44, 6, 11, 2.6, -6, 0.55],
  [58, 18, 8.5, 1.2, 10, 0.8],
  [68, 8, 12, 4.1, -8, 0.5],
  [38, 24, 10, 5.6, 5, 0.6],
  [62, 30, 9.5, 3.3, -4, 0.65],
  [50, 12, 13, 6.8, 7, 0.45],
] as const;

export function Hero({
  onCamera,
  onGallery,
  disabled,
}: {
  onCamera: () => void;
  onGallery: () => void;
  disabled?: boolean;
}) {
  return (
    <main className="flex flex-1 flex-col px-6 pt-[max(1.75rem,calc(env(safe-area-inset-top)+1rem))]">
      <div className="rise-in flex items-center justify-between">
        <div className="flex items-center gap-2 text-moss">
          <LeafMark className="size-7" />
          <span className="font-display text-lg font-[500] tracking-tight text-ink">FloraScan</span>
        </div>
        <span className="label-mono text-ink-soft/70">Colégio MAF</span>
      </div>

      <button
        type="button"
        onClick={onCamera}
        disabled={disabled}
        aria-label="Tirar uma foto da planta"
        className="pressable group rise-in relative mx-auto mt-6 aspect-[4/5] h-[clamp(10rem,33dvh,22rem)] overflow-hidden rounded-[50%_50%_2.25rem_2.25rem/40%_40%_2.25rem_2.25rem] bg-paper-deep ring-1 ring-ink/[0.05] disabled:opacity-60"
        style={{ "--i": 1 } as CSSProperties}
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,rgb(154_174_143/0.35),transparent_70%)]" />
        {/* Dappled light, like sun moving through leaves. */}
        <div className="dapple absolute -inset-[20%] bg-[radial-gradient(35%_28%_at_35%_30%,rgb(228_236_180/0.45),transparent_70%),radial-gradient(30%_24%_at_70%_55%,rgb(228_236_180/0.3),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-[86%] transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-[1.03]">
          <BotanicalSprig className="sway size-full text-moss/80" />
        </div>
        {POLLEN.map(([x, y, t, delay, dx, o], k) => (
          <span
            key={k}
            aria-hidden
            className={`drift absolute size-1 rounded-full ${k % 2 ? "bg-sage" : "bg-moss/50"}`}
            style={
              { left: `${x}%`, bottom: `${y}%`, "--t": `${t}s`, "--delay": `${delay}s`, "--dx": `${dx}px`, "--o": o } as CSSProperties
            }
          />
        ))}
        <ViewfinderTicks className="text-ink/25" />
      </button>

      <div className="mt-7 text-center">
        <h1
          className="font-display rise-in text-[clamp(2.1rem,9vw,2.6rem)] leading-[1] font-[400] tracking-[-0.025em] text-ink"
          style={{ "--i": 2 } as CSSProperties}
        >
          Descubra sua <em className="font-[380] text-moss">planta</em>
        </h1>
        <p
          className="rise-in mx-auto mt-3 max-w-[19rem] text-[0.95rem] leading-relaxed text-ink-soft"
          style={{ "--i": 3 } as CSSProperties}
        >
          Tire uma foto de uma planta e descubra o nome dela, como cuidar e se ela está bem.
        </p>
      </div>

      <div className="rise-in mt-6 flex flex-col items-center gap-1" style={{ "--i": 4 } as CSSProperties}>
        <button
          type="button"
          onClick={onCamera}
          disabled={disabled}
          className="pressable sheen flex h-14 w-full max-w-[19rem] items-center justify-center gap-2.5 rounded-full bg-moss text-[1.02rem] font-medium text-primary-foreground shadow-[0_14px_30px_-14px_rgb(31_51_36/0.7)] hover:bg-moss-deep disabled:opacity-60"
        >
          <Camera className="size-5" strokeWidth={1.8} />
          Tirar uma foto
        </button>
        <button
          type="button"
          onClick={onGallery}
          disabled={disabled}
          className="pressable flex h-12 items-center gap-2 rounded-full px-5 text-[0.95rem] font-medium text-ink hover:bg-ink/[0.04] disabled:opacity-60"
        >
          <ImageIcon className="size-[1.1rem] text-ink-soft" strokeWidth={1.8} />
          Escolher da galeria
        </button>
      </div>

      <InstallPrompt />
    </main>
  );
}
