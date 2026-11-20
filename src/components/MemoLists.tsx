"use client";

import { useState } from "react";
import type { Category, Memo } from "@/data/memos";
import { listDate } from "@/lib/format";
import { useMemos, useTodayStart } from "@/lib/use-memos";
import { CardHeader } from "./CardHeader";
import { Chip } from "./Chip";
import { MemoItem } from "./MemoItem";

const categories = ["전체", "업무", "개인", "아이디어"] as const;
type Selected = "전체" | Category;

// 분류 칩은 고정하고, 메모 카드가 있는 아래쪽만 위아래로 스크롤된다.
export function MemoLists() {
  const memos = useMemos();
  const today = useTodayStart();
  const [selected, setSelected] = useState<Selected>("전체");
  const visible = (list: Memo[]) =>
    selected === "전체" ? list : list.filter((memo) => memo.category === selected);
  const pinned = visible(memos.filter((memo) => memo.pinned));
  const recent = visible(memos.filter((memo) => !memo.pinned));

  const renderItem = (memo: Memo) => (
    <MemoItem
      key={memo.id}
      id={memo.id}
      title={memo.title}
      preview={memo.preview}
      date={listDate(memo, today)}
      color={memo.color}
    />
  );

  return (
    <>
      <div className="flex shrink-0 gap-(--space-8) overflow-x-auto px-(--space-4)" role="group" aria-label="메모 분류">
        {categories.map((category) => (
          <Chip key={category} selected={selected === category} onClick={() => setSelected(category)}>
            {category}
          </Chip>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-(--space-16) overflow-y-auto" aria-label="메모 목록" role="region" tabIndex={0}>
        {pinned.length > 0 && (
          <section className="shrink-0 rounded-xl bg-surface-card py-(--space-8)" aria-label="고정한 메모">
            <CardHeader title="고정한 메모" pin />
            {pinned.map(renderItem)}
          </section>
        )}

        {recent.length > 0 && (
          <section className="shrink-0 rounded-xl bg-surface-card py-(--space-8)" aria-label="최근 메모">
            <CardHeader title="최근 메모" action="전체 보기" />
            {recent.map(renderItem)}
          </section>
        )}
      </div>
    </>
  );
}
