"use client";

import type { CSSProperties } from "react";
import { Camera, RefreshCw } from "lucide-react";
import type { AnalyzeErrorCode } from "@/lib/analysis-schema";

const COPY: Record<AnalyzeErrorCode, { title: string; body: string; tips?: string[] }> = {
  not_plant: {
    title: "A gente não achou uma planta nessa foto 🌱",
    body: "Tente tirar foto de:",
    tips: ["folhas", "caule", "flores", "a planta inteira"],
  },
  poor_image: {
    title: "A foto ficou difícil de ver.",
    body: "Tente de novo num lugar mais claro, sem tremer. Também ajuda:",
    tips: ["mostrar as folhas", "chegar mais perto", "fundo sem bagunça"],
  },
  invalid_input: {
    title: "A gente não conseguiu abrir essa foto.",
    body: "Tente outra foto. Essa o app não consegue abrir.",
  },
  too_large: {
    title: "Essa foto é grande demais.",
    body: "Tente outra foto ou tire uma nova direto pelo app.",
  },
  rate_limited: {
    title: "Ufa, foram muitas plantas seguidas!",
    body: "Para o app continuar de graça, cada pessoa pode ver algumas plantas por hora. Espere um pouco e tente de novo.",
  },
  timeout: {
    title: "Demorou mais do que devia.",
    body: "Espere um pouquinho e tente de novo.",
  },
  unavailable: {
    title: "Não deu para olhar sua planta agora.",
    body: "Espere um pouquinho e tente de novo.",
  },
};

export function AnalysisError({
  code,
  photoUrl,
  retryAfter,
  onRetry,
  onNewPhoto,
}: {
  code: AnalyzeErrorCode;
  photoUrl: string;
  retryAfter?: number;
  onRetry: () => void;
  onNewPhoto: () => void;
}) {
  const copy = COPY[code];
  const canRetry = code === "timeout" || code === "unavailable";
  const minutes = retryAfter ? Math.max(1, Math.ceil(retryAfter / 60)) : null;

  return (
    <main className="flex flex-1 flex-col px-5 pt-[max(1.5rem,calc(env(safe-area-inset-top)+0.75rem))]">
      <div className="photo-in relative mx-auto w-40 overflow-hidden rounded-[1.75rem] bg-paper-deep">
        {/* eslint-disable-next-line @next/next/no-img-element -- local object URL */}
        <img src={photoUrl} alt="" className="aspect-[4/5] w-full object-cover opacity-80 saturate-50" />
      </div>

      <div className="mt-7 text-center">
        <h1 className="font-display rise-in text-[1.75rem] leading-tight font-[430] text-balance text-ink">{copy.title}</h1>
        <p className="rise-in mx-auto mt-3 max-w-xs leading-relaxed text-ink-soft" style={{ "--i": 1 } as CSSProperties}>
          {copy.body}
          {code === "rate_limited" && minutes && ` (cerca de ${minutes} min)`}
        </p>
        {copy.tips && (
          <ul className="rise-in mt-4 flex flex-wrap justify-center gap-2" style={{ "--i": 2 } as CSSProperties}>
            {copy.tips.map((t) => (
              <li key={t} className="rounded-full bg-card px-3.5 py-1.5 text-sm text-ink/80 ring-1 ring-ink/[0.05]">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rise-in mt-8 flex flex-col items-center gap-2" style={{ "--i": 3 } as CSSProperties}>
        <button
          type="button"
          onClick={onNewPhoto}
          className="pressable flex h-14 w-full max-w-[19rem] items-center justify-center gap-2.5 rounded-full bg-moss font-medium text-primary-foreground hover:bg-moss-deep"
        >
          <Camera className="size-5" strokeWidth={1.8} />
          Tentar outra foto
        </button>
        {canRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="pressable flex h-12 items-center gap-2 rounded-full px-5 font-medium text-ink hover:bg-ink/[0.04]"
          >
            <RefreshCw className="size-4 text-ink-soft" />
            Tentar de novo
          </button>
        )}
      </div>
    </main>
  );
}
