/** Which imagined parenting life an option leans toward. */
export type BalanceSide = "boy" | "girl";

export interface BalanceQuestion {
  question: string;
  options: readonly { text: string; side: BalanceSide }[];
}

export type BalanceKind = "boyLife" | "girlLife" | "allRounder";

export interface BalanceResult {
  kind: BalanceKind;
  title: string;
  description: string;
  boyCount: number;
  girlCount: number;
}
