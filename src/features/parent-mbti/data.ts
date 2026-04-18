import type { MBTIAxis, MBTIQuestion, MBTIResult, MBTIType } from "./types";

export const PARENT_MBTI_META = {
  title: "예비 부모 MBTI",
  subtitle: "나는 어떤 엄마·아빠가 될까?",
  description: "16개 질문으로 알아보는 나의 육아 스타일",
  durationMinutes: 3,
  questionCount: 16,
} as const;

export const PARENT_MBTI_QUESTIONS: MBTIQuestion[] = [
  // E/I 축 (4문항)
  {
    id: 1,
    question: "주말에 아기랑 시간을 보낸다면?",
    options: [
      { text: "문화센터, 키즈카페, 놀이터에서 다른 아이들과 어울리기", type: "E" },
      { text: "집에서 둘이 조용히 책 읽고 낮잠 자기", type: "I" },
    ],
  },
  {
    id: 2,
    question: "육아가 힘들 때 나는?",
    options: [
      { text: "맘카페·친구한테 털어놓고 위로받아야 함", type: "E" },
      { text: "혼자 조용히 정리할 시간이 필요함", type: "I" },
    ],
  },
  {
    id: 3,
    question: "아기 돌잔치를 준비한다면?",
    options: [
      { text: "친척·친구 많이 초대해 왁자지껄하게", type: "E" },
      { text: "가족끼리 조용하고 의미있게", type: "I" },
    ],
  },
  {
    id: 4,
    question: "산후조리원 선택 기준은?",
    options: [
      { text: "산모 모임·프로그램·커뮤니티 활성화", type: "E" },
      { text: "프라이버시 보장되고 혼자 쉴 수 있는 곳", type: "I" },
    ],
  },

  // S/N 축 (4문항)
  {
    id: 5,
    question: "육아 정보는 어디서 얻나?",
    options: [
      { text: "전문가 책·병원 자료·검증된 데이터", type: "S" },
      { text: "직관·경험담, '우리 아기는 특별해' 감", type: "N" },
    ],
  },
  {
    id: 6,
    question: "아기 교육 철학은?",
    options: [
      { text: "연령별 발달 단계에 맞는 구체적 커리큘럼", type: "S" },
      { text: "아기의 무한한 가능성과 창의력을 믿는다", type: "N" },
    ],
  },
  {
    id: 7,
    question: "태교를 한다면?",
    options: [
      { text: "검증된 태교 방법(클래식·태담 등) 실천", type: "S" },
      { text: "상상하고 말 걸고 느낌대로", type: "N" },
    ],
  },
  {
    id: 8,
    question: "아기 용품 살 때 나는?",
    options: [
      { text: "스펙·후기·성분표까지 꼼꼼히 비교", type: "S" },
      { text: "예쁘고 느낌 좋은 거 직관적으로 고름", type: "N" },
    ],
  },

  // T/F 축 (4문항)
  {
    id: 9,
    question: "아기가 밤에 계속 울 때?",
    options: [
      { text: "원인부터 파악 (배고픔? 기저귀? 열?)", type: "T" },
      { text: "일단 꼭 안아주고 토닥토닥", type: "F" },
    ],
  },
  {
    id: 10,
    question: "배우자가 육아로 힘들어할 때?",
    options: [
      { text: "문제 해결책과 대안을 함께 찾는다", type: "T" },
      { text: "일단 공감해주고 마음을 달래준다", type: "F" },
    ],
  },
  {
    id: 11,
    question: "아기가 처음 걸었을 때 반응은?",
    options: [
      { text: "'와, 이 월령에 걷는 건 빠른 편이네!'", type: "T" },
      { text: "(눈물 글썽) '우리 아기 많이 컸구나...'", type: "F" },
    ],
  },
  {
    id: 12,
    question: "어린이집 선택 기준은?",
    options: [
      { text: "교육 프로그램·원장 경력·안전시설", type: "T" },
      { text: "선생님 분위기·아이들 표정·따뜻한 느낌", type: "F" },
    ],
  },

  // J/P 축 (4문항)
  {
    id: 13,
    question: "아기 하루 루틴은?",
    options: [
      { text: "수유·낮잠·목욕 시간 딱딱 정해져있음", type: "J" },
      { text: "그날그날 아기 컨디션 따라 유연하게", type: "P" },
    ],
  },
  {
    id: 14,
    question: "아기 사진은?",
    options: [
      { text: "월령별 폴더·앨범까지 체계적으로 정리", type: "J" },
      { text: "막 찍어놓고 '어? 어디 있더라...'", type: "P" },
    ],
  },
  {
    id: 15,
    question: "여행 갈 때?",
    options: [
      { text: "일정·수유실·유모차 동선까지 미리 체크", type: "J" },
      { text: "일단 출발, 현장에서 부딪혀 해결", type: "P" },
    ],
  },
  {
    id: 16,
    question: "아기 방 꾸미기는?",
    options: [
      { text: "테마 정하고 소품까지 컨셉 통일", type: "J" },
      { text: "필요한 거 하나씩 사면서 자연스럽게", type: "P" },
    ],
  },
];

