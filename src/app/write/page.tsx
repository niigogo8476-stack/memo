import type { Metadata } from "next";
import { WriteScreen } from "@/components/WriteScreen";

export const metadata: Metadata = { title: "새 메모 쓰기" };

export default function WritePage() {
  return <WriteScreen />;
}
