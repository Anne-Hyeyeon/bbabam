import type { BagCategory } from "./types";

export const HOSPITAL_BAG_META = {
  title: "출산가방 체크리스트",
  subtitle: "막달 뇌는 원래 안 돌아가요.",
  description: "머리 대신 손가락으로 체크만 하면 되는 짐싸기 리스트.",
  disclaimer:
    "병원마다 제공 품목이 달라요. 입원 안내문과 겹치는 건 빼고 챙기면 가방이 가벼워져요.",
} as const;

export const HOSPITAL_BAG_CATEGORIES: readonly BagCategory[] = [
  {
    key: "docs",
    title: "서류·필수",
    essential: true,
    items: [
      { id: "docs-id", label: "산모 신분증" },
      { id: "docs-book", label: "산모수첩" },
      { id: "docs-card", label: "병원 진료카드·등록증" },
      { id: "docs-partner-id", label: "보호자 신분증" },
      { id: "docs-charger", label: "휴대폰 충전기", note: "케이블 긴 걸로. 병원 콘센트는 늘 멀어요." },
    ],
  },
  {
    key: "mom",
    title: "엄마 용품",
    items: [
      { id: "mom-pads", label: "산모용 패드" },
      { id: "mom-nursing", label: "수유 나시·수유복" },
      { id: "mom-cardigan", label: "카디건", note: "병원은 춥거나 덥거나 둘 중 하나예요." },
      { id: "mom-socks", label: "수면양말" },
      { id: "mom-toiletries", label: "세면도구" },
      { id: "mom-balm", label: "립밤·보습크림", note: "병원 공기 건조함은 사막급." },
      { id: "mom-hairband", label: "머리끈·헤어밴드" },
      { id: "mom-straw", label: "빨대컵", note: "누워서 물 마시는 신세계." },
      { id: "mom-cushion", label: "도넛 방석" },
      { id: "mom-stockings", label: "압박스타킹" },
    ],
  },
  {
    key: "baby",
    title: "아기 용품",
    items: [
      { id: "baby-gown", label: "배냇저고리" },
      { id: "baby-swaddle-in", label: "속싸개" },
      { id: "baby-swaddle-out", label: "겉싸개" },
      { id: "baby-mittens", label: "손싸개·발싸개" },
      { id: "baby-diapers", label: "신생아 기저귀 소량", note: "병원 제공이 많아요. 한 줌이면 충분." },
      { id: "baby-gauze", label: "가제 손수건 5장 이상" },
      { id: "baby-carseat", label: "카시트", note: "퇴원날 필수. 트렁크 말고 좌석에 미리 장착." },
    ],
  },
  {
    key: "partner",
    title: "보호자 용품",
    items: [
      { id: "partner-toiletries", label: "보호자 세면도구" },
      { id: "partner-clothes", label: "갈아입을 옷" },
      { id: "partner-snacks", label: "간식·물", note: "새벽 편의점 왕복 방지용." },
      { id: "partner-pillow", label: "목베개", note: "보호자 침대는 소문대로예요." },
      { id: "partner-slippers", label: "슬리퍼" },
    ],
  },
] as const;

// Pure: flat list of every item id.
export const allBagItemIds = (): readonly string[] =>
  HOSPITAL_BAG_CATEGORIES.flatMap((cat) => cat.items.map((item) => item.id));

// Pure: how many of a category's items are checked.
export const checkedInCategory = (
  category: BagCategory,
  checked: ReadonlySet<string>,
): number => category.items.filter((item) => checked.has(item.id)).length;

// Pure: overall progress percentage (0–100).
export const bagProgressPct = (checked: ReadonlySet<string>): number => {
  const total = allBagItemIds().length;
  return total === 0 ? 0 : Math.round((checked.size / total) * 100);
};

// Pure: one witty status line for the current progress.
export function bagComment(pct: number): string {
  if (pct === 0) return "가방이 아직 텅텅. 괜찮아요, 오늘 시작하면 돼요.";
  if (pct < 40) return "시동 걸렸어요. 보이는 것부터 던져 넣기.";
  if (pct < 80) return "절반 넘김. 이 속도면 예정일을 이겨요.";
  if (pct < 100) return "거의 다 왔어요. 남은 건 늘 충전기더라고요.";
  return "완벽. 이제 아기만 나오면 됩니다.";
}
