import type {
  BabyGeneticsInput,
  BabyGeneticsResult,
  HeredityCulprit,
  ParentTraits,
} from "./types";

export const BABY_GENETICS_META = {
  title: "아기 유전자 예상",
  subtitle: "우리 아기, 누굴 더 닮을까?",
  description: "단순 유전 법칙으로 아기 외모와 기질을 상상해봐요",
  disclaimer:
    "재미로 보는 결과예요. 실제 유전은 수천 개 유전자와 환경이 복합적으로 작용해서 훨씬 복잡해요.",
} as const;

export const PARENT_TRAIT_OPTIONS = {
  doubleEyelid: [
    { value: "yes", label: "있음" },
    { value: "no", label: "없음" },
    { value: "inner", label: "속쌍꺼풀" },
  ],
  hair: [
    { value: "curly", label: "곱슬" },
    { value: "wavy", label: "반곱슬" },
    { value: "straight", label: "직모" },
  ],
  dimples: [
    { value: "yes", label: "있음" },
    { value: "no", label: "없음" },
  ],
  bloodType: [
    { value: "A", label: "A형" },
    { value: "B", label: "B형" },
    { value: "O", label: "O형" },
    { value: "AB", label: "AB형" },
  ],
  personality: [
    { value: "introvert", label: "내향적" },
    { value: "extrovert", label: "외향적" },
    { value: "ambivert", label: "중간" },
  ],
  grandfatherBald: [
    { value: "no", label: "아니요" },
    { value: "yes", label: "네" },
  ],
} as const;

/**
 * 키 예측 (median parent 방식)
 * 아들: (아빠 + 엄마 + 13) / 2
 * 딸:   (아빠 + 엄마 - 13) / 2
 */
function predictHeight(
  father: number,
  mother: number,
  sex: "boy" | "girl" | "unknown",
): { min: number; max: number } {
  const mid =
    sex === "boy"
      ? (father + mother + 13) / 2
      : sex === "girl"
      ? (father + mother - 13) / 2
      : (father + mother) / 2;
  return { min: Math.round(mid - 5), max: Math.round(mid + 5) };
}

/** 쌍꺼풀 (우성: 쌍꺼풀) */
function predictDoubleEyelid(
  f: ParentTraits["doubleEyelid"],
  m: ParentTraits["doubleEyelid"],
): number {
  const hasF = f === "yes";
  const hasM = m === "yes";
  if (hasF && hasM) return 75;
  if (hasF || hasM) return 50;
  if (f === "inner" || m === "inner") return 30;
  return 10;
}

/** 머리카락 타입 (우성: 곱슬 > 반곱슬 > 직모) */
function predictHairType(
  f: ParentTraits["hair"],
  m: ParentTraits["hair"],
): string {
  const weight = { curly: 3, wavy: 2, straight: 1 } as const;
  const avg = (weight[f] + weight[m]) / 2;
  if (avg >= 2.5) return "곱슬머리 가능성 높음";
  if (avg >= 1.5) return "반곱슬이 될 가능성";
  return "직모 가능성 높음";
}

/** 보조개 (우성: 있음) */
function predictDimples(
  f: ParentTraits["dimples"],
  m: ParentTraits["dimples"],
): number {
  if (f === "yes" && m === "yes") return 75;
  if (f === "yes" || m === "yes") return 50;
  return 5;
}

/**
 * 혈액형 ABO 확률 계산.
 * A → AA/AO 50:50, B → BB/BO 50:50 로 가정.
 */
