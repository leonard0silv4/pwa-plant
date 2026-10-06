import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function NotFound() {
  return (
    <main className="flex-1">
      <PageHeader eyebrow="404" title="Essa página não brotou.">
        <p>Esse endereço está errado ou a página não existe mais.</p>
      </PageHeader>
      <div className="px-6">
        <Link
          href="/"
          className="pressable inline-flex rounded-full bg-moss px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-moss-deep"
        >
          Identificar uma planta
        </Link>
      </div>
    </main>
  );
}
