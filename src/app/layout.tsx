import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { KakaoScript } from "@/components/kakao-script";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-kr",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "빠밤! — 임신·출산 축하 도구 모음",
  description:
    "성별 맞추기, 태명 생성기, 임밍아웃·젠더리빌 카드까지. 임신부터 출산까지 쓸 수 있는 따뜻한 도구들.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSansKR.variable}`}>
      <body>
        {children}
        <KakaoScript />
      </body>
    </html>
  );
}
