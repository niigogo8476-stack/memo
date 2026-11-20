"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ClipboardEvent, type MouseEvent } from "react";
import type { Category, MemoColor } from "@/data/memos";
import { blocksToHtml, htmlToBlocks, previewOf } from "@/lib/editor";
import { addMemo, clearDraft, loadDraft, saveDraft } from "@/lib/memo-store";
import { useIsClient } from "@/lib/use-memos";
import { Chip } from "./Chip";
import { LabelDot } from "./LabelDot";
import { PrimaryButton } from "./PrimaryButton";
import { IconChevronLeft } from "./icons";

const categories: Category[] = ["업무", "개인", "아이디어"];
const colors: MemoColor[] = ["blue", "green", "orange", "pink"];

type Format = { bold: boolean; h2: boolean; h3: boolean; list: boolean };
const noFormat: Format = { bold: false, h2: false, h3: false, list: false };

const optionLabel = "text-caption-sm whitespace-nowrap text-text-muted";

// Button/Format 컴포넌트: 서식 버튼. 커서가 있는 글자의 서식은 active로 보인다.
function FormatButton({
  active,
  label,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      // 눌러도 편집기의 글자 선택이 풀리지 않게 한다
      onMouseDown={(event: MouseEvent) => event.preventDefault()}
      onClick={onClick}
      className={`flex h-9 items-center justify-center rounded-sm px-(--space-12) text-label-md whitespace-nowrap ${
        active ? "bg-label-blue-soft text-primary" : "text-text-secondary"
      }`}
    >
      {children}
    </button>
  );
}

