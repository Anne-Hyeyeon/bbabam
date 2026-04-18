import type {
  FolkloreResultKind,
  GenderFolkloreQuestion,
  GenderFolkloreResult,
  GenderGuess,
} from "./types";

export const GENDER_FOLKLORE_META = {
  title: "성별 맞추기 속설 테스트",
  subtitle: "우리 아기 아들일까, 딸일까?",
  description: "옛날부터 내려오는 속설 12가지로 재미있게 맞춰봐요.",
  disclaimer:
    "재미로만 봐주세요! 과학적 근거는 없어요. 정확한 성별은 초음파 검사로 확인하세요.",
  durationMinutes: 2,
  questionCount: 12,
} as const;

export const GENDER_FOLKLORE_QUESTIONS: GenderFolkloreQuestion[] = [
  {
    id: 1,
    question: "임산부의 배 모양은?",
    options: [
      { text: "앞으로 튀어나온 뾰족한 배", guess: "boy" },
      { text: "옆으로 퍼진 둥근 배", guess: "girl" },
      { text: "아직 잘 모르겠어요", guess: "neutral" },
    ],
  },
  {
    id: 2,
    question: "입덧은 심한 편인가요?",
    options: [
      { text: "거의 없거나 가벼움", guess: "boy" },
      { text: "매우 심함", guess: "girl" },
      { text: "보통이에요", guess: "neutral" },
    ],
  },
  {
    id: 3,
    question: "요즘 입맛이 바뀌었다면?",
    options: [
      { text: "짜고 매운 음식, 고기가 당김", guess: "boy" },
      { text: "달콤한 디저트, 과일이 당김", guess: "girl" },
      { text: "별로 안 바뀜", guess: "neutral" },
    ],
  },
  {
    id: 4,
    question: "피부 트러블은 어때요?",
    options: [
      { text: "여전히 깨끗한 편", guess: "boy" },
      { text: "평소보다 트러블이 많음", guess: "girl" },
      { text: "비슷해요", guess: "neutral" },
    ],
  },
  {
    id: 5,
    question: "임산부의 기분 변화는?",
    options: [
      { text: "비교적 안정적", guess: "boy" },
      { text: "감정 기복이 큼", guess: "girl" },
      { text: "그때그때 달라요", guess: "neutral" },
    ],
  },
  {
    id: 6,
    question: "태동의 느낌은?",
    options: [
      { text: "강하고 활발함", guess: "boy" },
      { text: "부드럽고 잔잔함", guess: "girl" },
      { text: "아직 잘 모르겠어요", guess: "neutral" },
    ],
  },
  {
    id: 7,
    question: "머리카락·손톱이 자라는 속도는?",
    options: [
      { text: "평소보다 빨리 자람", guess: "boy" },
      { text: "비슷하거나 더 느림", guess: "girl" },
      { text: "잘 모르겠어요", guess: "neutral" },
    ],
  },
  {
    id: 8,
    question: "태몽에 등장한 것은?",
    options: [
      { text: "용·호랑이·뱀·고추·밤", guess: "boy" },
      { text: "꽃·과일·보석·금반지·구슬", guess: "girl" },
      { text: "꿈을 안 꿨거나 기억 안 남", guess: "neutral" },
    ],
  },
  {
    id: 9,
    question: "배우자의 변화는?",
    options: [
      { text: "체중 변화가 거의 없음", guess: "boy" },
      { text: "같이 살찌는 중", guess: "girl" },
      { text: "잘 모르겠어요", guess: "neutral" },
    ],
  },
  {
    id: 10,
    question: "결혼반지 실 테스트 결과는?",
    options: [
      { text: "앞뒤로 흔들려요", guess: "boy" },
      { text: "원을 그리며 돌아요", guess: "girl" },
      { text: "안 해봤어요", guess: "neutral" },
    ],
  },
  {
    id: 11,
    question: "임신 중 체감 온도는?",
    options: [
      { text: "평소보다 더위를 많이 탐", guess: "boy" },
      { text: "평소보다 추위를 많이 탐", guess: "girl" },
      { text: "비슷해요", guess: "neutral" },
    ],
  },
  {
    id: 12,
    question: "임신 전후 성격·취향의 변화는?",
    options: [
      { text: "활동적이고 털털해짐", guess: "boy" },
      { text: "섬세하고 꼼꼼해짐", guess: "girl" },
      { text: "거의 그대로예요", guess: "neutral" },
    ],
  },
];

