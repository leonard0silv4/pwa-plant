import type { HealthStatus, Level } from "@/lib/analysis-schema";

export const PROBABILITY_LABEL: Record<Level, string> = { low: "pouco provável", medium: "talvez", high: "bem provável" };
export const PRIORITY_LABEL: Record<Level, string> = { low: "Sem pressa", medium: "Logo", high: "Urgente" };
export const PRIORITY_ORDER: Record<Level, number> = { high: 0, medium: 1, low: 2 };

export const HEALTH: Record<HealthStatus, { label: string; tone: string; dot: string }> = {
  healthy: { label: "Está saudável", tone: "bg-[#e6ecd9] text-moss-deep", dot: "bg-moss" },
  attention: { label: "Precisa de atenção", tone: "bg-[#f3e6c8] text-[#6b4a12]", dot: "bg-amber" },
  possible_problem: { label: "Pode ter um problema", tone: "bg-[#f2dccf] text-[#7a3519]", dot: "bg-clay" },
  unknown: { label: "Não deu para ver", tone: "bg-paper-deep text-ink-soft", dot: "bg-ink-soft" },
};

/** Qualitative wording for confidence — we show the number but lead with words. */
export function confidenceLabel(confidence: number) {
  if (confidence >= 0.8) return "Tenho bastante certeza";
  if (confidence >= 0.55) return "Acho que é esta";
  return "Não tenho certeza";
}
