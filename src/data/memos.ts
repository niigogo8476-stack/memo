export type MemoColor = "blue" | "green" | "orange" | "pink";
export type Category = "업무" | "개인" | "아이디어";

// 본문은 블록 목록이다: 대제목, 소제목, 문단, 목록. 문단의 **굵게**는 별표 두 개로 감싼다.
export type BodyBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type Memo = {
  id: number;
  title: string;
  preview: string;
  date: string;
  createdAt: string;
  color: MemoColor;
  category: Category;
  pinned: boolean;
  body: BodyBlock[];
  // 직접 쓴 메모에만 있다. 있으면 date, createdAt 대신 이 시각으로 날짜 글자를 만든다.
  timestamp?: number;
};

export const memos: Memo[] = [
  {
    id: 1,
    title: "디자인 리뷰 회의록",
    preview: "검수 기준과 다음 할 일 정리",
    date: "오늘",
    createdAt: "10월 30일 오전 9:12",
    color: "blue",
    category: "업무",
    pinned: true,
    body: [
      { type: "heading", text: "회의 요약" },
      { type: "paragraph", text: "**디자인 토큰**만 쓰고, 같은 UI는 **기존 컴포넌트**를 재사용해요." },
      { type: "subheading", text: "결정한 것" },
      { type: "list", items: ["색은 변수로 연결하기", "글자는 텍스트 스타일로 적용하기", "레이어 이름은 역할 이름으로 쓰기"] },
      { type: "subheading", text: "다음 할 일" },
      { type: "paragraph", text: "**금요일까지** 각자 화면을 점검하고 위반 항목은 댓글로 남겨요." },
      { type: "subheading", text: "남은 질문" },
      { type: "paragraph", text: "다크 모드 색은 누가 정할지 다음 회의에서 정해요." },
    ],
  },
  {
    id: 2,
    title: "주말 등산 준비",
    preview: "물 두 병, 간식, 바람막이 챙기기",
    date: "어제",
    createdAt: "10월 29일 오후 8:40",
    color: "green",
    category: "개인",
    pinned: true,
    body: [
      { type: "heading", text: "토요일 산행" },
      { type: "paragraph", text: "**오전 7시**에 집에서 출발해서 정상까지 천천히 올라가요." },
      { type: "subheading", text: "챙길 것" },
      { type: "list", items: ["물 두 병", "간식과 견과류", "바람막이"] },
      { type: "subheading", text: "메모" },
      { type: "paragraph", text: "비 예보가 있으면 일요일로 미뤄요." },
    ],
  },
  {
    id: 3,
    title: "장보기 목록",
    preview: "우유, 계란, 사과, 커피 원두",
    date: "오늘",
    createdAt: "10월 30일 오전 8:05",
    color: "pink",
    category: "개인",
    pinned: false,
    body: [
      { type: "heading", text: "이번 주 장보기" },
      { type: "subheading", text: "사야 할 것" },
      { type: "list", items: ["우유", "계란", "사과", "커피 원두"] },
      { type: "paragraph", text: "퇴근길에 **마트**에 들러요." },
    ],
  },
  {
    id: 4,
    title: "앱 아이콘 아이디어",
    preview: "메모지 모서리가 접힌 모양",
    date: "오늘",
    createdAt: "10월 30일 오전 7:30",
    color: "orange",
    category: "아이디어",
    pinned: false,
    body: [
      { type: "heading", text: "아이콘 방향" },
      { type: "paragraph", text: "**메모지 모서리가 접힌 모양**을 기본으로 잡아요." },
      { type: "subheading", text: "후보" },
      { type: "list", items: ["파란 바탕에 흰 메모지", "모서리에 작은 접힘 표시", "연필 대신 줄 세 개"] },
    ],
  },
  {
    id: 5,
    title: "읽을 책",
    preview: "디자인 시스템 책 두 권",
    date: "어제",
    createdAt: "10월 29일 오후 6:20",
    color: "green",
    category: "개인",
    pinned: false,
    body: [
      { type: "heading", text: "이번 달 독서" },
      { type: "paragraph", text: "**디자인 시스템** 책을 두 권 읽어요." },
      { type: "subheading", text: "목록" },
      { type: "list", items: ["디자인 시스템 구축 가이드", "컴포넌트 설계 원칙"] },
    ],
  },
];

export function getMemo(id: number) {
  return memos.find((memo) => memo.id === id);
}
