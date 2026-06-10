"use client";

import type { TemplateInteractionProps } from "./index";
import { Stage } from "./egg-hatch/stage";
import { Reveal } from "./egg-hatch/reveal";
import { useEggState } from "./egg-hatch/use-egg-state";
import { jua } from "./egg-hatch/font";

export default function EggHatchCard({
  gender,
  babyNickname,
  recipientName,
  onReveal,
}: TemplateInteractionProps) {
  const { state, start, tap, restart, clearBurst } = useEggState();
  const showReveal = state.phase === "reveal";

  return (
    <div className={`flex flex-col items-center gap-4 p-6 ${jua.className}`}>
      {recipientName && (
        <p className="text-text-secondary text-sm">
          {recipientName}님을 위한 카드
        </p>
      )}
      <h2 className="text-xl text-center">{babyNickname}의 성별은?</h2>

      {showReveal ? (
        <Reveal
          gender={gender}
          babyNickname={babyNickname}
          onReveal={onReveal}
          onReplay={restart}
        />
      ) : (
        <Stage
          babyNickname={babyNickname}
          state={state}
          onStart={start}
          onTap={tap}
          onBurstDone={clearBurst}
        />
      )}
    </div>
  );
}
