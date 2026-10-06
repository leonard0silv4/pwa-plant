"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AnalysisResult } from "@/components/result/AnalysisResult";
import { getAnalysis, type HistoryEntry } from "@/lib/history";
import { useObjectUrl } from "@/lib/use-object-url";

export function SavedAnalysis() {
  const id = useSearchParams().get("id");
  const [entry, setEntry] = useState<HistoryEntry | null | undefined>(undefined);
  const photoUrl = useObjectUrl(entry?.thumbnail);

  useEffect(() => {
    if (!id) return;
    getAnalysis(id)
      .then((e) => setEntry(e ?? null))
      .catch(() => setEntry(null));
  }, [id]);

  if (!id || entry === null) {
    return (
      <main className="flex-1">
        <PageHeader eyebrow="Sua planta" title="A gente não achou essa planta">
          <p>Ela pode ter sido apagada deste celular.</p>
        </PageHeader>
        <div className="px-6">
          <Link href="/history" className="font-medium text-moss underline-offset-4 hover:underline">
            Ver minhas plantas
          </Link>
        </div>
      </main>
    );
  }

  if (!entry || !photoUrl) return <div className="aspect-[4/5] max-h-[68dvh] animate-pulse rounded-b-[2.5rem] bg-paper-deep" />;

  return (
    <div className="relative">
      <Link
        href="/history"
        aria-label="Voltar para o histórico"
        className="pressable absolute top-[max(1rem,env(safe-area-inset-top))] left-4 z-10 flex size-10 items-center justify-center rounded-full bg-paper/85 text-ink backdrop-blur"
      >
        <ArrowLeft className="size-[1.1rem]" />
      </Link>
      <AnalysisResult analysis={entry.analysis} photoUrl={photoUrl} date={new Date(entry.createdAt)} />
    </div>
  );
}
