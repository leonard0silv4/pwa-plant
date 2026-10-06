// Local-only analysis history (IndexedDB). Only a small thumbnail is stored, never the original photo.
import type { PlantAnalysis } from "@/lib/analysis-schema";

export interface HistoryEntry {
  id: string;
  createdAt: number;
  commonName: string;
  scientificName: string;
  thumbnail: Blob;
  analysis: PlantAnalysis;
}

export type HistorySummary = Omit<HistoryEntry, "analysis">;

const DB_NAME = "pwa-plant";
const DB_VERSION = 1;
const STORE = "analyses";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore(STORE, { keyPath: "id" });
      store.createIndex("createdAt", "createdAt");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error);
    };
  });
  return dbPromise;
}

function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = fn(tx.objectStore(STORE));
        tx.oncomplete = () => resolve(req.result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      }),
  );
}

export async function saveAnalysis(analysis: PlantAnalysis, thumbnail: Blob): Promise<string> {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    commonName: analysis.identification.commonName,
    scientificName: analysis.identification.scientificName,
    thumbnail,
    analysis,
  };
  await run("readwrite", (s) => s.put(entry));
  return entry.id;
}

export async function listAnalyses(): Promise<HistorySummary[]> {
  const all = await run<HistoryEntry[]>("readonly", (s) => s.getAll());
  return all
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(({ id, createdAt, commonName, scientificName, thumbnail }) => ({
      id,
      createdAt,
      commonName,
      scientificName,
      thumbnail,
    }));
}

export function getAnalysis(id: string): Promise<HistoryEntry | undefined> {
  return run<HistoryEntry | undefined>("readonly", (s) => s.get(id));
}

export async function deleteAnalysis(id: string): Promise<void> {
  await run("readwrite", (s) => s.delete(id));
}
