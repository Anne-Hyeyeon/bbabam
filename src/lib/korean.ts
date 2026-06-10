/** Pure helpers for Korean particle (조사) selection. */

const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;
const JONGSEONG_COUNT = 28;

const hasFinalConsonant = (word: string): boolean | null => {
  const code = word.charCodeAt(word.length - 1);
  if (Number.isNaN(code) || code < HANGUL_BASE || code > HANGUL_LAST) return null;
  return (code - HANGUL_BASE) % JONGSEONG_COUNT !== 0;
};

/** Topic particle: 은 after a final consonant, 는 after a vowel. */
export function topicJosa(word: string): "은" | "는" {
  return hasFinalConsonant(word) ? "은" : "는";
}
