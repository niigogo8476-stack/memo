import Link from "next/link";
import { Suspense } from "react";
import { MemoDetail } from "@/components/MemoDetail";
import { PrimaryButton } from "@/components/PrimaryButton";
import { IconChevronLeft, IconMore, IconPinLarge, IconShare } from "@/components/icons";
import { memos } from "@/data/memos";

// Button/Icon 컴포넌트: 40×40 누르는 영역 가운데에 아이콘을 둔다.
const iconButton = "grid size-10 place-items-center rounded-sm text-text-primary";

// 예시 메모만 미리 만들어 둔다. 직접 쓴 메모는 열 때 이 브라우저에서 읽는다.
export function generateStaticParams() {
  return memos.map((memo) => ({ id: String(memo.id) }));
}

// URL의 id를 읽는 부분만 Suspense 안에 둔다. 앱 바와 버튼은 바로 보인다.
async function MemoRoute({ params }: { params: PageProps<"/memos/[id]">["params"] }) {
  const { id } = await params;
  return <MemoDetail id={Number(id)} />;
}

export default function MemoDetailPage(props: PageProps<"/memos/[id]">) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-97.5 flex-col gap-(--space-16) px-(--space-16) pt-(--space-48) pb-(--space-34)">
      <nav className="flex items-center justify-between">
        <Link href="/" aria-label="뒤로가기" className={iconButton}>
          <IconChevronLeft />
        </Link>
        <div className="flex">
          <button type="button" aria-label="고정" className={iconButton}>
            <IconPinLarge />
          </button>
          <button type="button" aria-label="공유" className={iconButton}>
            <IconShare />
          </button>
          <button type="button" aria-label="더보기" className={iconButton}>
            <IconMore />
          </button>
        </div>
      </nav>

      <main className="flex flex-1 flex-col">
        <Suspense fallback={<div className="min-h-40 rounded-xl bg-surface-card" />}>
          <MemoRoute params={props.params} />
        </Suspense>
      </main>

      <PrimaryButton>수정하기</PrimaryButton>
    </div>
  );
}
