# BBABAM 아키텍처 개요

> **TODO (2026-04-18)**: 이 문서는 게임 시대 기준으로 작성됨. 포털 피벗(`docs/00-pm/overhaul.prd.md`) 반영 필요.
> 특히 `src/components/games` 섹션과 디렉터리 구조는 **더 이상 유효하지 않음**.

## 기술 스택

- Framework: `Next.js 16`
- Language: `TypeScript`
- UI: `React 19`, `Tailwind CSS 4`, `framer-motion`
- i18n: `next-intl`
- Auth: `next-auth`
- DB: `drizzle-orm` (+ drizzle-kit)

## 디렉터리 개요

- `src/app`: 라우트 및 페이지
- `src/components`: 재사용 UI/게임 컴포넌트
- `src/components/games`: 미니게임 구현
- `src/lib`: 게임 메타/유틸
- `src/messages`: 다국어 리소스(`ko`, `en`)
- `src/db`: 스키마/DB 관련 코드

## 게임 구조

게임 종류는 `src/lib/games.ts`에서 관리합니다.

- `ice-cream`
- `balloon`
- `scratch`
- `roulette`
- `gift-box`
- `gacha`

각 게임 컴포넌트는 `GameProps`(`onComplete`)를 받아서, 게임 완료 시 상위 흐름으로 완료 이벤트를 전달합니다.

## 디자인 변경 시 원칙

1. 게임 완료 로직(`onComplete`)을 깨지 않는다.
2. 인터랙션 상태 전이(ready/pulling/done 등)를 유지한다.
3. 접근성/터치 영역을 줄이지 않는다.
4. 애니메이션은 짧고 명확하게 유지한다.

## 개발 명령어

```bash
npm run dev
npm run lint
npm run build
```
