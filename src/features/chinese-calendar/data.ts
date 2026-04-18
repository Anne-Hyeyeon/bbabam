import solarLunar from "solarlunar";
import type { ChineseGenderInput, ChineseGenderResult } from "./types";

export const CHINESE_CALENDAR_META = {
  title: "황실 성별 달력",
  subtitle: "청나라 황실의 비밀 달력",
  description:
    "엄마의 음력 만나이와 임신한 달(음력)로 아들·딸을 점쳐본다는 전통 달력.",
  disclaimer:
    "재미로만 봐주세요! 과학적 근거는 없고, 실제 정확도는 동전 던지기 수준이에요. 정확한 성별은 초음파 검사로 확인하세요.",
} as const;

/**
 * 황실 성별 달력 표 (blog.naver.com/woolwe 버전 기준).
 * 행: 엄마 음력 만나이 (18~45세)
 * 열: 임신한 달 (음력 1~12월)
 * 값: "B" = 아들, "G" = 딸
 */
export const CHINESE_GENDER_TABLE: Record<number, ("B" | "G")[]> = {
  //   1월  2월  3월  4월  5월  6월  7월  8월  9월 10월 11월 12월
  18: ["G", "B", "G", "B", "B", "B", "B", "B", "B", "B", "B", "B"],
  19: ["B", "G", "B", "G", "B", "B", "B", "B", "G", "G", "G", "B"],
  20: ["G", "B", "G", "B", "G", "B", "B", "G", "G", "B", "G", "G"],
  21: ["B", "G", "B", "G", "G", "G", "B", "G", "B", "B", "B", "G"],
  22: ["B", "B", "B", "B", "B", "G", "G", "B", "G", "G", "G", "B"],
  23: ["B", "G", "B", "B", "B", "B", "G", "G", "G", "G", "G", "G"],
  24: ["B", "B", "G", "G", "G", "G", "B", "B", "G", "B", "G", "G"],
  25: ["G", "G", "B", "B", "G", "G", "G", "B", "B", "G", "G", "B"],
  26: ["B", "B", "B", "G", "B", "G", "G", "G", "G", "B", "B", "B"],
  27: ["G", "G", "G", "B", "B", "G", "G", "G", "B", "G", "G", "B"],
  28: ["B", "B", "B", "G", "G", "B", "B", "B", "G", "G", "G", "G"],
  29: ["G", "G", "G", "B", "G", "G", "G", "B", "G", "G", "G", "G"],
  30: ["B", "B", "G", "G", "B", "B", "B", "G", "B", "G", "G", "B"],
  31: ["B", "G", "B", "B", "B", "G", "G", "B", "G", "G", "G", "B"],
  32: ["B", "B", "B", "G", "G", "B", "G", "G", "B", "G", "G", "B"],
  33: ["G", "G", "B", "B", "G", "B", "B", "B", "G", "G", "G", "G"],
  34: ["B", "B", "B", "G", "B", "G", "B", "G", "B", "G", "G", "B"],
  35: ["B", "G", "B", "B", "B", "B", "G", "B", "G", "G", "G", "G"],
  36: ["G", "B", "B", "G", "B", "G", "G", "G", "B", "G", "G", "B"],
  37: ["B", "G", "B", "B", "B", "G", "B", "B", "G", "G", "G", "B"],
  38: ["G", "B", "G", "G", "B", "B", "B", "G", "B", "G", "G", "B"],
  39: ["B", "G", "B", "B", "B", "B", "G", "B", "G", "B", "G", "G"],
  40: ["G", "B", "G", "G", "B", "G", "B", "G", "B", "B", "G", "B"],
  41: ["B", "G", "B", "B", "G", "B", "G", "B", "G", "G", "B", "G"],
  42: ["G", "B", "G", "G", "B", "G", "B", "G", "B", "G", "G", "B"],
  43: ["B", "G", "B", "B", "G", "B", "G", "B", "G", "G", "B", "G"],
  44: ["B", "B", "G", "G", "B", "G", "B", "G", "B", "G", "B", "B"],
  45: ["G", "B", "B", "B", "G", "B", "G", "G", "G", "G", "B", "G"],
};

export const AGE_RANGE = { min: 18, max: 45 };
export const MONTH_RANGE = { min: 1, max: 12 };

/**
 * 양력 → 음력 변환 (solarlunar 사용).
 * 지원 범위를 벗어나면 null 반환.
 */
function toLunar(date: Date) {
  const r = solarLunar.solar2lunar(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  if (r === -1) return null;
  return r;
}

/**
 * 음력 기준 만나이 — 두 날짜 모두 음력으로 변환 후, 생일(음력)이
 * 지났는지로 보정.
 */
function calcLunarAge(
  birth: ReturnType<typeof toLunar>,
  ref: ReturnType<typeof toLunar>,
): number {
  if (!birth || !ref) return 0;
  let age = ref.lYear - birth.lYear;
  const hadBirthday =
    ref.lMonth > birth.lMonth ||
    (ref.lMonth === birth.lMonth && ref.lDay >= birth.lDay);
  if (!hadBirthday) age -= 1;
  return age;
}

export function predictChineseGender(
  input: ChineseGenderInput,
): ChineseGenderResult {
  const birthLunar = toLunar(input.motherBirthDate);
  const conceptionLunar = toLunar(input.conceptionDate);

  if (!birthLunar || !conceptionLunar) {
    return {
      motherAge: 0,
      lunarYear: 0,
      lunarMonth: 0,
      lunarDay: 0,
      isLeapMonth: false,
      prediction: null,
      inRange: false,
      rawValue: null,
    };
  }

  const motherAge = calcLunarAge(birthLunar, conceptionLunar);
  const lunarMonth = conceptionLunar.lMonth;

  const row = CHINESE_GENDER_TABLE[motherAge];
  const base = {
    motherAge,
    lunarYear: conceptionLunar.lYear,
    lunarMonth,
    lunarDay: conceptionLunar.lDay,
    isLeapMonth: Boolean(conceptionLunar.isLeap),
  };

  if (!row) {
    return { ...base, prediction: null, inRange: false, rawValue: null };
  }
  const raw = row[lunarMonth - 1];
  return {
    ...base,
    prediction: raw === "B" ? "boy" : "girl",
    inRange: true,
    rawValue: raw,
  };
}

export const CHINESE_CALENDAR_FACTS = [
  {
    title: "달력의 역사",
    content:
      "약 700년 전 청나라 황실 무덤에서 발견됐다고 전해져요. 원본은 베이징 과학원 도서관에 보관돼 있다는 이야기도 있어요.",
  },
  {
    title: "왜 음력 만나이인가요?",
    content:
      "전통적인 황실 달력은 세는나이(태어난 해부터 1살)를 썼지만, 요즘 기준엔 어색해서 빠밤은 엄마 생년월일과 수정일을 모두 음력으로 바꿔 만나이로 계산해요.",
  },
  {
    title: "왜 음력 월인가요?",
    content:
      "청나라 시대 기준이라 음력을 써요. 양력 1~2월이 전년도 음력 12월일 때도 있지만, 빠밤은 실제 음력으로 자동 변환해드려요.",
  },
  {
    title: "실제 정확도는?",
    content:
      "여러 연구에서 정확도는 약 50% — 동전 던지기 수준이에요. 순수 재미용이니 가볍게 즐겨주세요!",
  },
];
