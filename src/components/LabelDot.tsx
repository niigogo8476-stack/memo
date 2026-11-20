import type { MemoColor } from "@/data/memos";

// Label/Dot 컴포넌트: 색 라벨 고르기. 고른 색은 바깥에 파란 테두리(2px)가 생긴다.
const dotClass: Record<MemoColor, string> = {
  blue: "bg-label-blue",
  green: "bg-label-green",
  orange: "bg-label-orange",
  pink: "bg-label-pink",
};

const colorName: Record<MemoColor, string> = {
  blue: "파랑",
  green: "초록",
  orange: "주황",
  pink: "분홍",
};

type LabelDotProps = {
  color: MemoColor;
  selected: boolean;
  onClick: () => void;
};

export function LabelDot({ color, selected, onClick }: LabelDotProps) {
  return (
    <button
      type="button"
      aria-label={`색 ${colorName[color]}`}
      aria-pressed={selected}
      onClick={onClick}
      className={`grid size-8 shrink-0 place-items-center rounded-full border-2 ${
        selected ? "border-primary" : "border-transparent"
      }`}
    >
      <span className={`size-5.5 rounded-full ${dotClass[color]}`} />
    </button>
  );
}
