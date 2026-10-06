// Client-side image preparation: validate, downscale and re-encode before upload.

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
/** Generous limit for the raw pick (phones can produce 15MB+ HEIC→JPEG). */
export const MAX_INPUT_BYTES = 25 * 1024 * 1024;
/** Server-side upload limit; compressed images are normally well below it. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const ANALYSIS_MAX_SIDE = 1280;
const THUMB_MAX_SIDE = 360;

export class ImageError extends Error {
  constructor(
    public code: "unsupported" | "too_large" | "decode_failed",
    message: string,
  ) {
    super(message);
  }
}

export interface PreparedImage {
  /** Optimized image sent to the API. */
  blob: Blob;
  /** Small image for local history. */
  thumbnail: Blob;
  width: number;
  height: number;
}

export function validateInput(file: File) {
  // Some Android galleries report an empty type; let decoding decide in that case.
  if (file.type && !file.type.startsWith("image/")) {
    throw new ImageError("unsupported", "Escolha um arquivo de imagem.");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new ImageError("too_large", "Essa imagem é grande demais. Tente outra foto.");
  }
}

async function decode(file: Blob): Promise<ImageBitmap> {
  try {
    // "from-image" applies EXIF orientation so portrait photos stay upright.
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new ImageError(
      "decode_failed",
      "Não conseguimos abrir essa imagem. Tente uma foto em JPEG, PNG ou WebP.",
    );
  }
}

function fit(width: number, height: number, maxSide: number) {
  const scale = Math.min(1, maxSide / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

async function encode(bitmap: ImageBitmap, maxSide: number, quality: number): Promise<Blob> {
  const { width, height } = fit(bitmap.width, bitmap.height, maxSide);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new ImageError("decode_failed", "Seu navegador não conseguiu processar a imagem.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);

  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

  // WebP is smaller at the same quality; Safari < 17 silently falls back to PNG, so check.
  const webp = await toBlob("image/webp");
  if (webp && webp.type === "image/webp") return webp;
  const jpeg = await toBlob("image/jpeg");
  if (!jpeg) throw new ImageError("decode_failed", "Seu navegador não conseguiu processar a imagem.");
  return jpeg;
}

export async function prepareImage(file: File): Promise<PreparedImage> {
  validateInput(file);
  const bitmap = await decode(file);
  try {
    const blob = await encode(bitmap, ANALYSIS_MAX_SIDE, 0.82);
    const thumbnail = await encode(bitmap, THUMB_MAX_SIDE, 0.72);
    if (blob.size > MAX_UPLOAD_BYTES) {
      throw new ImageError("too_large", "Essa imagem é grande demais. Tente outra foto.");
    }
    const { width, height } = fit(bitmap.width, bitmap.height, ANALYSIS_MAX_SIDE);
    return { blob, thumbnail, width, height };
  } finally {
    bitmap.close();
  }
}
