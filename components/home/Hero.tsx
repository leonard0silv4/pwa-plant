import type { CSSProperties } from "react";
import { Camera, ImageIcon } from "lucide-react";
import { InstallPrompt } from "@/components/InstallPrompt";
import { BotanicalSprig } from "@/components/brand/BotanicalSprig";
import { LeafMark } from "@/components/brand/LeafMark";
import { ViewfinderTicks } from "@/components/home/ViewfinderTicks";

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
        <BotanicalSprig className="absolute inset-x-0 bottom-0 mx-auto h-[86%] text-moss/80 transition-transform duration-700 ease-[var(--ease-organic)] group-hover:scale-[1.03]" />
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
          Fotografe uma planta para descobrir a espécie, os cuidados e possíveis sinais de que ela precisa de
          atenção.
        </p>
      </div>

      <div className="rise-in mt-6 flex flex-col items-center gap-1" style={{ "--i": 4 } as CSSProperties}>
        <button
          type="button"
          onClick={onCamera}
          disabled={disabled}
          className="pressable flex h-14 w-full max-w-[19rem] items-center justify-center gap-2.5 rounded-full bg-moss text-[1.02rem] font-medium text-primary-foreground shadow-[0_14px_30px_-14px_rgb(31_51_36/0.7)] hover:bg-moss-deep disabled:opacity-60"
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
