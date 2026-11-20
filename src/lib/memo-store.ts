import { memos as seedMemos, type BodyBlock, type Category, type Memo, type MemoColor } from "@/data/memos";

// 메모는 이 브라우저의 localStorage에만 저장된다. 서버로 보내지 않는다.
const MEMOS_KEY = "memo-app:memos";
const DRAFT_KEY = "memo-app:draft";

export type Draft = {
  title: string;
  category: Category;
  color: MemoColor;
  body: BodyBlock[];
};

const listeners = new Set<() => void>();
let memoCache: { raw: string | null; value: Memo[] } | null = null;

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeMemos(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// 저장된 메모가 없으면 시안의 예시 메모를 보여 준다. 첫 저장 때 예시도 함께 저장된다.
export function getMemosSnapshot(): Memo[] {
  const raw = readStorage(MEMOS_KEY);
  if (memoCache && memoCache.raw === raw) return memoCache.value;
  let value = seedMemos;
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) value = parsed as Memo[];
    } catch {
      value = seedMemos;
    }
  }
  memoCache = { raw, value };
  return value;
}

export function getServerMemosSnapshot(): Memo[] {
  return seedMemos;
}

// 저장에 실패하면(저장 공간이 없거나 비공개 창) null을 돌려준다.
export function addMemo(memo: Omit<Memo, "id">): Memo | null {
  const current = getMemosSnapshot();
  const id = Math.max(0, ...current.map((item) => item.id)) + 1;
  const saved: Memo = { ...memo, id };
  if (!writeStorage(MEMOS_KEY, JSON.stringify([saved, ...current]))) return null;
  emit();
  return saved;
}

export function loadDraft(): Draft | null {
  const raw = readStorage(DRAFT_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Draft>;
    if (typeof parsed.title !== "string" || !Array.isArray(parsed.body)) return null;
    return {
      title: parsed.title,
      category: parsed.category ?? "개인",
      color: parsed.color ?? "blue",
      body: parsed.body,
    };
  } catch {
    return null;
  }
}

export function saveDraft(draft: Draft) {
  return writeStorage(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  writeStorage(DRAFT_KEY, null);
}
