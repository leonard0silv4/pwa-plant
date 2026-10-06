import Link from "next/link";
import { WifiOff } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="flex-1">
      <PageHeader eyebrow="Sem internet" title="Você está sem internet.">
        <p>Conecte-se à internet para ver uma planta nova. As plantas que você já salvou continuam aqui.</p>
      </PageHeader>
      <div className="px-6">
        <div className="flex items-center gap-3 rounded-3xl bg-card p-5 text-sm text-ink-soft">
          <WifiOff className="size-5 text-clay" />
          <Link href="/history" className="font-medium text-moss underline-offset-4 hover:underline">
            Ver minhas plantas
          </Link>
        </div>
      </div>
    </main>
  );
}
