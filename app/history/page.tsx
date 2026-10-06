"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { ChevronRight, Sprout, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { deleteAnalysis, listAnalyses, type HistorySummary } from "@/lib/history";
import { useObjectUrl } from "@/lib/use-object-url";

export default function HistoryPage() {
  const [items, setItems] = useState<HistorySummary[] | null>(null);

  useEffect(() => {
    listAnalyses()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  async function remove(id: string) {
    await deleteAnalysis(id);
    setItems((list) => list?.filter((i) => i.id !== id) ?? null);
  }

  return (
    <main className="flex-1">
      <title>Histórico · FloraScan</title>
      <PageHeader eyebrow="Histórico" title="Minhas plantas">
        {items && items.length > 0 && (
          <p>
            {items.length} {items.length === 1 ? "planta analisada" : "plantas analisadas"}, guardadas só neste
            celular.
          </p>
        )}
      </PageHeader>

      <div className="px-5">
        {items === null ? (
          <ul className="space-y-3">
            {[0, 1, 2].map((i) => (
              <li key={i} className="h-24 animate-pulse rounded-[1.6rem] bg-paper-deep/70" />
            ))}
          </ul>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-3">
            {items.map((item, i) => (
              <HistoryRow key={item.id} item={item} index={i} onDelete={() => remove(item.id)} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function HistoryRow({ item, index, onDelete }: { item: HistorySummary; index: number; onDelete: () => void }) {
  const url = useObjectUrl(item.thumbnail);
  const date = new Date(item.createdAt);
  const name = item.commonName || item.scientificName || "Planta não identificada";

  return (
    <li className="rise-in group relative" style={{ "--i": Math.min(index, 8) } as CSSProperties}>
      <Link
        href={`/analysis?id=${item.id}`}
        className="pressable flex items-center gap-4 rounded-[1.6rem] bg-card p-2.5 pr-12 ring-1 ring-ink/[0.04] hover:ring-ink/10"
      >
        <span className="size-[4.75rem] shrink-0 overflow-hidden rounded-[1.25rem] bg-paper-deep">
          {url && (
            // eslint-disable-next-line @next/next/no-img-element -- local blob URL
            <img src={url} alt="" className="size-full object-cover" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-display block truncate text-[1.25rem] leading-tight font-[440] text-ink">{name}</span>
          {item.scientificName && item.commonName && (
            <span className="block truncate text-sm text-ink-soft italic">{item.scientificName}</span>
          )}
          <span className="label-mono mt-1.5 block text-ink-soft/70">
            {date.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
          </span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-ink-soft/50" />
      </Link>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Apagar análise de ${name}`}
        className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-full text-ink-soft/50 transition-colors hover:bg-paper-deep hover:text-clay"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="rise-in flex flex-col items-center rounded-[2rem] border border-dashed border-ink/15 px-6 py-12 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-paper-deep text-moss">
        <Sprout className="size-6" strokeWidth={1.6} />
      </span>
      <p className="font-display mt-4 text-xl font-[440]">Nenhuma planta ainda</p>
      <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-ink-soft">
        As plantas que você analisar aparecem aqui. Elas ficam guardadas só neste celular.
      </p>
      <Link
        href="/"
        className="pressable mt-6 rounded-full bg-moss px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-moss-deep"
      >
        Identificar uma planta
      </Link>
    </div>
  );
}
