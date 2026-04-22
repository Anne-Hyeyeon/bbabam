"use client";

import type { TemplateInteractionProps } from "./index";
import { Stage } from "./egg-hatch/stage";
import { Reveal } from "./egg-hatch/reveal";
import { useEggState } from "./egg-hatch/use-egg-state";
import { KENNEY_PARTICLES } from "./egg-hatch/constants";

export default function EggHatchCard({
  gender,
  babyNickname,
  recipientName,
  onReveal,
}: TemplateInteractionProps) {
  const { state, start, tap, restart, clearBurst } = useEggState();
  const showReveal = state.phase === "reveal";

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {/* Preload key Kenney particles so the first tap has no flash of empty */}
      <link rel="preload" as="image" href={KENNEY_PARTICLES.flare} />
      <link rel="preload" as="image" href={KENNEY_PARTICLES.light1} />
      <link rel="preload" as="image" href={KENNEY_PARTICLES.spark1} />
      <link rel="preload" as="image" href={KENNEY_PARTICLES.star2} />
      <link rel="preload" as="image" href={KENNEY_PARTICLES.magic1} />

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
          gender={gender}
          state={state}
          onStart={start}
          onTap={tap}
          onBurstDone={clearBurst}
        />
      )}
    </div>
  );
}
