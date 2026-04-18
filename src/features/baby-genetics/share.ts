/**
 * Korean 은/는 조사 helper.
 * 받침 있으면 "은", 없으면 "는".
 * Non-Korean input → "는" (safe default).
 */
export function josaEunNeun(word: string): string {
  if (!word) return "는";
  const last = word.charCodeAt(word.length - 1);
  if (last >= 0xac00 && last <= 0xd7a3) {
    const jong = (last - 0xac00) % 28;
    return jong === 0 ? "는" : "은";
  }
  return "는";
}