function predictBloodType(
  f: ParentTraits["bloodType"],
  m: ParentTraits["bloodType"],
): { type: string; prob: number }[] {
  const genotypes: Record<ParentTraits["bloodType"], string[]> = {
    A: ["AA", "AO"],
    B: ["BB", "BO"],
    O: ["OO"],
    AB: ["AB"],
  };

  const fGenos = genotypes[f];
  const mGenos = genotypes[m];

  const childCounts: Record<string, number> = { A: 0, B: 0, O: 0, AB: 0 };
  let total = 0;

  for (const fg of fGenos) {
    for (const mg of mGenos) {
      for (const fa of fg) {
        for (const ma of mg) {
          total++;
          const alleles = [fa, ma].sort().join("");
          let phenotype: string;
          if (alleles === "AB" || alleles === "BA") phenotype = "AB";
          else if (alleles.includes("A")) phenotype = "A";
          else if (alleles.includes("B")) phenotype = "B";
          else phenotype = "O";
          childCounts[phenotype]++;
        }
      }
    }
  }

  return Object.entries(childCounts)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => ({
      type: type + "형",
      prob: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.prob - a.prob);
}

/**
 * 대머리 확률.
 * 주 원인 유전자(AR)는 X 염색체 — 외할아버지 영향이 큼.
 * 상염색체 요인도 있어 친할아버지도 반영.
 * 딸은 여성형 탈모 발생률이 훨씬 낮아 계수를 낮춘다.
 */
function predictBaldness(
  paternalBald: ParentTraits["paternalGrandfatherBald"],
  maternalBald: ParentTraits["maternalGrandfatherBald"],
  sex: "boy" | "girl" | "unknown",
): { prob: number; note: string } {
  const p = paternalBald === "yes";
  const m = maternalBald === "yes";

  let base: number;
  let note: string;
  if (p && m) {
    base = 70;
    note = "양가 할아버지 모두 영향 — 주기적 관리 권장";
  } else if (m) {
    base = 55;
    note = "외할아버지 영향 (X 염색체 유전)이 가장 강해요";
  } else if (p) {
    base = 35;
    note = "친할아버지 쪽 상염색체 영향";
  } else {
    base = 15;
    note = "특별한 유전 위험 신호는 적어요";
  }

  const prob =
    sex === "girl" ? Math.round(base * 0.2) : sex === "boy" ? base : Math.round(base * 0.7);
  return { prob, note };
}

/**
 * 성격 경향 — 유전 50% + 환경 50% 전제하에 부모 기질로 러프하게 매칭.
 */
function predictPersonality(
  f: ParentTraits["personality"],
  m: ParentTraits["personality"],
): { label: string; note: string } {
  const weight = { introvert: -1, ambivert: 0, extrovert: 1 } as const;
  const sum = weight[f] + weight[m];
  let label: string;
  if (sum >= 1) label = "외향적 성향이 나타날 가능성";
  else if (sum <= -1) label = "내향적 성향이 나타날 가능성";
  else label = "상황 따라 달라지는 중간 성향 가능성";
  return {
    label,
    note: "성격은 유전 약 50% + 환경 50%로 알려져 있어요. 어떻게 키우느냐가 크게 작용해요.",
  };
}

/** 누구 닮을지 짧은 멘트 */
function generateResemblance(input: BabyGeneticsInput): string {
  const phrases: string[] = [];
  const { father, mother } = input;

  if (father.heightCm > mother.heightCm + 10) {
    phrases.push("키는 아빠를 닮을 확률이 높아요");
  } else if (mother.heightCm > father.heightCm + 10) {
    phrases.push("키는 엄마를 닮을 확률이 높아요");
  } else {
    phrases.push("키는 부모님 중간쯤");
  }

  if (father.doubleEyelid === "yes" && mother.doubleEyelid !== "yes") {
    phrases.push("눈매는 아빠 느낌");
  } else if (mother.doubleEyelid === "yes" && father.doubleEyelid !== "yes") {
    phrases.push("눈매는 엄마 느낌");
  } else if (father.doubleEyelid === "yes" && mother.doubleEyelid === "yes") {
    phrases.push("또렷한 쌍꺼풀이 기대돼요");
  }

  if (father.dimples === "yes" || mother.dimples === "yes") {
    phrases.push("웃을 때 보조개가 살짝 보일지도");
  }

  return phrases.join(", ") + ".";
}

export function predictBabyGenetics(
  input: BabyGeneticsInput,
): BabyGeneticsResult {
  return {
    estimatedHeight: predictHeight(
      input.father.heightCm,
      input.mother.heightCm,
      input.babySex,
    ),
    doubleEyelidProb: predictDoubleEyelid(
      input.father.doubleEyelid,
      input.mother.doubleEyelid,
    ),
    hairType: predictHairType(input.father.hair, input.mother.hair),
    dimplesProb: predictDimples(input.father.dimples, input.mother.dimples),
    possibleBloodTypes: predictBloodType(
      input.father.bloodType,
      input.mother.bloodType,
    ),
    baldnessProb: predictBaldness(
      input.father.paternalGrandfatherBald,
      input.mother.maternalGrandfatherBald,
      input.babySex,
    ),
    personalityTendency: predictPersonality(
      input.father.personality,
      input.mother.personality,
    ),
    resemblance: generateResemblance(input),
  };
}

export const GENETICS_FUN_FACTS = [
  "격세유전으로 할아버지 눈썹, 외할머니 입술이 나올 수도 있어요.",
  "유전되지 않는 것도 있어요. 취향, 관심사, 재능은 대부분 경험으로 만들어져요.",
  "아기는 언제나 부모의 상상을 뛰어넘는 고유한 존재예요.",
];

/**
 * 스크린샷 인포그래픽 기반 "유전의 진짜 범인" 미니 사전.
 */
export const HEREDITY_CULPRITS: HeredityCulprit[] = [
  {
    trait: "성별",
    culprit: "아빠 100%",
    detail: "아빠의 X 또는 Y 염색체가 성별을 최종 결정해요.",
  },
  {
    trait: "대머리",
    culprit: "외가 영향 + 아빠",
    detail: "AR 유전자가 X 염색체에 있어 외할아버지 영향이 크지만 아빠 쪽도 함께 작용해요.",
  },
  {
    trait: "지능",
    culprit: "부모 공통 + 환경",
    detail: "수천 개 유전자와 환경이 결합돼서 단정 짓기 어려워요.",
  },
  {
    trait: "수명",
    culprit: "엄마 영향 높음",
    detail: "에너지원인 미토콘드리아가 모계로만 유전된다는 근거가 있어요.",
  },
  {
    trait: "키",
    culprit: "부모 공통 70~80%",
    detail: "양쪽 모두의 영향이 크고, 한쪽이 더 강하다는 정설은 없어요.",
  },
  {
    trait: "비만",
    culprit: "가족 생활 습관",
    detail: "유전보다 식습관·운동량 같은 공유 환경이 더 지배적이에요.",
  },
  {
    trait: "피부",
    culprit: "후천적 관리 80%",
    detail: "피부 타입은 유전되지만 노화는 자외선 차단과 관리가 핵심이에요.",
  },
  {
    trait: "성격",
    culprit: "유전 50% + 환경 50%",
    detail: "특정 기질이 아빠 탓/엄마 탓이라는 과학적 근거는 부족해요.",
  },
  {
    trait: "치아",
    culprit: "부모 양쪽의 조합",
    detail: "턱 구조와 치아 크기는 부모 양쪽 형질이 섞여서 나타나요.",
  },
];
