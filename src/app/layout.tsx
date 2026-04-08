import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { KakaoScript } from "@/components/kakao-script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "빠밤 BBABAM - 젠더리빌 카드",
  description: "인터랙티브 게임 카드로 아기 성별을 재밌게 알려주세요!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {children}
        <KakaoScript />
      </body>
    </html>
  );
}
