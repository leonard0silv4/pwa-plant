"use client";

import { WifiOff } from "lucide-react";
import { useOnline } from "@/lib/use-online";

export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-ink px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] text-xs text-paper"
    >
      <WifiOff className="size-3.5" />
      Você está sem internet. Suas plantas salvas continuam aqui.
    </div>
  );
}
