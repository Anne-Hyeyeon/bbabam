export type YesNo = "yes" | "no";
export type Personality = "introvert" | "extrovert" | "ambivert";

export interface ParentTraits {
  heightCm: number;
  doubleEyelid: "yes" | "no" | "inner";
  hair: "curly" | "wavy" | "straight";
  dimples: YesNo;
  bloodType: "A" | "B" | "O" | "AB";
  personality: Personality;
  /** 친할아버지 (only asked on father side) */
  paternalGrandfatherBald?: YesNo;
  /** 외할아버지 (only asked on mother side) */
  maternalGrandfatherBald?: YesNo;
}

export type BabySex = "boy" | "girl" | "unknown";

export interface BabyGeneticsInput {
  father: ParentTraits;
  mother: ParentTraits;
  babySex: BabySex;
}

export interface BabyGeneticsResult {
  estimatedHeight: { min: number; max: number };
  doubleEyelidProb: number;
  hairType: string;
  dimplesProb: number;
  possibleBloodTypes: { type: string; prob: number }[];
  baldnessProb: { prob: number; note: string };
  personalityTendency: { label: string; note: string };
  resemblance: string;
}

export interface HeredityCulprit {
  trait: string;
  culprit: string;
  detail: string;
  emoji?: string;
}
