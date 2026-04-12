import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";
import { KakaoScript } from "@/components/kakao-script";

const jua = Jua({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "빠밤! - 젠더리빌 카드",
  description: "우리 아기의 성별을 재미있게 공개해보세요!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={jua.className}>
        {children}
        <KakaoScript />
      </body>
    </html>
  );
}
