import type { BodyBlock } from "@/data/memos";

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// "**굵게**" 표기를 <strong>으로 바꾼다. 글자는 먼저 이스케이프한다.
function inlineHtml(text: string) {
  return escapeHtml(text)
    .split("**")
    .map((part, index) => (index % 2 === 1 ? `<strong>${part}</strong>` : part))
    .join("");
}

// 저장된 본문 → 편집기에 넣을 HTML
export function blocksToHtml(blocks: BodyBlock[]) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h2>${inlineHtml(block.text)}</h2>`;
        case "subheading":
          return `<h3>${inlineHtml(block.text)}</h3>`;
        case "paragraph":
          return `<p>${inlineHtml(block.text)}</p>`;
        case "list":
          return `<ul>${block.items.map((item) => `<li>${inlineHtml(item)}</li>`).join("")}</ul>`;
      }
    })
    .join("");
}

function inlineText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return (node.textContent ?? "").replace(/\*\*/g, "");
  if (!(node instanceof HTMLElement)) return "";
  if (node.tagName === "BR") return " ";
  const inner = Array.from(node.childNodes).map(inlineText).join("");
  const weight = node.style.fontWeight;
  const bold = node.tagName === "B" || node.tagName === "STRONG" || weight === "bold" || Number(weight) >= 600;
  return bold && inner.trim() !== "" ? `**${inner}**` : inner;
}

// 편집기 HTML → 저장할 본문. 제목, 소제목, 문단, 목록, 굵은 글씨만 남긴다.
export function htmlToBlocks(root: HTMLElement): BodyBlock[] {
  const blocks: BodyBlock[] = [];

  // 편집기는 <p> 안에 목록을 넣는 것처럼 블록을 겹쳐 만들 수 있어서, 안쪽까지 내려가며 읽는다.
  const walk = (parent: Node) => {
    let buffer = "";
    const flush = () => {
      if (buffer.trim() !== "") blocks.push({ type: "paragraph", text: buffer.trim() });
      buffer = "";
    };
    for (const node of Array.from(parent.childNodes)) {
      if (!(node instanceof HTMLElement)) {
        buffer += inlineText(node);
        continue;
      }
      switch (node.tagName) {
        case "H1":
        case "H2": {
          flush();
          const text = inlineText(node).trim();
          if (text !== "") blocks.push({ type: "heading", text });
          break;
        }
        case "H3":
        case "H4": {
          flush();
          const text = inlineText(node).trim();
          if (text !== "") blocks.push({ type: "subheading", text });
          break;
        }
        case "UL":
        case "OL": {
          flush();
          const items = Array.from(node.querySelectorAll("li"))
            .map((li) => inlineText(li).trim())
            .filter((item) => item !== "");
          if (items.length > 0) blocks.push({ type: "list", items });
          break;
        }
        case "P":
        case "DIV":
          flush();
          walk(node);
          break;
        default:
          buffer += inlineText(node);
      }
    }
    flush();
  };

  walk(root);
  return blocks;
}

// 목록에 보일 한 줄 미리보기
export function previewOf(blocks: BodyBlock[]) {
  const first = blocks.find((block) => block.type !== "heading") ?? blocks[0];
  if (!first) return "내용 없음";
  const text = first.type === "list" ? first.items[0] : first.text;
  const plain = text.replace(/\*\*/g, "");
  return plain.length > 40 ? `${plain.slice(0, 40)}…` : plain;
}
