"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CircleHelp,
  Droplets,
  FlaskConical,
  Leaf,
  Shovel,
  Sprout,
  Sun,
  Thermometer,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { PlantAnalysis } from "@/lib/analysis-schema";
import { cn } from "@/lib/utils";
import { HEALTH, LEVEL_LABEL, PRIORITY_ORDER, confidenceLabel } from "./labels";

const stagger = (i: number) => ({ "--i": i } as CSSProperties);

function Section({
  title,
  eyebrow,
  index,
  children,
  className,
}: {
  title: string;
  eyebrow?: string;
  index: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rise-in", className)} style={stagger(index)}>
      {eyebrow && <p className="label-mono mb-1.5 px-1 text-ink-soft/80">{eyebrow}</p>}
      <h2 className="font-display mb-3 px-1 text-[1.6rem] leading-tight font-[430] tracking-[-0.015em]">{title}</h2>
      {children}
    </section>
  );
}

const CARE_ITEMS: { key: keyof PlantAnalysis["care"]; label: string; icon: LucideIcon; tint: string }[] = [
  { key: "light", label: "Luz", icon: Sun, tint: "bg-[#f4ead0] text-[#7a5a14]" },
  { key: "watering", label: "Rega", icon: Droplets, tint: "bg-[#dfe8e6] text-[#285456]" },
  { key: "soil", label: "Solo", icon: Shovel, tint: "bg-[#ece2d6] text-[#6c4a2f]" },
  { key: "temperature", label: "Temperatura", icon: Thermometer, tint: "bg-[#f2dfd4] text-[#7d3d22]" },
  { key: "humidity", label: "Umidade", icon: Wind, tint: "bg-[#e3e6ee] text-[#3d4a63]" },
  { key: "fertilization", label: "Adubação", icon: Sprout, tint: "bg-[#e4ead5] text-moss-deep" },
];