export const PARENT_MBTI_RESULTS: Record<MBTIType, MBTIResult> = {
  ISTJ: {
    type: "ISTJ",
    title: "원칙주의 부모",
    tagline: "육아도 프로젝트처럼 완벽하게",
    strength:
      "루틴·약속·안전. 아기에게 세상에서 가장 안정적인 환경을 선물해요.",
    caution:
      "가끔은 계획을 놓아도 괜찮아요. 아기의 즉흥적인 웃음이 최고의 순간일 수도.",
    match: { type: "ESFP", reason: "융통성 있는 파트너가 균형을 맞춰줘요" },
    items: ["육아 다이어리", "수유 기록 앱", "성장 체크리스트"],
    shareCopy: "나는 '원칙주의 부모' 타입이래요. 당신은요?",
  },
  ISFJ: {
    type: "ISFJ",
    title: "헌신 만렙 부모",
    tagline: "말없이 모든 걸 챙기는 조용한 수호천사",
    strength: "세심함·인내심. 아기의 작은 변화도 놓치지 않아요.",
    caution: "본인 챙기는 것도 육아예요. 번아웃 조심!",
    match: { type: "ESTP", reason: "에너지를 불어넣어주는 파트너와 잘 맞아요" },
    items: ["편안한 수유쿠션", "좋은 유축기", "허리 보호대"],
    shareCopy: "나는 '헌신 만렙 부모' 타입이래요. 당신은요?",
  },
  INFJ: {
    type: "INFJ",
    title: "통찰력 부모",
    tagline: "아기 마음을 먼저 알아채는 특수능력 보유",
    strength: "깊은 유대감·정서적 안정감을 주는 육아.",
    caution: "너무 많은 걸 내면에 쌓아두지 마세요. 표현도 사랑이에요.",
    match: { type: "ENTP", reason: "시야를 넓혀주는 파트너와 잘 맞아요" },
    items: ["베이비 시그널북", "감정 카드", "조용한 모빌"],
    shareCopy: "나는 '통찰력 부모' 타입이래요. 당신은요?",
  },
  INTJ: {
    type: "INTJ",
    title: "마스터플랜 부모",
    tagline: "이미 아기의 20살 로드맵이 있음",
    strength: "장기적 비전·체계적 성장 설계.",
    caution: "계획보다 '지금 이 순간'의 아기를 봐주세요.",
    match: { type: "ENFP", reason: "즉흥의 매력을 알려주는 파트너와 잘 맞아요" },
    items: ["영유아 발달 체크리스트", "교육 로드맵북", "지능 발달 장난감"],
    shareCopy: "나는 '마스터플랜 부모' 타입이래요. 당신은요?",
  },
  ISTP: {
    type: "ISTP",
    title: "해결사 부모",
    tagline: "문제 생기면 조용히 뚝딱",
    strength: "실용적, 당황하지 않음. 응급상황에 강해요.",
    caution: "감정 표현도 연습하면 더 따뜻한 관계가 돼요.",
    match: { type: "ESFJ", reason: "감정의 결을 짚어주는 파트너와 잘 맞아요" },
    items: ["다용도 육아 공구", "스마트 체온계", "카시트 설치 키트"],
    shareCopy: "나는 '해결사 부모' 타입이래요. 당신은요?",
  },
  ISFP: {
    type: "ISFP",
    title: "감성 아티스트 부모",
    tagline: "아기와의 모든 순간이 작품",
    strength: "감각적인 공간·따뜻한 일상의 기록.",
    caution: "예쁜 것도 좋지만 실용성도 챙기세요.",
    match: { type: "ENFJ", reason: "비전을 공유해줄 파트너와 잘 맞아요" },
    items: ["좋은 카메라", "감성적인 육아 일기", "아기 옷 정리함"],
    shareCopy: "나는 '감성 아티스트 부모' 타입이래요. 당신은요?",
  },
  INFP: {
    type: "INFP",
    title: "이상주의 부모",
    tagline: "아기를 한 명의 인격체로 존중",
    strength: "공감 능력·아기의 개성 존중.",
    caution: "현실적인 훈육도 사랑의 한 형태예요.",
    match: { type: "ENTJ", reason: "현실감 있는 파트너와 잘 맞아요" },
    items: ["아기 감정 그림책", "내면 성장 도서", "수공예 장난감"],
    shareCopy: "나는 '이상주의 부모' 타입이래요. 당신은요?",
  },
  INTP: {
    type: "INTP",
    title: "호기심 부모",
    tagline: "아기의 모든 '왜?'에 진심으로 답함",
    strength: "지적 호기심 자극·탐구 정신.",
    caution: "설명보다 포옹이 필요한 순간도 있어요.",
    match: { type: "ESFJ", reason: "감정의 언어를 알려줄 파트너와 잘 맞아요" },
    items: ["과학 실험 키트", "자연 관찰책", "현미경 장난감"],
    shareCopy: "나는 '호기심 부모' 타입이래요. 당신은요?",
  },
  ESTP: {
    type: "ESTP",
    title: "에너자이저 부모",
    tagline: "가자, 어디든!",
    strength: "활동적·적응력. 재미있는 경험을 많이 선물해요.",
    caution: "가끔은 조용한 시간도 필요해요.",
    match: { type: "ISFJ", reason: "안정감을 주는 파트너와 잘 맞아요" },
    items: ["휴대용 유모차", "아웃도어 아기띠", "여행용 기저귀 가방"],
    shareCopy: "나는 '에너자이저 부모' 타입이래요. 당신은요?",
  },
  ESFP: {
    type: "ESFP",
    title: "파티 메이커 부모",
    tagline: "집이 놀이공원",
    strength: "즐거운 분위기·아기의 웃음이 끊이지 않아요.",
    caution: "즐거움 외에 구조도 아기에겐 안정감이에요.",
    match: { type: "ISTJ", reason: "체계를 잡아주는 파트너와 잘 맞아요" },
    items: ["다양한 놀이 도구", "이벤트 소품", "음악 완구"],
    shareCopy: "나는 '파티 메이커 부모' 타입이래요. 당신은요?",
  },
  ENFP: {
    type: "ENFP",
    title: "꿈많은 친구 부모",
    tagline: "아기의 1호 팬",
    strength: "열정·격려. 아기의 자존감이 하늘을 찔러요.",
    caution: "현실적인 한계 설정도 사랑이에요.",
    match: { type: "INTJ", reason: "차분하게 중심 잡아주는 파트너와 잘 맞아요" },
    items: ["상상력 자극 장난감", "창작 도구", "동화책 세트"],
    shareCopy: "나는 '꿈많은 친구 부모' 타입이래요. 당신은요?",
  },
  ENTP: {
    type: "ENTP",
    title: "아이디어 뱅크 부모",
    tagline: "매일 새로운 놀이 발명가",
    strength: "창의력·문제 해결. 지루할 틈이 없는 육아.",
    caution: "꾸준함도 가끔은 필요해요.",
    match: { type: "INFJ", reason: "깊이를 더해주는 파트너와 잘 맞아요" },
    items: ["변형 가능한 블록", "DIY 키트", "퍼즐 세트"],
    shareCopy: "나는 '아이디어 뱅크 부모' 타입이래요. 당신은요?",
  },
  ESTJ: {
    type: "ESTJ",
    title: "CEO 부모",
    tagline: "육아도 조직력으로",
    strength: "리더십·원칙. 가정에 질서와 안정을 부여.",
    caution: "지시보다 대화, 효율보다 과정을 즐겨보세요.",
    match: { type: "ISFP", reason: "부드러움을 더해주는 파트너와 잘 맞아요" },
    items: ["가족 플래너", "성장 체크북", "정리 수납 시스템"],
    shareCopy: "나는 'CEO 부모' 타입이래요. 당신은요?",
  },
  ESFJ: {
    type: "ESFJ",
    title: "따뜻한 허브 부모",
    tagline: "대가족 단톡방의 구심점",
    strength: "공동체 의식·풍성한 사랑의 분위기.",
    caution: "타인의 시선보다 내 가족의 목소리에 집중.",
    match: { type: "ISTP", reason: "조용한 응원을 주는 파트너와 잘 맞아요" },
    items: ["가족 앨범", "모임 준비 용품", "전통 육아 가이드"],
    shareCopy: "나는 '따뜻한 허브 부모' 타입이래요. 당신은요?",
  },
  ENFJ: {
    type: "ENFJ",
    title: "멘토 부모",
    tagline: "같이 성장해요",
    strength: "격려·동기부여. 아기가 자기 자신을 믿도록 도와요.",
    caution: "기대가 부담이 되지 않게 주의.",
    match: { type: "ISFP", reason: "순수하게 즐기는 파트너와 잘 맞아요" },
    items: ["아기 성장 기록장", "칭찬 스티커", "자존감 동화책"],
    shareCopy: "나는 '멘토 부모' 타입이래요. 당신은요?",
  },
  ENTJ: {
    type: "ENTJ",
    title: "리더 부모",
    tagline: "아기에게 세상을 보여주는 사람",
    strength: "목표 의식·추진력. 아기에게 넓은 세계를 보여줘요.",
    caution: "성취보다 아기 그 자체가 이미 최고.",
    match: { type: "INFP", reason: "감성의 결을 짚어주는 파트너와 잘 맞아요" },
    items: ["영어 학습 키트", "글로벌 감각 도서", "세계지도 퍼즐"],
    shareCopy: "나는 '리더 부모' 타입이래요. 당신은요?",
  },
};

/** 답변 축 배열을 받아서 MBTI 네 글자를 계산. 동점이면 앞쪽(E/S/T/J) 우선. */
export function computeMBTI(answers: MBTIAxis[]): MBTIType {
  const count: Record<MBTIAxis, number> = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
  };
  answers.forEach((a) => {
    count[a] = (count[a] ?? 0) + 1;
  });
  const type =
    (count.E >= count.I ? "E" : "I") +
    (count.S >= count.N ? "S" : "N") +
    (count.T >= count.F ? "T" : "F") +
    (count.J >= count.P ? "J" : "P");
  return type as MBTIType;
}
