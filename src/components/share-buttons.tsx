"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url: string;
  babyNickname: string;
}


export function ShareButtons({ url, babyNickname }: ShareButtonsProps) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKakaoShare = () => {
    if (typeof window !== "undefined" && window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `${babyNickname}의 성별을 확인해보세요!`,
          description: "빠밤! 젠더리빌 카드가 도착했어요",
          imageUrl: `${window.location.origin}${url}/opengraph-image`,
          link: { mobileWebUrl: fullUrl, webUrl: fullUrl },
        },
        buttons: [{ title: "확인하기", link: { mobileWebUrl: fullUrl, webUrl: fullUrl } }],
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
        <span className="text-sm text-gray-600 truncate flex-1">{fullUrl}</span>
      </div>
      <Button onClick={handleCopy} variant="outline" className="w-full">
        {copied ? t("copied") : t("copyLink")}
      </Button>
      <Button onClick={handleKakaoShare} className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
        {t("shareKakao")}
      </Button>
    </div>
  );
}
