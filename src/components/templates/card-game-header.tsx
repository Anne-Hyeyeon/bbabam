import { jua } from "./egg-hatch/font";

interface CardGameHeaderProps {
  babyNickname: string;
  recipientName?: string;
}

/** Shared greeting header above every card game stage. */
export function CardGameHeader({ babyNickname, recipientName }: CardGameHeaderProps) {
  return (
    <div className="text-center">
      {recipientName && (
        <p className="text-[13px] text-[var(--color-ink-muted)]">
          {recipientName}님을 위한 카드
        </p>
      )}
      <h2 className={`${jua.className} mt-1 text-[22px] text-[var(--color-ink)]`}>
        {babyNickname}의 성별은?
      </h2>
    </div>
  );
}
