import type { CardAudience, CardMessage, CardTone } from "./types";

export const IMMING_OUT_META = {
  title: "임밍아웃 문구 모음",
  subtitle: "저 임신했어요!",
  description: "상황별로 준비된 임신 알림 문구, 그대로 복사해서 써도 돼요.",
} as const;

export const CARD_AUDIENCES: {
  value: CardAudience;
  label: string;
  desc: string;
}[] = [
  { value: "parents",   label: "부모님",   desc: "엄마·아빠, 시댁·처가" },
  { value: "spouse",    label: "배우자",   desc: "놀라게 하기·깜짝 선물" },
  { value: "friends",   label: "친구",     desc: "단톡방·SNS" },
  { value: "workplace", label: "회사",     desc: "상사·동료" },
  { value: "special",   label: "특별한 상황", desc: "난임·둘째·쌍둥이·늦둥이" },
];

export const TONE_LABELS: Record<CardTone, string> = {
  formal: "공식",
  casual: "캐주얼",
  emotional: "감성",
  witty: "위트",
  minimal: "미니멀",
};

export const IMMING_OUT_MESSAGES: CardMessage[] = [
  // === 부모님께 ===
  {
    id: "parents-01",
    audience: "parents",
    audienceLabel: "부모님께",
    style: "클래식",
    content: "엄마, 아빠.\n저 이제 엄마 아빠가 돼요.",
    tone: "emotional",
  },
  {
    id: "parents-02",
    audience: "parents",
    audienceLabel: "부모님께",
    style: "귀여운",
    content: "할머니 할아버지 되실 거예요.\n(내년 봄에요!)",
    tone: "casual",
  },
  {
    id: "parents-03",
    audience: "parents",
    audienceLabel: "부모님께",
    style: "감성",
    content:
      "세상에서 가장 설레는 소식을 전해요.\n우리 가족이 한 명 더 늘어나요.",
    tone: "emotional",
  },
  {
    id: "parents-04",
    audience: "parents",
    audienceLabel: "부모님께",
    style: "위트",
    content: "손주 예약 완료!\n수령 예정일: 2026년 가을",
    tone: "witty",
  },
  {
    id: "parents-05",
    audience: "parents",
    audienceLabel: "시댁·처가",
    style: "공손",
    content:
      "어머님, 아버님.\n기쁜 소식 전해드려요.\n건강한 아기가 찾아왔어요.",
    tone: "formal",
  },
  {
    id: "parents-06",
    audience: "parents",
    audienceLabel: "부모님께",
    style: "짧고 굵게",
    content: "아기가 왔어요.",
    tone: "minimal",
  },
  {
    id: "parents-07",
    audience: "parents",
    audienceLabel: "부모님께",
    style: "영상통화",
    content:
      "(초음파 사진을 카메라에 비추며)\n놀라지 마세요...\n할머니 할아버지 되세요!",
    tone: "witty",
  },

  // === 배우자에게 ===
  {
    id: "spouse-01",
    audience: "spouse",
    audienceLabel: "배우자에게",
    style: "케이크 토퍼",
    content: "우리 셋이 되는 거 어때?",
    tone: "emotional",
  },
  {
    id: "spouse-02",
    audience: "spouse",
    audienceLabel: "배우자에게",
    style: "깜짝 파티",
    content: "D-240.\n카운트다운 시작!",
    tone: "witty",
  },
  {
    id: "spouse-03",
    audience: "spouse",
    audienceLabel: "배우자에게",
    style: "감성",
    content: "이 방의 가장 작은 멤버가\n도착했어요.",
    tone: "emotional",
  },
  {
    id: "spouse-04",
    audience: "spouse",
    audienceLabel: "배우자에게",
    style: "유머",
    content: "축하해요.\n당신도 이제 수면부족 클럽 회원이에요.",
    tone: "witty",
  },
  {
    id: "spouse-05",
    audience: "spouse",
    audienceLabel: "배우자에게",
    style: "진심",
    content: "당신을 닮은 아기가\n우리에게 와요.",
    tone: "emotional",
  },

  // === 친구들에게 ===
  {
    id: "friends-01",
    audience: "friends",
    audienceLabel: "친구들에게",
    style: "SNS 감성",
    content: "Coming soon... 2026.\n세상에서 가장 귀한 손님을 기다리는 중.",
    tone: "emotional",
  },
  {
    id: "friends-02",
    audience: "friends",
    audienceLabel: "단톡방에",
    style: "발칙하게",
    content: "잠깐 주목!\n나 엄마(아빠) 된다.",
    tone: "casual",
  },
  {
    id: "friends-03",
    audience: "friends",
    audienceLabel: "친구들에게",
    style: "위트",
    content: "앞으로 술 못 마심.\n이유: 첨부파일 참조.\n[초음파 사진]",
    tone: "witty",
  },
  {
    id: "friends-04",
    audience: "friends",
    audienceLabel: "친구들에게",
    style: "감성 단체 카톡",
    content:
      "너희들한테 먼저 말하고 싶었어.\n우리 가족이 한 명 더 생겨.",
    tone: "emotional",
  },
  {
    id: "friends-05",
    audience: "friends",
    audienceLabel: "친구들에게",
    style: "이모지 온리",
    content: "우리 둘 → 우리 셋.\n(2026 ver.)",
    tone: "minimal",
  },
  {
    id: "friends-06",
    audience: "friends",
    audienceLabel: "친구들에게",
    style: "쿨하게",
    content:
      "뉴스 있어.\n내년에 초대할 사람 한 명 더 늘어날 예정.",
    tone: "casual",
  },

  // === 회사·직장 ===
  {
    id: "workplace-01",
    audience: "workplace",
    audienceLabel: "회사 공식",
    style: "공식적",
    content:
      "안녕하세요, 개인적인 소식을 전해드립니다.\n임신을 하게 되어 올해 말 출산 휴가를 신청하려 합니다.",
    tone: "formal",
  },
  {
    id: "workplace-02",
    audience: "workplace",
    audienceLabel: "친한 동료에게",
    style: "캐주얼",
    content: "저 아기 생겼어요 :)\n아직 초기라 비밀이에요, 쉿.",
    tone: "casual",
  },
  {
    id: "workplace-03",
    audience: "workplace",
    audienceLabel: "상사 보고용",
    style: "면담 요청",
    content:
      "팀장님, 잠시 면담 가능하실까요?\n기쁜 소식이 있어서요.",
    tone: "formal",
  },

  // === 특별한 상황 ===
  {
    id: "special-01",
    audience: "special",
    audienceLabel: "난임 후 임신",
    style: "깊은 감사",
    content: "긴 기다림 끝에,\n드디어 우리에게 와줬어요.",
    tone: "emotional",
  },
  {
    id: "special-02",
    audience: "special",
    audienceLabel: "둘째 임신",
    style: "첫째에게",
    content: "누나가 될 준비됐어?\n(형아가 될 준비됐어?)",
    tone: "casual",
  },
  {
    id: "special-03",
    audience: "special",
    audienceLabel: "쌍둥이",
    style: "더블 축복",
    content: "한 명이 아니라...\n두 명이에요!",
    tone: "witty",
  },
  {
    id: "special-04",
    audience: "special",
    audienceLabel: "늦둥이",
    style: "담담하게",
    content: "나이는 숫자일 뿐.\n우리 가족이 또 한 번 늘어나요.",
    tone: "emotional",
  },
];
