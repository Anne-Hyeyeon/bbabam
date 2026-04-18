"use client";

import { useState } from "react";
import { Info, RotateCcw, Share2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BABY_GENETICS_META,
  GENETICS_FUN_FACTS,
  HEREDITY_CULPRITS,
  PARENT_TRAIT_OPTIONS,
  predictBabyGenetics,
} from "@/features/baby-genetics/data";
import { josaEunNeun } from "@/features/baby-genetics/share";
import type {
  BabyGeneticsInput,
  BabyGeneticsResult,
  ParentTraits,
} from "@/features/baby-genetics/types";

const FATHER_DEFAULT: ParentTraits = {
  heightCm: 175,
  doubleEyelid: "yes",
  hair: "straight",
  dimples: "no",
  bloodType: "A",
  personality: "ambivert",
  paternalGrandfatherBald: "no",
};

const MOTHER_DEFAULT: ParentTraits = {
  heightCm: 162,
  doubleEyelid: "yes",
  hair: "straight",
  dimples: "no",
  bloodType: "A",
  personality: "ambivert",
  maternalGrandfatherBald: "no",
};

export default function BabyGeneticsPage() {
  const [father, setFather] = useState<ParentTraits>(FATHER_DEFAULT);
  const [mother, setMother] = useState<ParentTraits>(MOTHER_DEFAULT);
  const [babySex, setBabySex] = useState<"boy" | "girl" | "unknown">("unknown");
  const [nickname, setNickname] = useState("");
  const [result, setResult] = useState<BabyGeneticsResult | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  function predict() {
    const safeFather = {
      ...father,
      heightCm:
        Number.isFinite(father.heightCm) && father.heightCm > 0 ? father.heightCm : 175,
    };
    const safeMother = {
      ...mother,
      heightCm:
        Number.isFinite(mother.heightCm) && mother.heightCm > 0 ? mother.heightCm : 162,
    };
    const input: BabyGeneticsInput = {
      father: safeFather,
      mother: safeMother,
      babySex,
    };
    setResult(predictBabyGenetics(input));
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  }

  function reset() {
    setResult(null);
    setShareCopied(false);
  }

  async function share() {
    if (!result) return;
    const displayName = nickname.trim() || "아기";
    const h = pickHeight(result);
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}`
        : "https://bbabam.com/genetics";
    const text = `우리 ${displayName}의 예상 키: ${h.min}~${h.max}cm\n빠밤!에서 직접 예측해봤어요 → ${url}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${displayName}의 유전자 예상`,
          text,
        });
        return;
      } catch {
        /* user cancelled — fall through to clipboard */
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }

  return (
    <>
      <Header showBack />
      <main className="mx-auto w-full max-w-[480px] min-h-screen bg-[var(--color-surface)] pb-10">
        {result ? (
          <ResultView
            result={result}
            nickname={nickname.trim()}
            shareCopied={shareCopied}
            onReset={reset}
            onShare={share}
          />
        ) : (
          <InputView
            father={father}
            mother={mother}
            babySex={babySex}
            nickname={nickname}
            onNicknameChange={setNickname}
            onFatherChange={setFather}
            onMotherChange={setMother}
            onBabySexChange={setBabySex}
            onPredict={predict}
          />
        )}
      </main>
    </>
  );
}

/* ============================================================
 * Input View
 * ============================================================ */
function InputView({
  father,
  mother,
  babySex,
  nickname,
  onNicknameChange,
  onFatherChange,
  onMotherChange,
  onBabySexChange,
  onPredict,
}: {
  father: ParentTraits;
  mother: ParentTraits;
  babySex: "boy" | "girl" | "unknown";
  nickname: string;
  onNicknameChange: (v: string) => void;
  onFatherChange: (t: ParentTraits) => void;
  onMotherChange: (t: ParentTraits) => void;
  onBabySexChange: (s: "boy" | "girl" | "unknown") => void;
  onPredict: () => void;
}) {
  return (
    <div className="px-4 py-6">
      <div className="text-center">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "var(--color-cat-sage)" }}
        >
          <DnaIcon className="h-8 w-8 text-[var(--color-ink)]" />
        </div>
        <h1 className="text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
          {BABY_GENETICS_META.title}
        </h1>
        <p className="mt-1.5 text-[13px] text-[var(--color-ink-muted)]">
          {BABY_GENETICS_META.subtitle}
        </p>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-[15px]">
            아기 정보{" "}
            <span className="ml-1 text-[11.5px] font-normal text-[var(--color-ink-muted)]">
              (선택)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="baby-nickname">태명</Label>
            <Input
              id="baby-nickname"
              value={nickname}
              placeholder="예: 콩이, 복덩이"
              onChange={(e) => onNicknameChange(e.target.value)}
              maxLength={12}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-[15px]">아빠 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TraitForm
            traits={father}
            onChange={onFatherChange}
            side="father"
          />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-[15px]">엄마 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TraitForm
            traits={mother}
            onChange={onMotherChange}
            side="mother"
          />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-[15px]">아기 성별</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={babySex}
            onValueChange={(v) => onBabySexChange(v as "boy" | "girl" | "unknown")}
            className="flex flex-wrap gap-4"
          >
            {[
              { value: "boy", label: "아들" },
              { value: "girl", label: "딸" },
              { value: "unknown", label: "아직 몰라요" },
            ].map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} id={`sex-${opt.value}`} />
                <Label htmlFor={`sex-${opt.value}`} className="cursor-pointer">
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Button size="lg" className="mt-6 w-full" onClick={onPredict}>
        예측 결과 보기
      </Button>

      <p className="mt-4 text-center text-[11.5px] leading-relaxed text-[var(--color-ink-muted)]">
        {BABY_GENETICS_META.disclaimer}
      </p>
    </div>
  );
}

/* ============================================================
 * Result View
 * ============================================================ */
function ResultView({
  result,
  nickname,
  shareCopied,
  onReset,
  onShare,
}: {
  result: BabyGeneticsResult;
  nickname: string;
  shareCopied: boolean;
  onReset: () => void;
  onShare: () => void;
}) {
  const { babySex, estimatedHeight } = result;
  const displayName = nickname || "아기";
  const particle = josaEunNeun(displayName);

  return (
    <div className="px-4 py-6">
      <div className="text-center">
        <BabyIllustration className="mx-auto h-32 w-32" />
        <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          예상 결과 리포트
        </p>
        <h1 className="mt-1 text-[22px] font-bold tracking-tight text-[var(--color-ink)]">
          우리 {displayName}
          {particle} 이런 모습일 거예요!
        </h1>
      </div>

      <div className="mt-5 space-y-3">
        <ResultCard title="예상 키 (성인 기준)" palette="butter">
          {babySex === "unknown" ? (
            <div className="space-y-1.5">
              <HeightLine label="남자아이" range={estimatedHeight.boy} />
              <HeightLine label="여자아이" range={estimatedHeight.girl} />
            </div>
          ) : (
            <div className="text-[24px] font-bold leading-tight text-[var(--color-ink)]">
              {(babySex === "boy" ? estimatedHeight.boy : estimatedHeight.girl).min}
              ~
              {(babySex === "boy" ? estimatedHeight.boy : estimatedHeight.girl).max}
              <span className="ml-1 text-[14px] font-normal text-[var(--color-ink-muted)]">
                cm
              </span>
            </div>
          )}
          <p className="mt-1.5 text-[11.5px] text-[var(--color-ink-muted)]">
            영양·환경에 따라 달라질 수 있어요.
          </p>
        </ResultCard>

        <ResultCard title="쌍꺼풀">
          <ProbRow
            label="있을 확률"
            value={result.doubleEyelidProb}
          />
        </ResultCard>

        <ResultCard title="머리카락">
          <p className="text-[14px] text-[var(--color-ink)]">{result.hairType}</p>
        </ResultCard>

        <ResultCard title="보조개">
          <ProbRow label="있을 확률" value={result.dimplesProb} />
        </ResultCard>

        <ResultCard title="혈액형 가능성">
          <div className="space-y-1.5">
            {result.possibleBloodTypes.map((bt) => (
              <div
                key={bt.type}
                className="flex items-center justify-between text-[13px]"
              >
                <span className="text-[var(--color-ink)]">{bt.type}</span>
                <Badge variant="secondary">{bt.prob}%</Badge>
              </div>
            ))}
          </div>
        </ResultCard>

        <ResultCard title="대머리 가능성" palette="peach">
          <ProbRow label="유전 위험" value={result.baldnessProb.prob} />
          <p className="mt-1.5 text-[11.5px] text-[var(--color-ink-muted)]">
            {result.baldnessProb.note}
          </p>
        </ResultCard>

        <ResultCard title="성격 경향" palette="lilac">
          <p className="text-[14px] font-medium text-[var(--color-ink)]">
            {result.personalityTendency.label}
          </p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--color-ink-muted)]">
            {result.personalityTendency.note}
          </p>
        </ResultCard>

        <ResultCard title="누굴 더 닮을까?" palette="pink">
          <p className="text-[13.5px] leading-relaxed text-[var(--color-ink)]">
            {result.resemblance}
          </p>
        </ResultCard>

        <ResultCard title="알아두면 좋은 점">
          <ul className="space-y-1.5 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
            {GENETICS_FUN_FACTS.map((fact, i) => (
              <li key={i} className="flex gap-1.5">
                <span>•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </ResultCard>
      </div>

      {/* 유전의 진짜 범인 사전 */}
      <section className="mt-8">
        <div className="mb-3 px-0.5">
          <h2 className="text-[17px] font-bold tracking-tight text-[var(--color-ink)]">
            유전의 진짜 범인 사전
          </h2>
          <p className="mt-0.5 text-[11.5px] text-[var(--color-ink-muted)]">
            아기는 정말 누구 탓일까요?
          </p>
        </div>
        <div className="grid gap-2">
          {HEREDITY_CULPRITS.map((item) => (
            <div
              key={item.trait}
              className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5"
            >
              <div className="flex items-baseline gap-2">
                <span className="rounded-full bg-[var(--color-surface-muted)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-ink)]">
                  {item.trait}
                </span>
                <span className="text-[12.5px] font-semibold text-[var(--color-primary)]">
                  {item.culprit}
                </span>
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Alert className="mt-5">
        <Info className="h-4 w-4" />
        <AlertDescription>{BABY_GENETICS_META.disclaimer}</AlertDescription>
      </Alert>

      <div className="mt-5 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onReset}>
          <RotateCcw className="h-4 w-4" /> 다시 예측
        </Button>
        <Button className="flex-1" onClick={onShare}>
          <Share2 className="h-4 w-4" />
          {shareCopied ? "복사됐어요!" : "공유하기"}
        </Button>
      </div>
    </div>
  );
}

/* ============================================================
 * Shared bits
 * ============================================================ */
function TraitForm({
  traits,
  onChange,
  side,
}: {
  traits: ParentTraits;
  onChange: (t: ParentTraits) => void;
  side: "father" | "mother";
}) {
  function update<K extends keyof ParentTraits>(key: K, value: ParentTraits[K]) {
    onChange({ ...traits, [key]: value });
  }

  const prefix = side;

  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor={`${prefix}-height`}>키 (cm)</Label>
        <Input
          id={`${prefix}-height`}
          type="number"
          value={Number.isFinite(traits.heightCm) && traits.heightCm > 0 ? traits.heightCm : ""}
          placeholder="예: 175"
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const v = e.target.value;
            update("heightCm", v === "" ? NaN : Number(v));
          }}
          onBlur={(e) => {
            const n = Number(e.target.value);
            if (!Number.isFinite(n) || n <= 0) {
              update("heightCm", side === "father" ? 175 : 162);
            }
          }}
          min={100}
          max={220}
          inputMode="numeric"
        />
      </div>

      <SelectField
        label="쌍꺼풀"
        value={traits.doubleEyelid}
        options={PARENT_TRAIT_OPTIONS.doubleEyelid}
        onChange={(v) => update("doubleEyelid", v as ParentTraits["doubleEyelid"])}
      />

      <SelectField
        label="머리카락"
        value={traits.hair}
        options={PARENT_TRAIT_OPTIONS.hair}
        onChange={(v) => update("hair", v as ParentTraits["hair"])}
      />

      <SelectField
        label="보조개"
        value={traits.dimples}
        options={PARENT_TRAIT_OPTIONS.dimples}
        onChange={(v) => update("dimples", v as ParentTraits["dimples"])}
      />

      <SelectField
        label="혈액형"
        value={traits.bloodType}
        options={PARENT_TRAIT_OPTIONS.bloodType}
        onChange={(v) => update("bloodType", v as ParentTraits["bloodType"])}
      />

      <SelectField
        label="성격"
        value={traits.personality}
        options={PARENT_TRAIT_OPTIONS.personality}
        onChange={(v) => update("personality", v as ParentTraits["personality"])}
      />

      {side === "father" && (
        <SelectField
          label="아이의 친할아버지가 대머리인가요?"
          value={traits.paternalGrandfatherBald ?? "no"}
          options={PARENT_TRAIT_OPTIONS.grandfatherBald}
          onChange={(v) =>
            update("paternalGrandfatherBald", v as ParentTraits["paternalGrandfatherBald"])
          }
        />
      )}
      {side === "mother" && (
        <SelectField
          label="아이의 외할아버지가 대머리인가요?"
          value={traits.maternalGrandfatherBald ?? "no"}
          options={PARENT_TRAIT_OPTIONS.grandfatherBald}
          onChange={(v) =>
            update("maternalGrandfatherBald", v as ParentTraits["maternalGrandfatherBald"])
          }
        />
      )}
    </>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

type Palette = "peach" | "sage" | "lilac" | "butter" | "pink" | "blue";

function ResultCard({
  title,
  palette,
  children,
}: {
  title: string;
  palette?: Palette;
  children: React.ReactNode;
}) {
  const accentStyle = palette
    ? { background: `var(--color-cat-${palette})` }
    : undefined;
  return (
    <Card className="overflow-hidden">
      {palette && (
        <div className="h-1.5" style={accentStyle} aria-hidden="true" />
      )}
      <CardHeader className="pb-1.5">
        <CardTitle className="text-[13px] text-[var(--color-ink-muted)]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

function ProbRow({ label, value }: { label: string; value: number }) {
  return (
    <>
      <div className="mb-1.5 flex items-center justify-between text-[13px]">
        <span className="text-[var(--color-ink-muted)]">{label}</span>
        <span className="font-bold text-[var(--color-ink)]">{value}%</span>
      </div>
      <Progress value={value} />
    </>
  );
}

function pickHeight(result: BabyGeneticsResult) {
  if (result.babySex === "boy") return result.estimatedHeight.boy;
  if (result.babySex === "girl") return result.estimatedHeight.girl;
  const { boy, girl } = result.estimatedHeight;
  return { min: Math.min(boy.min, girl.min), max: Math.max(boy.max, girl.max) };
}

function HeightLine({
  label,
  range,
}: {
  label: string;
  range: { min: number; max: number };
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-[12.5px] text-[var(--color-ink-muted)]">{label}</span>
      <span className="text-[18px] font-bold text-[var(--color-ink)]">
        {range.min}~{range.max}
        <span className="ml-1 text-[12px] font-normal text-[var(--color-ink-muted)]">
          cm
        </span>
      </span>
    </div>
  );
}

/* Placeholder cute baby illustration — swap with Miricanvas art later */
function BabyIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden="true"
    >
      {/* soft halo */}
      <circle cx="80" cy="80" r="78" fill="var(--color-cat-butter)" opacity="0.5" />
      <circle cx="80" cy="80" r="62" fill="var(--color-cat-peach)" opacity="0.65" />
      {/* head */}
      <ellipse cx="80" cy="86" rx="42" ry="44" fill="#FFE3D1" stroke="#2B2B2B" strokeWidth="2" />
      {/* hair tuft (single curl top) */}
      <path
        d="M72 42 Q80 30 88 42"
        stroke="#2B2B2B"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M78 40 Q82 36 86 40"
        stroke="#2B2B2B"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* eyes (closed-smile arcs) */}
      <path
        d="M60 84 Q66 78 72 84"
        stroke="#2B2B2B"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M88 84 Q94 78 100 84"
        stroke="#2B2B2B"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* cheeks */}
      <circle cx="54" cy="98" r="5" fill="#FFB7C6" opacity="0.8" />
      <circle cx="106" cy="98" r="5" fill="#FFB7C6" opacity="0.8" />
      {/* smile */}
      <path
        d="M70 106 Q80 116 90 106"
        stroke="#2B2B2B"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* tiny sparkles */}
      <path
        d="M30 54 l2 -2 l2 2 l-2 2 z"
        fill="var(--color-primary)"
        opacity="0.8"
      />
      <path
        d="M128 58 l2 -2 l2 2 l-2 2 z"
        fill="var(--color-primary)"
        opacity="0.8"
      />
    </svg>
  );
}

/* Simple DNA glyph — matches portal SVG-first convention */
function DnaIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4c4 4 12 12 16 16" />
      <path d="M20 4c-4 4-12 12-16 16" />
      <path d="M7 7h10" />
      <path d="M7 12h10" />
      <path d="M7 17h10" />
    </svg>
  );
}
