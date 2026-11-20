import { HomeHeader } from "@/components/HomeHeader";
import { MemoLists } from "@/components/MemoLists";
import { PrimaryButton } from "@/components/PrimaryButton";
import { IconPlus } from "@/components/icons";

// 화면 높이는 고정이다. 위쪽(날짜, 제목, 분류 칩)과 아래쪽 버튼은 그대로 두고 메모 목록만 스크롤된다.
export default function Home() {
  return (
    <div className="mx-auto flex h-dvh w-full max-w-97.5 flex-col gap-(--space-16) overflow-hidden px-(--space-16) pt-(--space-64) pb-(--space-34)">
      <main className="flex min-h-0 flex-1 flex-col gap-(--space-16)">
        <HomeHeader />
        <MemoLists />
      </main>

      <PrimaryButton href="/write" icon={<IconPlus className="shrink-0" />}>
        새 메모 쓰기
      </PrimaryButton>
    </div>
  );
}
