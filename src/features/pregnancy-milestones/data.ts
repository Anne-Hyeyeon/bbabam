import type { WeekMilestone } from "./types";

export const PREGNANCY_MILESTONES_META = {
  title: "임신 주차별 마일스톤",
  subtitle: "우리 아기, 지금 어디쯤 왔을까?",
  description:
    "4주부터 40주까지, 아기가 자라는 10개의 결정적 순간을 타임라인으로 만나보세요.",
} as const;

export const PREGNANCY_MILESTONES: WeekMilestone[] = [
  {
    week: 4,
    title: "콩알만한 시작",
    description: "아직 깨알만 하지만, 우리의 세상이 시작됐어요.",
    size: "콩알",
  },
  {
    week: 8,
    title: "심장이 뛰어요",
    description: "쌀알 크기. 작은 심장이 이미 2배속으로 뛰고 있어요.",
    size: "쌀알",
  },
  {
    week: 12,
    title: "이제 사람 모양",
    description: "손가락, 발가락이 다 있어요. 공식적으로 태아가 됐어요.",
    size: "자두",
  },
  {
    week: 16,
    title: "표정이 생겼어요",
    description: "찡그리고 웃기도 해요. 아기 얼굴이 만들어지는 중.",
    size: "아보카도",
  },
  {
    week: 20,
    title: "드디어 태동",
    description: "엄마 배 안에서 아기가 ‘안녕’이라고 인사해요.",
    size: "바나나",
  },
  {
    week: 24,
    title: "엄마 목소리 인식",
    description:
      "엄마 아빠 목소리를 기억하기 시작했어요. 많이 말 걸어주세요!",
    size: "옥수수",
  },
  {
    week: 28,
    title: "눈을 떠요",
    description: "빛을 감지할 수 있어요. 밝고 어두움을 구분해요.",
    size: "가지",
  },
  {
    week: 32,
    title: "점점 통통하게",
    description: "아기가 살이 오르고 있어요. 귀여움 레벨 업!",
    size: "배추",
  },
  {
    week: 36,
    title: "거의 완성",
    description: "언제든 나와도 괜찮은 상태. 자리만 잡으면 돼요.",
    size: "수박(소)",
  },
  {
    week: 40,
    title: "드디어 만나는 날",
    description: "빠밤! 축하드려요. 세상에서 가장 기다린 순간이에요.",
    size: "수박",
  },
];

export const BIRTH_CONGRATS_MESSAGES = [
  "세상에서 가장 반가운 손님, 드디어 왔네요!",
  "작은 발자국, 큰 행복의 시작.",
  "수고하셨어요. 그리고 환영해요, 작은 우주.",
  "10달의 기다림, 평생의 기쁨으로.",
  "새로운 가족의 시작을 진심으로 축하드려요.",
  "우리 동네에 귀염둥이가 늘었네요.",
];

export const POSTPARTUM_SUPPORT_MESSAGES = [
  "엄마도 오늘 태어났어요. 천천히 해도 괜찮아요.",
  "완벽하지 않아도 돼요. 사랑하면 충분해요.",
  "잠은 나눠 자고, 웃음은 같이 나눠요.",
  "오늘 하루도 잘 버텼어요. 그게 전부예요.",
];

/**
 * 현재 주차에 가장 가까운 마일스톤을 찾는다. 앞쪽 가까운 것 우선.
 */
export function nearestMilestone(currentWeek: number): WeekMilestone {
  const sorted = [...PREGNANCY_MILESTONES].sort(
    (a, b) =>
      Math.abs(a.week - currentWeek) - Math.abs(b.week - currentWeek) ||
      a.week - b.week,
  );
  return sorted[0];
}
