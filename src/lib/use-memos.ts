"use client";

import { useSyncExternalStore } from "react";
import { formatToday, todayStart } from "./format";
import { getMemosSnapshot, getServerMemosSnapshot, subscribeMemos } from "./memo-store";

const noopSubscribe = () => () => {};

// 저장된 메모 목록. 서버에서 그릴 때는 예시 메모를 쓰고, 브라우저에서 저장된 메모로 바뀐다.
export function useMemos() {
  return useSyncExternalStore(subscribeMemos, getMemosSnapshot, getServerMemosSnapshot);
}

// 브라우저에서 화면이 붙은 뒤에만 true. localStorage를 읽는 화면에서 쓴다.
export function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

// 지금 날짜는 브라우저에서만 안다. 서버에서는 빈 글자를 돌려준다.
export function useToday() {
  return useSyncExternalStore(noopSubscribe, () => formatToday(new Date()), () => "");
}

// 오늘 0시의 시각. 메모 날짜를 오늘, 어제로 나눌 때 기준이 된다.
export function useTodayStart() {
  return useSyncExternalStore(noopSubscribe, () => todayStart(new Date()), () => 0);
}