export function AnalysisResult({
  analysis,
  photoUrl,
  date,
  actions,
}: {
  analysis: PlantAnalysis;
  photoUrl: string;
  date?: Date;
  actions?: ReactNode;
}) {
  const { identification: id, health, care } = analysis;
  const identified = Boolean(id.commonName || id.scientificName);
  const healthMeta = HEALTH[health.overallStatus];
  const recommendations = [...analysis.recommendations].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
  );
  const pct = Math.round(id.confidence * 100);
  const careItems = CARE_ITEMS.filter((c) => care[c.key]);

  let i = 0;

  return (
    <article className="pb-6">
      {/* Photo hero — the user's photo is the protagonist. */}
      <div className="relative">
        <div className="photo-in relative overflow-hidden rounded-b-[2.5rem] bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob URL */}
          <img src={photoUrl} alt={id.commonName || "Foto da planta"} className="aspect-[4/5] max-h-[68dvh] w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(18_24_19/0.35),transparent_22%,transparent_60%,rgb(18_24_19/0.55))]" />
          {date && (
            <p className="label-mono absolute top-[max(1.25rem,env(safe-area-inset-top))] left-5 text-paper/85">
              {date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-10 px-5">
        {/* Identification */}
        <header className="rise-in -mt-16 relative rounded-[2rem] bg-card px-6 pt-6 pb-5 shadow-[0_24px_50px_-28px_rgb(28_33_29/0.45)]" style={stagger(i++)}>
          {identified ? (
            <>
              <h1 className="font-display text-[2.3rem] leading-[1.02] font-[430] tracking-[-0.02em] text-balance">
                {id.commonName || id.scientificName}
              </h1>
              {id.scientificName && id.commonName && (
                <p className="font-display mt-1.5 text-lg text-ink-soft italic">{id.scientificName}</p>
              )}
              {id.family && <p className="label-mono mt-3 text-ink-soft/70">Família {id.family}</p>}
            </>
          ) : (
            <h1 className="font-display text-[1.9rem] leading-tight font-[430] text-balance">
              Não conseguimos identificar com segurança
            </h1>
          )}

          <div className="mt-5 flex items-center gap-3">
            <ConfidenceMeter value={id.confidence} />
            <div className="text-sm leading-tight">
              <p className="font-medium text-ink">{confidenceLabel(id.confidence)}</p>
              <p className="text-ink-soft">{pct}% de confiança na espécie</p>
            </div>
          </div>

          {id.alternatives.length > 0 && (
            <p className="mt-4 border-t border-ink/[0.06] pt-3 text-sm text-ink-soft">
              Também pode ser:{" "}
              {id.alternatives.map((a, k) => (
                <span key={k}>
                  {k > 0 && ", "}
                  <span className="text-ink">{a.commonName}</span>
                  {a.scientificName && <em className="text-ink-soft"> ({a.scientificName})</em>}
                </span>
              ))}
            </p>
          )}
        </header>

        {/* About */}
        <Section title="Sobre" index={i++}>
          <p className="px-1 text-[1.02rem] leading-relaxed text-ink/85">{analysis.description}</p>
          {analysis.characteristics.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2 px-1">
              {analysis.characteristics.map((c, k) => (
                <li key={k} className="rounded-full bg-paper-deep px-3.5 py-1.5 text-[0.85rem] text-ink/80">
                  {c}
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Care — horizontal cards */}
        {careItems.length > 0 && (
          <Section title="Como cuidar" index={i++}>
            <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2">
              {careItems.map(({ key, label, icon: Icon, tint }) => (
                <div
                  key={key}
                  className="flex w-[15.5rem] shrink-0 snap-start flex-col rounded-[1.6rem] bg-card p-5 ring-1 ring-ink/[0.04]"
                >
                  <span className={cn("flex size-10 items-center justify-center rounded-full", tint)}>
                    <Icon className="size-[1.15rem]" strokeWidth={1.8} />
                  </span>
                  <p className="mt-4 font-medium text-ink">{label}</p>
                  <p className="mt-1 text-[0.92rem] leading-relaxed text-ink-soft">{care[key]}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Health */}
        <Section title="Saúde da planta" index={i++}>
          <div className="rounded-[1.75rem] bg-card p-5 ring-1 ring-ink/[0.04]">
            <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium", healthMeta.tone)}>
              <HealthIcon status={health.overallStatus} />
              {healthMeta.label}
            </span>
            <p className="mt-3 text-[1rem] leading-relaxed text-ink/85">{health.summary}</p>
            {health.observations.length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-ink/[0.06] pt-4">
                {health.observations.map((o, k) => (
                  <li key={k} className="flex gap-2.5 text-[0.93rem] leading-relaxed text-ink-soft">
                    <span className={cn("mt-2 size-1.5 shrink-0 rounded-full", healthMeta.dot)} />
                    {o}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {health.possibleProblems.length > 0 && (
            <div className="mt-5">
              <p className="label-mono mb-2.5 px-1 text-ink-soft/80">Possíveis problemas</p>
              <ul className="space-y-2.5">
                {health.possibleProblems.map((p, k) => (
                  <li key={k} className="rounded-[1.4rem] bg-card/70 p-4 ring-1 ring-ink/[0.04]">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-ink">{p.name}</p>
                      <LevelPill level={p.probability} prefix="Probabilidade" />
                    </div>
                    <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-soft">{p.explanation}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Section title="O que fazer agora" eyebrow="Recomendações" index={i++}>
            <ol className="space-y-1">
              {recommendations.map((r, k) => (
                <li key={k} className="flex gap-4 rounded-[1.4rem] px-1 py-3">
                  <span className="font-display flex size-9 shrink-0 items-center justify-center rounded-full bg-moss text-[1.05rem] text-primary-foreground">
                    {k + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium leading-snug text-ink">{r.title}</p>
                      {r.priority === "high" && <LevelPill level="high" prefix="Prioridade" />}
                    </div>
                    <p className="mt-1 text-[0.93rem] leading-relaxed text-ink-soft">{r.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* Warnings */}
        {(analysis.warning || analysis.toxicity) && (
          <div className="rise-in space-y-3" style={stagger(i++)}>
            {analysis.toxicity && (
              <Callout icon={FlaskConical} title="Toxicidade">
                {analysis.toxicity}
              </Callout>
            )}
            {analysis.warning && (
              <Callout icon={AlertTriangle} title="Importante">
                {analysis.warning}
              </Callout>
            )}
          </div>
        )}

        {/* Follow-up questions (interactive answers will come later) */}
        {analysis.needsMoreInformation && analysis.followUpQuestions.length > 0 && (
          <Section title="Precisamos saber mais 🌱" index={i++}>
            <div className="space-y-3 rounded-[1.75rem] bg-[#e9ecdc] p-5">
              <p className="text-[0.93rem] leading-relaxed text-ink-soft">
                A foto sozinha não basta para entender tudo. Pense nestas perguntas — elas ajudam a descobrir a causa:
              </p>
              {analysis.followUpQuestions.map((q, k) => (
                <div key={k} className="rounded-2xl bg-card/80 p-4">
                  <p className="flex gap-2 font-medium text-ink">
                    <CircleHelp className="mt-0.5 size-4 shrink-0 text-moss" />
                    {q.question}
                  </p>
                  {q.options.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {q.options.map((o, j) => (
                        <li key={j} className="rounded-full border border-ink/10 px-3 py-1 text-[0.85rem] text-ink-soft">
                          {o}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Curiosities */}
        {analysis.curiosities.length > 0 && (
          <Section title="Curiosidades" index={i++}>
            <ul className="space-y-3 px-1">
              {analysis.curiosities.map((c, k) => (
                <li key={k} className="flex gap-3 text-[0.96rem] leading-relaxed text-ink/80">
                  <Leaf className="mt-1 size-4 shrink-0 text-sage" />
                  {c}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {actions && (
          <div className="rise-in" style={stagger(i++)}>
            {actions}
          </div>
        )}

        <p className="rise-in px-2 text-center text-[0.8rem] leading-relaxed text-ink-soft/80" style={stagger(i++)}>
          Análise educativa baseada apenas na fotografia — pode conter imprecisões e não substitui a avaliação de
          um agrônomo, botânico ou profissional especializado.
        </p>
      </div>
    </article>
  );
}

function ConfidenceMeter({ value }: { value: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 44 44" className="size-11 -rotate-90" aria-hidden>
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--paper-deep)" strokeWidth="4" />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={value >= 0.55 ? "var(--moss)" : "var(--amber)"}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value)}
        style={{ transition: "stroke-dashoffset 1.2s var(--ease-organic)" }}
      />
    </svg>
  );
}

function LevelPill({ level, prefix }: { level: keyof typeof LEVEL_LABEL; prefix: string }) {
  const tone = {
    high: "bg-[#f2dccf] text-[#7a3519]",
    medium: "bg-[#f3e6c8] text-[#6b4a12]",
    low: "bg-paper-deep text-ink-soft",
  }[level];
  return (
    <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[0.72rem] font-medium whitespace-nowrap", tone)}>
      <span className="sr-only">{prefix}: </span>
      {LEVEL_LABEL[level]}
    </span>
  );
}

function HealthIcon({ status }: { status: PlantAnalysis["health"]["overallStatus"] }) {
  const Icon = { healthy: Leaf, attention: AlertTriangle, possible_problem: AlertTriangle, unknown: CircleHelp }[status];
  return <Icon className="size-4" strokeWidth={2} aria-hidden />;
}

function Callout({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-[1.5rem] border border-clay/20 bg-[#f6ebe3] p-4">
      <Icon className="mt-0.5 size-[1.1rem] shrink-0 text-clay" strokeWidth={1.9} />
      <div>
        <p className="font-medium text-[#6e3218]">{title}</p>
        <p className="mt-1 text-[0.92rem] leading-relaxed text-[#6e3218]/85">{children}</p>
      </div>
    </div>
  );
}
