import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import {
  plantAnalysisSchema,
  type AnalyzeErrorCode,
  type AnalyzeResponse,
} from "@/lib/analysis-schema";
import { SYSTEM_PROMPT, USER_PROMPT } from "@/lib/prompt";
import { log } from "@/lib/server/logger";
import { checkRateLimit, clientIp, refundRateLimit } from "@/lib/server/rate-limit";
import { MAX_UPLOAD_BYTES, sniffImageType } from "@/lib/server/upload";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";
const OPENAI_TIMEOUT_MS = 45_000;
// Includes reasoning tokens; the visible JSON is usually ~1–1.5k tokens.
const MAX_OUTPUT_TOKENS = 4_000;

let client: OpenAI | null = null;
function getClient() {
  client ??= new OpenAI({ timeout: OPENAI_TIMEOUT_MS, maxRetries: 1 });
  return client;
}

const STATUS: Record<AnalyzeErrorCode, number> = {
  not_plant: 200,
  poor_image: 200,
  invalid_input: 400,
  too_large: 413,
  rate_limited: 429,
  timeout: 504,
  unavailable: 503,
};

function fail(error: AnalyzeErrorCode, requestId: string, headers?: HeadersInit, extra?: object) {
  const body: AnalyzeResponse = { ok: false, error, requestId, ...extra };
  return Response.json(body, { status: STATUS[error], headers });
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const started = Date.now();
  const done = (status: string, fields: Record<string, string | number | null | undefined> = {}) =>
    log("analyze", { requestId, status, model: MODEL, ms: Date.now() - started, ...fields });

  // Only accept same-origin browser calls (blocks casual cross-site embedding of the API).
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    done("rejected", { error: "cross_origin" });
    return fail("invalid_input", requestId);
  }

  // Reject oversized bodies before reading them (multipart overhead is small).
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_UPLOAD_BYTES + 64 * 1024) {
    done("rejected", { error: "too_large", bytes: declaredLength });
    return fail("too_large", requestId);
  }

  let file: File;
  try {
    const form = await request.formData();
    const entry = form.get("image");
    if (!(entry instanceof File)) throw new Error("missing image");
    file = entry;
  } catch {
    done("rejected", { error: "invalid_form" });
    return fail("invalid_input", requestId);
  }

  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
    done("rejected", { error: "too_large", bytes: file.size });
    return fail(file.size === 0 ? "invalid_input" : "too_large", requestId);
  }

  // The buffer only lives in memory for this request; nothing is written to disk.
  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = sniffImageType(bytes);
  if (!mime) {
    done("rejected", { error: "unsupported_type", declared: file.type });
    return fail("invalid_input", requestId);
  }
  const ip = clientIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    done("rate_limited", { retryAfter: limit.retryAfter });
    return fail("rate_limited", requestId, { "Retry-After": String(limit.retryAfter) }, {
      retryAfter: limit.retryAfter,
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    refundRateLimit(ip);
    done("misconfigured", { error: "missing OPENAI_API_KEY" });
    return fail("unavailable", requestId);
  }

  const dataUrl = `data:${mime};base64,${Buffer.from(bytes).toString("base64")}`;

  try {
    const response = await getClient().responses.parse(
      {
        model: MODEL,
        instructions: SYSTEM_PROMPT,
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: USER_PROMPT },
              { type: "input_image", image_url: dataUrl, detail: "high" },
            ],
          },
        ],
        text: { format: zodTextFormat(plantAnalysisSchema, "plant_analysis") },
        reasoning: { effort: "low" },
        max_output_tokens: MAX_OUTPUT_TOKENS,
        store: false,
      },
      { signal: request.signal },
    );

    const usage = {
      input_tokens: response.usage?.input_tokens,
      output_tokens: response.usage?.output_tokens,
      total_tokens: response.usage?.total_tokens,
      bytes: file.size,
    };

    const analysis = response.output_parsed;
    if (!analysis) {
      refundRateLimit(ip);
      done("no_output", { ...usage, error: response.incomplete_details?.reason ?? response.status });
      return fail("unavailable", requestId);
    }

    if (!analysis.isPlant) {
      done("not_plant", usage);
      return fail("not_plant", requestId);
    }
    if (analysis.imageQuality === "poor" && !analysis.identification.commonName) {
      done("poor_image", usage);
      return fail("poor_image", requestId);
    }

    done("ok", usage);
    const body: AnalyzeResponse = { ok: true, analysis, requestId };
    return Response.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof OpenAI.APIConnectionTimeoutError) {
      refundRateLimit(ip);
      done("timeout", { error: "openai_timeout" });
      return fail("timeout", requestId);
    }
    if (err instanceof OpenAI.APIUserAbortError) {
      // No refund: the model may already have consumed tokens.
      done("aborted");
      return fail("unavailable", requestId);
    }
    if (err instanceof OpenAI.APIError) {
      refundRateLimit(ip);
      // Log only the status and code — never the request payload.
      done("openai_error", { error: `${err.status ?? "?"} ${err.code ?? err.type ?? ""}`.trim() });
      return fail("unavailable", requestId);
    }
    refundRateLimit(ip);
    done("error", { error: err instanceof Error ? err.name : "unknown" });
    return fail("unavailable", requestId);
  }
}
