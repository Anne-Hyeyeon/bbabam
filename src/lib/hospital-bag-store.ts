/**
 * Boundary module for persisting hospital-bag checks in localStorage,
 * exposed as an external store for useSyncExternalStore.
 */
const STORAGE_KEY = "bbabam:hospital-bag:v1";

const EMPTY: ReadonlySet<string> = new Set();

let cache: ReadonlySet<string> | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): ReadonlySet<string> {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(
      Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [],
    );
  } catch {
    return EMPTY;
  }
}

function write(next: ReadonlySet<string>): void {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    /* storage full or blocked — checks just won't persist */
  }
  listeners.forEach((notify) => notify());
}

export function subscribeCheckedItems(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCheckedItemsSnapshot(): ReadonlySet<string> {
  if (cache === null) cache = readFromStorage();
  return cache;
}

export function getServerCheckedItemsSnapshot(): ReadonlySet<string> {
  return EMPTY;
}

export function toggleCheckedItem(id: string): void {
  const current = getCheckedItemsSnapshot();
  const next = new Set(current);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  write(next);
}

export function clearCheckedItems(): void {
  write(new Set());
}
