"use client";

import type { CSSProperties } from "react";
import { ArrowRight, RefreshCw, WifiOff } from "lucide-react";

export function PhotoPreview({
  src,
  onAnalyze,
  onRetake,
  offline,
}: {
  src: string;
  onAnalyze: () => void;
  onRetake: () => void;
  offline?: boolean;
}) {
  return (
    <main className="flex flex-1 flex-col px-5 pt-[max(1.5rem,calc(env(safe-area-inset-top)+0.75rem))]">
      <p className="label-mono rise-in px-1 text-ink-soft">Sua foto</p>

      <div className="photo-in relative mt-3 overflow-hidden rounded-[2rem] bg-paper-deep shadow-[0_30px_60px_-30px_rgb(28_33_29/0.45)]">
        {/* eslint-disable-next-line @next/next/no-img-element -- local object URL */}
        <img src={src} alt="Foto selecionada da planta" className="aspect-[4/5] w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/20" />
      </div>

      <div className="rise-in mt-6 flex flex-col items-center gap-2" style={{ "--i": 2 } as CSSProperties}>
        {offline ? (
          <div className="flex w-full items-start gap-3 rounded-2xl bg-card px-4 py-3.5 text-sm text-ink-soft">
            <WifiOff className="mt-0.5 size-4 shrink-0 text-clay" />
            <p>
              <span className="font-medium text-ink">Você está sem internet.</span> Conecte-se para analisar uma
              planta nova.
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAnalyze}
            className="pressable group flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-moss text-[1.02rem] font-medium text-primary-foreground shadow-[0_14px_30px_-14px_rgb(31_51_36/0.7)] hover:bg-moss-deep"
          >
            Descobrir a planta
            <ArrowRight className="size-[1.1rem] transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        )}
        <button
          type="button"
          onClick={onRetake}
          className="pressable flex h-12 items-center gap-2 rounded-full px-5 text-[0.95rem] font-medium text-ink hover:bg-ink/[0.04]"
        >
          <RefreshCw className="size-4 text-ink-soft" strokeWidth={1.8} />
          Escolher outra foto
        </button>
      </div>
    </main>
  );
}
