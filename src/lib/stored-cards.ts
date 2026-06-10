// localStorage boundary for locally-created card ids.

const STORAGE_KEY = "bbabam_cards";

const appendId = (ids: string[], id: string): string[] => [...ids, id];

export function readStoredCardIds(): string[] {
  const raw = localStorage.getItem(STORAGE_KEY) ?? "[]";
  return JSON.parse(raw);
}

export function rememberCardId(id: string): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appendId(readStoredCardIds(), id)));
}