function WriteForm() {
  const router = useRouter();
  // 쓰던 메모(임시 저장)가 있으면 이어서 쓴다. 이 컴포넌트는 브라우저에서만 그려진다.
  const [draft] = useState(() => loadDraft());
  const [title, setTitle] = useState(draft?.title ?? "");
  const [category, setCategory] = useState<Category>(draft?.category ?? "개인");
  const [color, setColor] = useState<MemoColor>(draft?.color ?? "blue");
  const [edits, setEdits] = useState(0);
  const [format, setFormat] = useState<Format>(noFormat);
  const [autoSaved, setAutoSaved] = useState(false);
  const [error, setError] = useState("");
  const [initialHtml] = useState(() => blocksToHtml(draft?.body ?? []));
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // 줄바꿈은 문단(<p>)으로 만든다
  useEffect(() => {
    document.execCommand("defaultParagraphSeparator", false, "p");
  }, []);

  // 커서가 있는 글자의 서식을 서식 막대에 보여 준다
  useEffect(() => {
    const update = () => {
      const editor = editorRef.current;
      const selection = window.getSelection();
      if (!editor || !selection?.anchorNode || !editor.contains(selection.anchorNode)) return;
      let node: Node | null = selection.anchorNode;
      while (node && node.parentNode !== editor) node = node.parentNode;
      const tag = node instanceof HTMLElement ? node.tagName : "";
      setFormat({
        bold: document.queryCommandState("bold"),
        h2: tag === "H2",
        h3: tag === "H3",
        list: tag === "UL" || tag === "OL",
      });
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  // 쓰는 동안 잠깐 멈추면 임시 저장한다
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const editor = editorRef.current;
      if (!editor) return;
      const body = htmlToBlocks(editor);
      if (title.trim() === "" && body.length === 0) {
        clearDraft();
        setAutoSaved(false);
        return;
      }
      setAutoSaved(saveDraft({ title, category, color, body }));
    }, 400);
    return () => window.clearTimeout(timer);
  }, [title, category, color, edits]);

  const markEdited = () => setEdits((count) => count + 1);

  const runCommand = (command: string, value?: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    // 비어 있으면 서식을 입힐 줄이 없다. 빈 줄을 하나 만들고 그 안에 커서를 둔다.
    if (editor.childNodes.length === 0) {
      editor.innerHTML = "<p><br></p>";
      const range = document.createRange();
      range.setStart(editor.firstChild as Node, 0);
      range.collapse(true);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    editor.focus();
    document.execCommand(command, false, value);
    markEdited();
  };

  const toggleBlock = (tag: "h2" | "h3") => {
    const active = tag === "h2" ? format.h2 : format.h3;
    runCommand("formatBlock", active ? "<p>" : `<${tag}>`);
  };

  const handleInput = () => {
    const editor = editorRef.current;
    // 지운 뒤 남은 빈 줄 때문에 안내 문구가 사라지지 않게 한다
    // 빈 제목 줄이나 빈 목록 줄은 서식을 입힌 것이므로 지우지 않는다
    if (editor && editor.textContent === "" && /^(<br>|<(p|div)><br><\/(p|div)>)?$/.test(editor.innerHTML)) {
      editor.innerHTML = "";
    }
    // 맨 앞에 줄 없이 쓴 글자는 문단으로 감싼다
    if (editor?.firstChild?.nodeType === Node.TEXT_NODE) document.execCommand("formatBlock", false, "<p>");
    markEdited();
  };

  // 붙여넣을 때는 서식 없이 글자만 넣는다
  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
  };

  const save = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const body = htmlToBlocks(editor);
    if (title.trim() === "" && body.length === 0) {
      titleRef.current?.focus();
      setError("제목이나 내용을 먼저 써 주세요.");
      return;
    }
    const now = Date.now();
    const saved = addMemo({
      title: title.trim() || "제목 없음",
      preview: previewOf(body),
      date: "오늘",
      createdAt: "",
      color,
      category,
      pinned: false,
      body,
      timestamp: now,
    });
    if (!saved) {
      setError("이 브라우저에 저장하지 못했어요. 저장 공간이 부족하거나 비공개 창일 수 있어요.");
      return;
    }
    clearDraft();
    router.push(`/memos/${saved.id}`);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-97.5 flex-col gap-(--space-16) px-(--space-16) pt-(--space-48)">
      <nav className="flex items-center justify-between">
        <Link href="/" aria-label="뒤로가기" className="grid size-10 place-items-center rounded-sm text-text-primary">
          <IconChevronLeft />
        </Link>
        <p className="text-caption-sm text-text-muted" aria-live="polite">
          {autoSaved ? "자동 저장됨" : "새 메모"}
        </p>
      </nav>

      <main className="flex flex-1 flex-col gap-(--space-12)">
        {/* Input/Field: 제목 입력 칸. 입력 중에는 파란 테두리를 보인다 */}
        <label className="flex flex-col gap-(--space-4) rounded-lg bg-surface-card px-(--space-20) py-(--space-16) focus-within:inset-ring-2 focus-within:inset-ring-primary">
          <span className="text-caption-sm text-text-muted">제목</span>
          <input
            ref={titleRef}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setError("");
            }}
            placeholder="제목을 입력해 주세요"
            className="w-full bg-transparent text-title-md text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>

        <div className="flex flex-col gap-(--space-12) px-(--space-8) py-(--space-4)">
          <div className="flex items-center gap-(--space-8)">
            <span className={optionLabel}>분류</span>
            {categories.map((item) => (
              <Chip key={item} selected={category === item} onClick={() => setCategory(item)}>
                {item}
              </Chip>
            ))}
          </div>
          <div className="flex items-center gap-(--space-8)">
            <span className={optionLabel}>색</span>
            {colors.map((item) => (
              <LabelDot key={item} color={item} selected={color === item} onClick={() => setColor(item)} />
            ))}
          </div>
        </div>

        {/* Editor: 서식 막대 + 본문 */}
        <div className="flex flex-col overflow-clip rounded-lg border-2 border-transparent bg-surface-card focus-within:border-primary">
          <div className="flex h-13 items-center gap-(--space-4) px-(--space-12)" role="toolbar" aria-label="서식">
            <FormatButton active={format.bold} label="굵게" onClick={() => runCommand("bold")}>
              B
            </FormatButton>
            <FormatButton active={format.h2} label="제목" onClick={() => toggleBlock("h2")}>
              제목
            </FormatButton>
            <FormatButton active={format.h3} label="소제목" onClick={() => toggleBlock("h3")}>
              소제목
            </FormatButton>
            <FormatButton active={format.list} label="목록" onClick={() => runCommand("insertUnorderedList")}>
              목록
            </FormatButton>
          </div>
          <hr className="h-px border-0 bg-border-default" />
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label="메모 내용"
            data-placeholder="내용을 입력해 주세요"
            className="memo-editor min-h-48 px-(--space-20) py-(--space-16)"
            onInput={handleInput}
            onPaste={handlePaste}
            dangerouslySetInnerHTML={{ __html: initialHtml }}
          />
        </div>
      </main>

      {/* 길게 써서 스크롤돼도 저장 버튼은 화면 아래에 붙어 있다 */}
      <div className="sticky bottom-0 flex flex-col gap-(--space-8) bg-surface-page pt-(--space-8) pb-(--space-34)">
        {error && (
          <p role="alert" className="px-(--space-8) text-caption-sm text-text-secondary">
            {error}
          </p>
        )}
        <PrimaryButton onClick={save}>저장하기</PrimaryButton>
      </div>
    </div>
  );
}

// 임시 저장을 읽는 건 브라우저에서만 할 수 있어서, 화면이 붙은 뒤에 폼을 그린다.
export function WriteScreen() {
  const isClient = useIsClient();
  return isClient ? <WriteForm /> : <div className="min-h-dvh" />;
}
