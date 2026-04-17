import { STORAGE_KEY } from "./schemaVersion";

export function loadRaw(): unknown | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveRaw(data: unknown): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded or private mode — silently fail
  }
}

export function clearSave(): void {
  localStorage.removeItem(STORAGE_KEY);
}
