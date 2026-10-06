import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Histórico" };

export default function HistoryPage() {
  return (
    <main className="flex-1">
      <PageHeader eyebrow="Histórico" title="Minhas análises" />
    </main>
  );
}
