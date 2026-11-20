"use client";

import type { BodyBlock, MemoColor } from "@/data/memos";
import { createdLabel } from "@/lib/format";
import { useIsClient, useMemos } from "@/lib/use-memos";

// Badge 컴포넌트: 색은 메모의 색 라벨을 따른다.
const badgeClass: Record<MemoColor, string> = {
  blue: "bg-label-blue-soft text-label-blue",
  green: "bg-label-green-soft text-label-green",
  orange: "bg-label-orange-soft text-label-orange",
  pink: "bg-label-pink-soft text-label-pink",
};

const cardClass = "rounded-xl bg-surface-card";

// 문단 안의 **굵게**를 강조 글자로 바꾼다.
function RichText({ text }: { text: string }) {
  return text.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-bold text-text-primary">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function Block({ block }: { block: BodyBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="text-title-lg text-text-primary">
          <RichText text={block.text} />
        </h2>
      );
    case "subheading":
      return (
        <h3 className="text-title-md text-text-primary">
          <RichText text={block.text} />
        </h3>
      );
    case "paragraph":
      return (
        <p className="text-body-md text-text-secondary">
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-(--space-4)">
          {block.items.map((item, index) => (
            <li key={index} className="flex gap-(--space-8) text-body-md text-text-secondary">
              <span aria-hidden="true">•</span>
              <span className="min-w-0 flex-1">
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
  }
}

// 메모 상세 카드. 저장된 메모는 이 브라우저에서 읽는다.
export function MemoDetail({ id }: { id: number }) {
  const memos = useMemos();
  const isClient = useIsClient();
  const memo = memos.find((item) => item.id === id);

  if (!memo) {
    return isClient ? (
      <p className={`${cardClass} px-(--space-20) py-(--space-24) text-body-md text-text-secondary`}>
        이 메모를 찾을 수 없어요. 이 브라우저에 저장된 메모만 볼 수 있어요.
      </p>
    ) : (
      <div className={`${cardClass} min-h-40`} />
    );
  }

  return (
    <article className={`${cardClass} flex flex-col gap-(--space-12) px-(--space-20) py-(--space-24)`}>
      <div className="flex items-center gap-(--space-8)">
        <span className={`flex h-6.5 items-center rounded-full px-(--space-8) text-caption-sm ${badgeClass[memo.color]}`}>
          {memo.category}
        </span>
        <time className="text-caption-sm text-text-muted">{createdLabel(memo)}</time>
      </div>
      <h1 className="text-heading-lg text-text-primary">{memo.title}</h1>
      <hr className="h-px border-0 bg-border-default" />
      <div className="flex flex-col gap-(--space-12)">
        {memo.body.map((block, index) => (
          <Block key={index} block={block} />
        ))}
      </div>
    </article>
  );
}
