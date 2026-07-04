import type { DdaySnapshot } from "./types";

export const DDAY_META = {
  title: "출산 D-day 계산기",
  subtitle: "우리, 며칠 뒤에 만나?",
  description: "출산예정일만 넣으면 D-day부터 주차, 아기 크기까지 한 번에.",
  disclaimer:
    "주차와 진행률은 예정일 기준 계산값이에요. 정확한 주수는 담당 의사 선생님이 알려주신 값을 따라 주세요.",
} as const;

/** Standard full-term pregnancy length used for week math. */
const PREGNANCY_DAYS = 280;
const MS_PER_DAY = 86_400_000;
const MAX_WEEK = 42;

const FIRST_TRIMESTER_END_WEEK = 14;
const SECOND_TRIMESTER_END_WEEK = 28;

// Pure: clamp helper.
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

// Pure: strip the time part so day math ignores hours.
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * Pure: derive the countdown snapshot from a due date and "today".
 * Today is passed in so callers keep Date.now() at the boundary.
 */
export function computeDday(dueDate: Date, today: Date): DdaySnapshot {
  const daysLeft = Math.round(
    (startOfDay(dueDate).getTime() - startOfDay(today).getTime()) / MS_PER_DAY,
  );
  const daysIn = clamp(PREGNANCY_DAYS - daysLeft, 0, PREGNANCY_DAYS);
  const week = clamp(Math.floor(daysIn / 7), 0, MAX_WEEK);
  const trimester =
    week < FIRST_TRIMESTER_END_WEEK ? 1 : week < SECOND_TRIMESTER_END_WEEK ? 2 : 3;
  const progressPct = Math.round((daysIn / PREGNANCY_DAYS) * 100);

  return { daysLeft, week, trimester, progressPct };
}

// Pure: D-day label ("D-31", "D-day", "D+3").
export const ddayLabel = (daysLeft: number): string => {
  if (daysLeft === 0) return "D-day";
  return daysLeft > 0 ? `D-${daysLeft}` : `D+${-daysLeft}`;
};

// Pure: one witty status line matched to where the countdown stands.
export function ddayComment(snapshot: DdaySnapshot): string {
  const { daysLeft, trimester } = snapshot;
  if (daysLeft < 0)
    return "예정일 지남! 세상 구경에 신중한 타입인가 봐요. 곧 나와요.";
  if (daysLeft === 0) return "오늘이에요, 오늘! 출산가방 들고 출발!";
  if (daysLeft <= 7) return "일주일 안. 출산가방은 현관 앞 대기 상태로.";
  if (daysLeft <= 30) return "한 달 컷. 이름 후보 최종 정리할 타이밍이에요.";
  if (trimester === 3) return "3분기 돌입. 허리가 제일 먼저 알아차려요.";
  if (trimester === 2) return "안정기. 여행은 지금 가라는 소문이 있어요.";
  return "아직 초반. 몸은 힘든데 티는 안 나는, 본인만 아는 시기예요.";
}
