// Web Share / Clipboard side-effect boundary.
// Pages build their own share text (pure) and hand it here.

export type ShareOutcome = "shared" | "copied" | "unsupported";

export interface SharePayload {
  title: string;
  text: string;
}

export function currentPageUrl(fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return `${window.location.origin}${window.location.pathname}`;
}

export async function shareOrCopy({ title, text }: SharePayload): Promise<ShareOutcome> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text });
      return "shared";
    } catch {
      /* user cancelled — fall through to clipboard */
    }
  }
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return "copied";
  }
  return "unsupported";
}
