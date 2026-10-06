import "server-only";

type LogFields = Record<string, string | number | boolean | null | undefined>;

/** One JSON line per event. Never pass image data, prompts or secrets here. */
export function log(event: string, fields: LogFields) {
  console.log(JSON.stringify({ event, ts: new Date().toISOString(), ...fields }));
}
