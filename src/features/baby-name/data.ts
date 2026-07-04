import type { BabyNameEntry, NameVibe, VibeFilter, VibeOption } from "./types";

export const BABY_NAME_META = {
  title: "운명의 태명 뽑기",
  subtitle: "태명 고민, 오늘로 끝.",
  description: "버튼 한 번이면 운명이 정해 드려요.",
  disclaimer:
    "태명은 재미로 뽑고 마음으로 고르는 거예요. 마음에 드는 게 나올 때까지 몇 번이고 뽑아도 돼요.",
} as const;

export const VIBE_OPTIONS: readonly VibeOption[] = [
  { value: "any", label: "아무거나" },
  { value: "cute", label: "귀염뽀짝" },
  { value: "yummy", label: "먹짱" },
  { value: "sturdy", label: "튼튼장군" },
  { value: "shiny", label: "반짝반짝" },
  { value: "pure", label: "순우리말" },
] as const;

export const BABY_NAME_POOL: readonly BabyNameEntry[] = [
  // 귀염뽀짝
  { vibe: "cute", name: "콩이", meaning: "작은 콩처럼 야무지게 자라라는 뜻", tagline: "작지만 존재감은 세상 제일." },
  { vibe: "cute", name: "쪼꼬", meaning: "초콜릿처럼 달콤한 아기", tagline: "달콤함 과다, 심쿵 주의보 발령." },
  { vibe: "cute", name: "몽글이", meaning: "몽글몽글 구름처럼 포근하게 크라는 뜻", tagline: "만지면 큰일 나는 폭신함." },
  { vibe: "cute", name: "꼬물이", meaning: "초음파 속에서 꼬물꼬물 움직이던 모습 그대로", tagline: "초음파실 인기스타 데뷔 완료." },
  { vibe: "cute", name: "방울이", meaning: "방울 소리처럼 맑고 경쾌하게 자라라는 뜻", tagline: "웃음소리 딸랑딸랑 예약." },
  { vibe: "cute", name: "봄이", meaning: "봄볕처럼 따뜻한 아기가 되라는 뜻", tagline: "엄마 아빠 인생에 도착한 첫 봄." },
  { vibe: "cute", name: "솜이", meaning: "솜사탕처럼 보드랍고 포근한 아기", tagline: "포근함 담당 일진. 안기면 못 일어남." },
  { vibe: "cute", name: "뽀야", meaning: "뽀얗고 보드라운 아기가 되라는 뜻", tagline: "뽀얀 볼 소유자. 볼 꼬집기 금지." },

  // 먹짱
  { vibe: "yummy", name: "만두", meaning: "만두처럼 속이 꽉 찬 아기가 되라는 뜻", tagline: "속이 꽉 찼다, 육즙 대신 사랑으로." },
  { vibe: "yummy", name: "젤리", meaning: "말랑말랑 탱글탱글 건강하게 크라는 뜻", tagline: "말랑함 하나로 세계 정복 예정." },
  { vibe: "yummy", name: "앙꼬", meaning: "우리 집 인생 단팥 같은 존재", tagline: "이 집, 앙꼬 없이는 못 삽니다." },
  { vibe: "yummy", name: "찹쌀이", meaning: "찰떡같이 엄마 아빠 곁에 붙어 있으라는 뜻", tagline: "애착 스킬 만렙 찍고 태어날 예정." },
  { vibe: "yummy", name: "꿀떡이", meaning: "꿀떡꿀떡 잘 먹고 쑥쑥 크라는 뜻", tagline: "먹방 유망주. 분유 완판 예상." },
  { vibe: "yummy", name: "두부", meaning: "하얗고 몰랑한 아기가 되라는 뜻", tagline: "연두부급 피부, 벌써 스킨케어 완성." },
  { vibe: "yummy", name: "호빵이", meaning: "추운 날 도착한 따끈따끈한 소식", tagline: "품에 안으면 그게 바로 손난로." },
  { vibe: "yummy", name: "복숭이", meaning: "복숭아처럼 발그레 예쁘게 크라는 뜻", tagline: "볼터치는 태어날 때 이미 장착." },

  // 튼튼장군
  { vibe: "sturdy", name: "튼튼이", meaning: "아프지 말고 튼튼하게 자라라는 뜻", tagline: "예방접종도 씩씩하게. (희망사항)" },
  { vibe: "sturdy", name: "짱아", meaning: "뭐든 짱이 되라는 뜻", tagline: "이 구역 짱은 나야, 배 속에서부터." },
  { vibe: "sturdy", name: "번개", meaning: "번개처럼 빠르고 씩씩하게 크라는 뜻", tagline: "태동 속도 실화냐. 발차기 국가대표감." },
  { vibe: "sturdy", name: "태산이", meaning: "태산처럼 크고 든든하게 자라라는 뜻", tagline: "벌써부터 우리 집 기둥 예약." },
  { vibe: "sturdy", name: "씩씩이", meaning: "씩씩하게 세상에 나오라는 뜻", tagline: "울음소리 데시벨 측정 불가 예상." },
  { vibe: "sturdy", name: "복덩이", meaning: "복을 잔뜩 몰고 온 아기", tagline: "입주와 동시에 가문의 운세 상승." },
  { vibe: "sturdy", name: "장군이", meaning: "장군처럼 기개 있게 자라라는 뜻", tagline: "배 속에서 이미 호령 중." },
  { vibe: "sturdy", name: "무럭이", meaning: "무럭무럭 크라는 뜻 그대로", tagline: "성장 속도, 초음파로 검증 완료." },

  // 반짝반짝
  { vibe: "shiny", name: "별이", meaning: "밤하늘 별처럼 빛나라는 뜻", tagline: "우리 집 최초의 스타 탄생." },
  { vibe: "shiny", name: "달이", meaning: "달처럼 은은하고 다정하게 빛나라는 뜻", tagline: "야간 조명 담당. 새벽 근무 예정." },
  { vibe: "shiny", name: "반짝이", meaning: "초음파에서 반짝이던 심장 소리를 담은 이름", tagline: "심장 소리부터 스포트라이트." },
  { vibe: "shiny", name: "빛나", meaning: "어디서든 빛나는 존재가 되라는 뜻", tagline: "출생과 동시에 조명 세팅 완료." },
  { vibe: "shiny", name: "새벽이", meaning: "새벽처럼 고요하고 설레는 시작", tagline: "알람 없이 새벽 기상 시켜 드립니다." },
  { vibe: "shiny", name: "노을이", meaning: "노을처럼 따뜻한 빛을 나누라는 뜻", tagline: "하루의 피로를 녹이는 공식 담당자." },
  { vibe: "shiny", name: "금동이", meaning: "금같이 귀한 아기라는 뜻", tagline: "집안 공식 보물 1호 등극." },
  { vibe: "shiny", name: "별하", meaning: "별처럼 높고 빛나게 자라라는 뜻", tagline: "이름부터 아이돌 데뷔 준비 완료." },

  // 순우리말
  { vibe: "pure", name: "도담이", meaning: "탈 없이 야무지게 자란다는 순우리말", tagline: "순우리말 태명계의 스테디셀러." },
  { vibe: "pure", name: "다온이", meaning: "좋은 모든 일이 다 온다는 순우리말", tagline: "행운 배달 시작합니다, 문 앞에 두고 가요." },
  { vibe: "pure", name: "라온이", meaning: "즐겁다는 뜻의 순우리말", tagline: "집안 공식 분위기 메이커 내정자." },
  { vibe: "pure", name: "이슬이", meaning: "맑은 이슬처럼 깨끗하게 자라라는 뜻", tagline: "아침 이슬급 청량함 장착." },
  { vibe: "pure", name: "늘봄이", meaning: "언제나 봄처럼 따뜻하라는 순우리말", tagline: "사계절 내내 봄인 집이 됩니다." },
  { vibe: "pure", name: "하늘이", meaning: "하늘처럼 넓은 마음을 가지라는 뜻", tagline: "마음 평수 최상급 분양 완료." },
  { vibe: "pure", name: "아름이", meaning: "아름답게 자라라는 뜻", tagline: "이름값은 태어나기 전부터 하는 중." },
  { vibe: "pure", name: "윤슬이", meaning: "햇빛에 반짝이는 잔물결이라는 순우리말", tagline: "감성 태명 원탑. 뜻을 말하면 다들 감탄함." },
] as const;

// Pure: pool narrowed to a vibe ("any" keeps everything).
export const namesForVibe = (vibe: VibeFilter): readonly BabyNameEntry[] =>
  vibe === "any"
    ? BABY_NAME_POOL
    : BABY_NAME_POOL.filter((entry) => entry.vibe === vibe);

/**
 * Pure: pick an entry from the vibe pool using a roll in [0, 1).
 * The previous name is excluded so consecutive draws always feel new.
 */
export function drawBabyName(
  vibe: VibeFilter,
  roll: number,
  excludeName?: string,
): BabyNameEntry {
  const pool = namesForVibe(vibe);
  const candidates =
    pool.length > 1 ? pool.filter((entry) => entry.name !== excludeName) : pool;
  const index = Math.min(
    candidates.length - 1,
    Math.max(0, Math.floor(roll * candidates.length)),
  );
  return candidates[index];
}

/** Pure: label for a vibe key (used on the result card). */
export const vibeLabel = (vibe: NameVibe): string =>
  VIBE_OPTIONS.find((opt) => opt.value === vibe)?.label ?? "";
