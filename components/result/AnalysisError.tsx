"use client";

import type { CSSProperties } from "react";
import { Camera, RefreshCw } from "lucide-react";
import type { AnalyzeErrorCode } from "@/lib/analysis-schema";

const COPY: Record<AnalyzeErrorCode, { title: string; body: string; tips?: string[] }> = {
  not_plant: {
    title: "Não conseguimos identificar uma planta nessa foto 🌱",
    body: "Tente fotografar:",
    tips: ["folhas", "caule", "flores", "a planta inteira"],
  },
  poor_image: {
    title: "A imagem não possui detalhes suficientes.",
    body: "Tente novamente com mais luz e mantendo a planta em foco. Ajuda também:",
    tips: ["folhas visíveis", "enquadramento mais próximo", "fundo simples"],
  },
  invalid_input: {
    title: "Não conseguimos ler essa imagem.",
    body: "Use uma foto em JPEG, PNG ou WebP.",
  },
  too_large: {
    title: "Essa imagem é grande demais.",
    body: "Tente outra foto ou faça uma captura direto pelo app.",
  },
  rate_limited: {
    title: "Você fez muitas análises seguidas.",
    body: "Para manter o app gratuito, limitamos o número de análises por hora. Tente novamente mais tarde.",
  },
  timeout: {
    title: "A análise demorou mais do que o esperado.",
    body: "Tente novamente em alguns instantes.",
  },
  unavailable: {
    title: "Não foi possível analisar sua planta agora.",
    body: "Tente novamente em alguns instantes.",
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
            Tentar novamente
          </button>
        )}
      </div>
    </main>
  );
}
