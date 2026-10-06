import type { HealthStatus, Level } from "@/lib/analysis-schema";

export const LEVEL_LABEL: Record<Level, string> = { low: "baixa", medium: "média", high: "alta" };
export const PRIORITY_ORDER: Record<Level, number> = { high: 0, medium: 1, low: 2 };

export const HEALTH: Record<HealthStatus, { label: string; tone: string; dot: string }> = {
  healthy: { label: "Saudável", tone: "bg-[#e6ecd9] text-moss-deep", dot: "bg-moss" },
  attention: { label: "Atenção", tone: "bg-[#f3e6c8] text-[#6b4a12]", dot: "bg-amber" },
  possible_problem: { label: "Possível problema", tone: "bg-[#f2dccf] text-[#7a3519]", dot: "bg-clay" },
  unknown: { label: "Não foi possível avaliar", tone: "bg-paper-deep text-ink-soft", dot: "bg-ink-soft" },
};

/** Qualitative wording for confidence — we show the number but lead with words. */
export function confidenceLabel(confidence: number) {
  if (confidence >= 0.8) return "Identificação alta";
  if (confidence >= 0.55) return "Identificação moderada";
  return "Identificação incerta";
}
