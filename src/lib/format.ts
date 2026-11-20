import type { Memo } from "@/data/memos";

export function todayStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

// 목록 오른쪽 날짜: 오늘, 어제, 그 전에는 "10월 28일". today는 오늘 0시의 시각이다.
export function listDate(memo: Memo, today: number) {
  if (memo.timestamp === undefined) return memo.date;
  const written = new Date(memo.timestamp);
  const days = Math.round((today - todayStart(written)) / 86_400_000);
  if (days <= 0) return "오늘";
  if (days === 1) return "어제";
  return `${written.getMonth() + 1}월 ${written.getDate()}일`;
}

// 상세 위쪽 날짜: "10월 30일 오전 9:12"
export function createdLabel(memo: Memo) {
  if (memo.timestamp === undefined) return memo.createdAt;
  return formatDateTime(memo.timestamp);
}

export function formatDateTime(timestamp: number) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const period = hours < 12 ? "오전" : "오후";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${period} ${hour12}:${minutes}`;
}

// 홈 위쪽 날짜: "10월 30일 금요일"
export function formatToday(date: Date) {
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${weekday}요일`;
}
