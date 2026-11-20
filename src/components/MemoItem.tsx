import Link from "next/link";
import type { MemoColor } from "@/data/memos";
import { IconNote } from "./icons";

// Memo/Item 컴포넌트: 왼쪽 칸 색은 메모의 색 라벨이다. 누르면 메모 상세로 이동한다.
export const tileClass: Record<MemoColor, string> = {
  blue: "bg-label-blue-soft text-label-blue",
  green: "bg-label-green-soft text-label-green",
  orange: "bg-label-orange-soft text-label-orange",
  pink: "bg-label-pink-soft text-label-pink",
};

type MemoItemProps = {
  id: number;
  title: string;
  preview: string;
  date: string;
  color: MemoColor;
};

export function MemoItem({ id, title, preview, date, color }: MemoItemProps) {
  return (
    <Link
      href={`/memos/${id}`}
      className="flex h-18 w-full items-center gap-(--space-16) px-(--space-20) py-(--space-12) text-left"
    >
      <span className={`grid size-11 shrink-0 place-items-center rounded-sm ${tileClass[color]}`}>
        <IconNote className="size-5.5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-(--space-4)">
        <span className="truncate text-title-md text-text-primary">{title}</span>
        <span className="truncate text-body-sm text-text-secondary">{preview}</span>
      </span>
      <span className="shrink-0 whitespace-nowrap text-caption-sm text-text-muted">{date}</span>
    </Link>
  );
}
