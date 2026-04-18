export interface ChineseGenderInput {
  motherBirthDate: Date;
  conceptionDate: Date;
}

export interface ChineseGenderResult {
  /** 엄마 만나이 (국제 기준). 달력표 조회 키로 사용. */
  motherAge: number;
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  prediction: "boy" | "girl" | null;
  inRange: boolean;
  rawValue: "B" | "G" | null;
}
