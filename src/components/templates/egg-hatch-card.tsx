"use client";

import type { TemplateInteractionProps } from "./index";
import { Stage } from "./egg-hatch/stage";
import { Reveal } from "./egg-hatch/reveal";
import { useEggState } from "./egg-hatch/use-egg-state";
import { jua } from "./egg-hatch/font";
import { CardGameHeader } from "./card-game-header";

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
      <CardGameHeader babyNickname={babyNickname} recipientName={recipientName} />

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
