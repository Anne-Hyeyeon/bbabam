// Client-side API boundary for card creation.

export interface CardCreateRequest {
  templateId: string;
  babyNickname: string;
  gender: "boy" | "girl";
  recipientMode: "preset" | "input";
  recipientName?: string;
  ogMode: "default" | "fake-surprise";
  ultrasoundImageUrl?: string;
}

export interface CreatedCard {
  id: string;
  slug: string;
}

export async function uploadUltrasound(file: File): Promise<string | undefined> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  return data.url;
}

export async function createCard(request: CardCreateRequest): Promise<CreatedCard> {
  const res = await fetch("/api/cards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return res.json();
}
