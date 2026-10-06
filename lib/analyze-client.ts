import type { AnalyzeErrorCode, AnalyzeResponse, PlantAnalysis } from "@/lib/analysis-schema";

export class AnalyzeError extends Error {
  constructor(
    public code: AnalyzeErrorCode,
    public retryAfter?: number,
  ) {
    super(code);
  }
}

const CLIENT_TIMEOUT_MS = 70_000;

export async function analyzePlant(image: Blob, signal?: AbortSignal): Promise<PlantAnalysis> {
  if (typeof navigator !== "undefined" && !navigator.onLine) throw new AnalyzeError("unavailable");

  const form = new FormData();
  const ext = image.type === "image/webp" ? "webp" : "jpg";
  form.append("image", image, `plant.${ext}`);

  let res: Response;
  try {
    res = await fetch("/api/analyze", {
      method: "POST",
      body: form,
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(CLIENT_TIMEOUT_MS)])
        : AbortSignal.timeout(CLIENT_TIMEOUT_MS),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    if (err instanceof DOMException && err.name === "TimeoutError") throw new AnalyzeError("timeout");
    throw new AnalyzeError("unavailable");
  }

  let body: AnalyzeResponse;
  try {
    body = await res.json();
  } catch {
    throw new AnalyzeError(res.status === 413 ? "too_large" : "unavailable");
  }
  if (!body.ok) throw new AnalyzeError(body.error, body.retryAfter);
  return body.analysis;
}
