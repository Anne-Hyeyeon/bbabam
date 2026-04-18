export type MBTIAxis = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export type MBTIType =
  | "ISTJ" | "ISFJ" | "INFJ" | "INTJ"
  | "ISTP" | "ISFP" | "INFP" | "INTP"
  | "ESTP" | "ESFP" | "ENFP" | "ENTP"
  | "ESTJ" | "ESFJ" | "ENFJ" | "ENTJ";

export interface MBTIQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    type: MBTIAxis;
  }[];
}

export interface MBTIResult {
  type: MBTIType;
  title: string;
  tagline: string;
  strength: string;
  caution: string;
  match: {
    type: MBTIType;
    reason: string;
  };
  items: string[];
  shareCopy: string;
}
