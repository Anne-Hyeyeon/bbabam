import { RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultActionsProps {
  onReset: () => void;
  onShare: () => void;
  /** True right after the share text was copied to the clipboard. */
  copied: boolean;
  resetLabel?: string;
}

/** Reset + share button row closing every result view. */
export function ResultActions({
  onReset,
  onShare,
  copied,
  resetLabel = "다시 하기",
}: ResultActionsProps) {
  return (
    <div className="mt-5 flex gap-2">
      <Button variant="outline" className="flex-1" onClick={onReset}>
        <RotateCcw className="h-4 w-4" /> {resetLabel}
      </Button>
      <Button className="flex-1" onClick={onShare}>
        <Share2 className="h-4 w-4" />
        {copied ? "복사됐어요!" : "공유하기"}
      </Button>
    </div>
  );
}
