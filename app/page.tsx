"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { PhotoPreview } from "@/components/capture/PhotoPreview";
import { useImagePicker } from "@/components/capture/useImagePicker";
import { Hero } from "@/components/home/Hero";
import { Notice } from "@/components/Notice";
import { AnalysisError } from "@/components/result/AnalysisError";
import { AnalysisResult } from "@/components/result/AnalysisResult";
import { PlantScanner, type ScannerPhase } from "@/components/scanner/PlantScanner";
import type { AnalyzeErrorCode, PlantAnalysis } from "@/lib/analysis-schema";
import { AnalyzeError, analyzePlant } from "@/lib/analyze-client";
import { ImageError, prepareImage, type PreparedImage } from "@/lib/image";
import { useOnline } from "@/lib/use-online";

type Photo = PreparedImage & { url: string };

type View =
  | { step: "pick" }
  | { step: "preview" }
  | { step: "scan"; phase: ScannerPhase; doneLabel: string | null }
  | { step: "result"; analysis: PlantAnalysis }
  | { step: "error"; code: AnalyzeErrorCode; retryAfter?: number };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function HomePage() {
  const online = useOnline();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [view, setView] = useState<View>({ step: "pick" });
  const [preparing, setPreparing] = useState(false);
  const [pickError, setPickError] = useState<string | null>(null);
  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => () => void (photo && URL.revokeObjectURL(photo.url)), [photo]);
  useEffect(() => () => inFlight.current?.abort(), []);

  const picker = useImagePicker(async (file) => {
    setPickError(null);
    setPreparing(true);
    try {
      const prepared = await prepareImage(file);
      setPhoto({ ...prepared, url: URL.createObjectURL(prepared.blob) });
      setView({ step: "preview" });
    } catch (err) {
      setPickError(err instanceof ImageError ? err.message : "Não conseguimos abrir essa imagem.");
      setView({ step: "pick" });
    } finally {
      setPreparing(false);
    }
  });

  async function analyze() {
    if (!photo || inFlight.current) return;
    const controller = new AbortController();
    inFlight.current = controller;
    setView({ step: "scan", phase: "scanning", doneLabel: null });
    window.scrollTo({ top: 0 });

    try {
      const analysis = await analyzePlant(photo.blob, controller.signal);
      const identified = Boolean(analysis.identification.commonName);

      // Scanner → slows and fades → photo returns to normal → short confirmation → result.
      const fast = reducedMotion();
      setView({
        step: "scan",
        phase: "finishing",
        doneLabel: identified ? "Planta identificada" : null,
      });
      await wait(fast ? 50 : 650);
      setView((v) => (v.step === "scan" ? { ...v, phase: "done" } : v));
      await wait(fast ? 300 : identified ? 900 : 400);

      setView({ step: "result", analysis });
      window.scrollTo({ top: 0 });
    } catch (err) {
      if (controller.signal.aborted) return;
      setView({ step: "scan", phase: "finishing", doneLabel: null });
      await wait(reducedMotion() ? 50 : 600);
      setView(
        err instanceof AnalyzeError
          ? { step: "error", code: err.code, retryAfter: err.retryAfter }
          : { step: "error", code: "unavailable" },
      );
    } finally {
      inFlight.current = null;
    }
  }

  function startOver(open?: "camera" | "gallery") {
    inFlight.current?.abort();
    inFlight.current = null;
    setPhoto(null);
    setView({ step: "pick" });
    if (open === "camera") picker.openCamera();
    if (open === "gallery") picker.openGallery();
  }

  return (
    <>
      {picker.inputs}

      {view.step === "pick" || !photo ? (
        <>
          <Hero onCamera={picker.openCamera} onGallery={picker.openGallery} disabled={preparing} />
          {pickError && (
            <div className="px-6 pt-4">
              <Notice title="Ops, essa imagem não funcionou">{pickError}</Notice>
            </div>
          )}
        </>
      ) : view.step === "preview" ? (
        <PhotoPreview
          src={photo.url}
          offline={!online}
          onAnalyze={analyze}
          onRetake={() => startOver("gallery")}
        />
      ) : view.step === "scan" ? (
        <PlantScanner src={photo.url} phase={view.phase} doneLabel={view.doneLabel} />
      ) : view.step === "error" ? (
        <AnalysisError
          code={view.code}
          retryAfter={view.retryAfter}
          photoUrl={photo.url}
          onRetry={analyze}
          onNewPhoto={() => startOver("camera")}
        />
      ) : (
        <AnalysisResult
          analysis={view.analysis}
          photoUrl={photo.url}
          actions={
            <button
              type="button"
              onClick={() => startOver("camera")}
              className="pressable flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-ink text-[1.02rem] font-medium text-paper hover:bg-ink/90"
            >
              <Camera className="size-5" strokeWidth={1.8} />
              Analisar outra planta
            </button>
          }
        />
      )}
    </>
  );
}
