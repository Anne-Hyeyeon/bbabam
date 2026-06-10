/**
 * Pure helpers for the login-free "임밍아웃카드" share flow.
 * Card data travels entirely in the URL query string: the creator builds a
 * link, the recipient opens it and enters their own name to see the reveal.
 */

export interface CardLinkData {
  templateId: string;
  babyNickname: string;
  gender: "boy" | "girl";
  /** Expected due date as YYYY-MM-DD; omitted when the creator skipped it. */
  dueDate?: string;
}

const DUE_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type SearchParamsObject = Record<string, string | string[] | undefined>;

// Gender is base64-encoded so the surprise isn't spoiled by a readable
// "gender=boy" sitting in the recipient's address bar.
const encodeGender = (gender: CardLinkData["gender"]): string => btoa(gender);

const decodeGender = (value: string): CardLinkData["gender"] | null => {
  try {
    const decoded = atob(value);
    return decoded === "boy" || decoded === "girl" ? decoded : null;
  } catch {
    return null;
  }
};

export function buildCardQuery(data: CardLinkData): string {
  const params = new URLSearchParams({
    template: data.templateId,
    baby: data.babyNickname,
    g: encodeGender(data.gender),
    ...(data.dueDate ? { due: data.dueDate } : {}),
  });
  return params.toString();
}

const firstValue = (value: string | string[] | undefined): string | null => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

export function parseCardQuery(searchParams: SearchParamsObject): CardLinkData | null {
  const templateId = firstValue(searchParams.template);
  const babyNickname = firstValue(searchParams.baby);
  const encodedGender = firstValue(searchParams.g);

  if (!templateId || !babyNickname?.trim() || !encodedGender) return null;

  const gender = decodeGender(encodedGender);
  if (!gender) return null;

  const due = firstValue(searchParams.due);
  const dueDate = due && DUE_DATE_PATTERN.test(due) ? due : undefined;

  return { templateId, babyNickname: babyNickname.trim(), gender, dueDate };
}