const RESULT_COPY: Record<
  FolkloreResultKind,
  Pick<GenderFolkloreResult, "title" | "description" | "disclaimer">
> = {
  boy: {
    title: "속설로는 아들이에요!",
    description:
      "튼튼하고 씩씩한 아들이 찾아올지도 몰라요.\n진짜 성별은 초음파로 확인하는 게 정확해요.",
    disclaimer: "속설은 속설일 뿐, 과학적 근거는 없어요.",
  },
  girl: {
    title: "속설로는 딸이에요!",
    description:
      "엄마를 닮은 예쁜 딸이 찾아올지도 몰라요.\n진짜 성별은 초음파로 확인하는 게 정확해요.",
    disclaimer: "속설은 속설일 뿐, 과학적 근거는 없어요.",
  },
  neutral: {
    title: "속설이 반반이에요!",
    description:
      "아들 딸 복불복, 어느 쪽이든 정말 소중한 아기예요.\n초음파 검사가 가장 정확하다는 점 잊지 마세요.",
    disclaimer: "속설은 속설일 뿐, 과학적 근거는 없어요.",
  },
  mixed: {
    title: "속설이 팽팽하게 맞서요!",
    description:
      "어느 쪽도 확실하지 않아요.\n결국 가장 정확한 건 병원에서의 초음파 검사예요.",
    disclaimer: "속설은 속설일 뿐, 과학적 근거는 없어요.",
  },
};

/**
 * 답변 배열을 받아서 아들/딸/중립/혼합 결과를 계산.
 * - neutral 답변은 비율 계산에서 제외
 * - boy 비율 >= 0.7 → boy, <= 0.3 → girl, 그 사이 → mixed
 * - boy+girl = 0이면 neutral
 */
export function computeGenderFolklore(
  guesses: GenderGuess[],
): GenderFolkloreResult {
  const boyCount = guesses.filter((g) => g === "boy").length;
  const girlCount = guesses.filter((g) => g === "girl").length;
  const neutralCount = guesses.filter((g) => g === "neutral").length;
  const total = boyCount + girlCount;

  let kind: FolkloreResultKind;
  let boyRatio = 0;
  if (total === 0) {
    kind = "neutral";
  } else {
    boyRatio = boyCount / total;
    if (boyRatio >= 0.7) kind = "boy";
    else if (boyRatio <= 0.3) kind = "girl";
    else kind = "mixed";
  }

  return {
    kind,
    ...RESULT_COPY[kind],
    boyCount,
    girlCount,
    neutralCount,
    boyRatio,
  };
}

export const FOLKLORE_FACTS = [
  {
    title: "과학적으로 증명된 성별 판별법",
    content:
      "초음파 검사와 NIPT(비침습적 산전 검사)가 가장 정확해요. 보통 16~20주 초음파에서 확인할 수 있어요.",
  },
  {
    title: "세계 각국의 재미있는 속설",
    content:
      "중국 — 황실 만세력 표로 예측해요.\n이탈리아 — 머리카락이 빨리 자라면 아들이래요.\n멕시코 — 엄마가 예뻐지면 아들, 거칠어지면 딸.",
  },
  {
    title: "속설이 틀리는 이유",
    content:
      "성별은 수정 순간 염색체로 결정돼요. 입덧·배 모양·입맛 변화는 호르몬과 체질 차이일 뿐 성별과는 관련이 없어요.",
  },
];
