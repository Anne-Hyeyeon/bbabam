import type {
  BalanceKind,
  BalanceQuestion,
  BalanceResult,
  BalanceSide,
} from "./types";

export const BALANCE_GAME_META = {
  title: "아들딸 밸런스 게임",
  subtitle: "극한의 육아 양자택일.",
  description: "10문항이면 내가 어떤 육아 라이프에 최적화됐는지 나와요.",
  questionCount: 10,
  durationMinutes: 2,
  disclaimer:
    "성별 고정관념은 어디까지나 밈으로만 즐겨 주세요. 실제 아기는 언제나 예상을 벗어납니다. 그게 매력이에요.",
} as const;

export const BALANCE_GAME_QUESTIONS: readonly BalanceQuestion[] = [
  {
    question: "주말 아침, 더 자신 있는 미션은?",
    options: [
      { text: "공룡 이름 100개 같이 외우기", side: "boy" },
      { text: "인형 유치원 담임 선생님 되기", side: "girl" },
    ],
  },
  {
    question: "더 오래 견딜 수 있는 소음은?",
    options: [
      { text: "미니카가 벽에 돌진하는 소리", side: "boy" },
      { text: "같은 동요 뮤지컬 무한 반복", side: "girl" },
    ],
  },
  {
    question: "쇼핑몰에서 더 오래 버틸 코너는?",
    options: [
      { text: "로봇·자동차·중장비 코너", side: "boy" },
      { text: "머리핀·드레스·반짝이 코너", side: "girl" },
    ],
  },
  {
    question: "놀이터에서 더 자신 있는 역할은?",
    options: [
      { text: "축구공 물어오는 건 나(체력전)", side: "boy" },
      { text: "모래성 인테리어 총괄 디렉터", side: "girl" },
    ],
  },
  {
    question: "머리 손질 미션, 더 할 만한 쪽은?",
    options: [
      { text: "2분 컷 셀프 바리캉", side: "boy" },
      { text: "등원 5분 전 양갈래 묶기", side: "girl" },
    ],
  },
  {
    question: "옷 전쟁, 더 유리한 전장은?",
    options: [
      { text: "흙탕물 바지 무한 세탁", side: "boy" },
      { text: "오늘도 공주 드레스만 입겠다는 협상 테이블", side: "girl" },
    ],
  },
  {
    question: "같이 봐야 한다면 더 버틸 수 있는 영상은?",
    options: [
      { text: "굴착기 관찰 영상 1시간", side: "boy" },
      { text: "키즈 꾸미기 브이로그 1시간", side: "girl" },
    ],
  },
  {
    question: "생일선물 준비, 더 자신 있는 쪽은?",
    options: [
      { text: "설명서 40페이지 변신로봇 조립", side: "boy" },
      { text: "실바니안 패밀리 세계관 이해", side: "girl" },
    ],
  },
  {
    question: "더 감당 가능한 대화는?",
    options: [
      { text: "'왜?' 꼬리물기 100연속 방어", side: "boy" },
      { text: "유치원 서사 대하드라마 풀버전 시청", side: "girl" },
    ],
  },
  {
    question: "체력전 최종 라운드, 더 버틸 수 있는 쪽은?",
    options: [
      { text: "침대 이단옆차기 받아주기", side: "boy" },
      { text: "무한 공주님 안기 셔틀", side: "girl" },
    ],
  },
] as const;

/** boyCount at or above this (out of 10) → boy-life type; mirrored for girl. */
const DOMINANT_THRESHOLD = 7;

const RESULT_COPY: Record<BalanceKind, { title: string; description: string }> = {
  boyLife: {
    title: "아들 라이프 최적화 인간",
    description:
      "체력전, 소음전, 공룡 100종 암기까지 준비 완료.\n어느 쪽이 태어나도 사랑하겠지만, 몸이 이미 아들 육아에 세팅돼 있네요.",
  },
  girlLife: {
    title: "딸 라이프 최적화 인간",
    description:
      "양갈래 묶기부터 인형 세계관 정치까지 소화 가능.\n어느 쪽이 태어나도 사랑하겠지만, 감성이 이미 딸 육아에 세팅돼 있네요.",
  },
  allRounder: {
    title: "만능 육아 올라운더",
    description:
      "미니카도 받고 티파티도 받는 유형.\n아들이든 딸이든 그날부터 최적화 완료. 사실 제일 무서운 타입입니다.",
  },
};

// Pure: tally answers into a result.
export function computeBalance(answers: readonly BalanceSide[]): BalanceResult {
  const boyCount = answers.filter((side) => side === "boy").length;
  const girlCount = answers.length - boyCount;
  const kind: BalanceKind =
    boyCount >= DOMINANT_THRESHOLD
      ? "boyLife"
      : girlCount >= DOMINANT_THRESHOLD
        ? "girlLife"
        : "allRounder";

  return { kind, boyCount, girlCount, ...RESULT_COPY[kind] };
}
