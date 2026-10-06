"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-plant:install-dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIosSafari() {
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  return ios && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

/** Discreet install card: native prompt on Android/Chromium, short instructions on iOS Safari. */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<"android" | "ios" | null>(null);

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISS_KEY)) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setMode("android");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // iOS never fires beforeinstallprompt; show instructions after a short delay.
    const iosTimer = isIosSafari() ? setTimeout(() => setMode("ios"), 2500) : undefined;

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      clearTimeout(iosTimer);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setMode(null);
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    if (outcome === "accepted") setMode(null);
    else dismiss();
  }

  if (!mode) return null;

  return (
    <div className="rise-in mt-8 flex items-center gap-3 rounded-[1.4rem] bg-card/90 p-3 pl-4 ring-1 ring-ink/[0.05]">
      <div className="min-w-0 flex-1 text-sm leading-snug">
        <p className="font-medium text-ink">Leve o FloraScan com você</p>
        {mode === "ios" ? (
          <p className="mt-0.5 text-ink-soft">
            Toque em <Share className="mb-0.5 inline size-3.5" aria-label="Compartilhar" /> e depois em{" "}
            <span className="text-ink">Adicionar à Tela de Início</span>.
          </p>
        ) : (
          <p className="mt-0.5 text-ink-soft">Instale e abra direto da tela inicial.</p>
        )}
      </div>
      {mode === "android" && (
        <button
          type="button"
          onClick={install}
          className="pressable flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-paper"
        >
          <Download className="size-4" />
          Instalar
        </button>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dispensar"
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-paper-deep"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
