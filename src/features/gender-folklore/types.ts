export type GenderGuess = "boy" | "girl" | "neutral";

export type FolkloreResultKind = GenderGuess | "mixed";

export interface GenderFolkloreOption {
  text: string;
  guess: GenderGuess;
}

export interface GenderFolkloreQuestion {
  id: number;
  question: string;
  options: GenderFolkloreOption[];
}

export interface GenderFolkloreResult {
  kind: FolkloreResultKind;
  title: string;
  description: string;
  disclaimer: string;
  boyCount: number;
  girlCount: number;
  neutralCount: number;
  boyRatio: number;
}
