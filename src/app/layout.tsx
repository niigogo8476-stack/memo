import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "메모",
  description: "메모를 쓰고 모아 보는 앱",
  applicationName: "메모",
  // iOS: 홈 화면에 추가하면 주소창 없이 열리고, 앱 이름은 '메모'로 보인다
  appleWebApp: { capable: true, title: "메모", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

// 상태 막대 색은 배경 토큰(surface/page)을 따른다: Light #F2F4F6, Dark #101014
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f4f6" },
    { media: "(prefers-color-scheme: dark)", color: "#101014" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
