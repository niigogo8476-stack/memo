"use client";

import { useMemos, useToday } from "@/lib/use-memos";

// 홈 위쪽: 오늘 날짜와 저장된 메모 개수
export function HomeHeader() {
  const memos = useMemos();
  const today = useToday();

  return (
    <header className="flex shrink-0 flex-col gap-(--space-8) px-(--space-8)">
      <p className="min-h-5.5 text-caption-md text-text-muted">{today}</p>
      <h1 className="text-heading-xl text-text-primary">
        오늘까지 메모를
        <br />
        <span className="text-primary">{memos.length}개</span> 남겼어요
      </h1>
    </header>
  );
}
