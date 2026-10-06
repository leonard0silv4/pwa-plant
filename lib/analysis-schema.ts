import { z } from "zod";

// Single source of truth for the analysis shape: used as the OpenAI Structured Output
// schema, for server-side validation and for the client types.
// Strict structured outputs require every key to be present, so "optional" fields are nullable.

const level = z.enum(["low", "medium", "high"]);

export const plantAnalysisSchema = z.object({
  isPlant: z.boolean().describe("false se a imagem não mostra uma planta reconhecível"),
  imageQuality: z
    .enum(["good", "limited", "poor"])
    .describe("poor = desfocada, escura ou distante demais para analisar"),

  identification: z.object({
    commonName: z.string().describe("Nome popular mais usado no Brasil; vazio se não identificada"),
    scientificName: z.string().describe("Nome científico; vazio se não identificada"),
    family: z.string().nullable(),
    confidence: z.number().min(0).max(1).describe("Confiança honesta da identificação entre 0 e 1"),
    alternatives: z
      .array(z.object({ commonName: z.string(), scientificName: z.string() }))
      .max(3)
      .describe("Espécies parecidas quando há dúvida"),
  }),

  description: z.string().describe("2 a 3 frases sobre a planta"),
  characteristics: z.array(z.string()).max(5),

  health: z.object({
    overallStatus: z.enum(["healthy", "attention", "possible_problem", "unknown"]),
    summary: z.string().describe("1 a 2 frases sobre o que é visível na foto"),
    observations: z.array(z.string()).max(5),
    possibleProblems: z
      .array(
        z.object({
          name: z.string(),
          probability: level,
          explanation: z.string(),
        }),
      )
      .max(4),
  }),

  care: z.object({
    watering: z.string(),
    light: z.string(),
    soil: z.string(),
    temperature: z.string().nullable(),
    humidity: z.string().nullable(),
    fertilization: z.string().nullable(),
  }),

  recommendations: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        priority: level,
      }),
    )
    .max(5),

  curiosities: z.array(z.string()).max(3),
  toxicity: z.string().nullable().describe("Aviso sobre toxicidade para pessoas ou animais, se conhecida"),
  warning: z.string().nullable(),

  needsMoreInformation: z.boolean(),
  followUpQuestions: z
    .array(
      z.object({
        question: z.string(),
        options: z.array(z.string()).max(5),
      }),
    )
    .max(3),
});

export type PlantAnalysis = z.infer<typeof plantAnalysisSchema>;
export type Level = z.infer<typeof level>;
export type HealthStatus = PlantAnalysis["health"]["overallStatus"];

/** Error codes the API returns; the client maps them to friendly copy. */
export type AnalyzeErrorCode =
  | "not_plant"
  | "poor_image"
  | "invalid_input"
  | "too_large"
  | "rate_limited"
  | "timeout"
  | "unavailable";

export type AnalyzeResponse =
  | { ok: true; analysis: PlantAnalysis; requestId: string }
  | { ok: false; error: AnalyzeErrorCode; requestId?: string; retryAfter?: number };
