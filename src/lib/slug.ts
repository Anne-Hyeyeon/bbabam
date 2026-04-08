import { nanoid } from "nanoid";

export function generateSlug(): string {
  return nanoid(12);
}

export function generateManagementToken(): string {
  return nanoid(32);
}
