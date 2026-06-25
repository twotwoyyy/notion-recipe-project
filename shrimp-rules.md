# Development Guidelines

## 프로젝트 개요

- **프로젝트명**: 레시피 모음 (Recipe Collection) — Notion CMS 기반 레시피 블로그
- **기술 스택**: Next.js 16.2.7 (App Router), React 19, TypeScript 5, Tailwind CSS v4, ShadcnUI (radix-nova), lucide-react 1.17.0
- **렌더링 전략**: ISR (revalidate: 60) + 클라이언트 사이드 필터링/검색
- **CMS**: Notion API (`@notionhq/client`) — 별도 어드민 없음, Notion에서 직접 콘텐츠 관리
- **배포**: Vercel

---

## 프로젝트 아키텍처

### 디렉토리 구조 및 파일 배치 규칙

| 경로 | 용도 | 파일 추가 규칙 |
|------|------|----------------|
| `app/` | 라우트 전용 | `page.tsx`, `layout.tsx`, `error.tsx`, `loading.tsx`, `not-found.tsx`만 배치 |
| `app/api/` | Route Handler | `NextResponse` 사용, 비즈니스 로직은 `lib/`에 위임 |
| `app/recipes/[id]/` | 레시피 상세 동적 라우트 | `generateStaticParams` + `generateMetadata` 필수 |
| `components/ui/` | ShadcnUI 컴포넌트 | **`npx shadcn@latest add <name>`으로만 추가**, 추가 후 직접 수정 가능 |
| `components/layout/` | 레이아웃 컴포넌트 | Header, Footer, Container, Nav |
| `components/providers/` | Context Provider | 전역 Provider 묶음 (`index.tsx`) |
| `components/shared/` | 공유 컴포넌트 | 2개 이상 페이지에서 사용되는 컴포넌트 |
| `components/recipe/` | 레시피 전용 컴포넌트 | RecipeCard, RecipeGrid, RecipeFilter, RecipeSearch 등 |
| `components/notion/` | Notion 렌더러 | NotionRenderer, 블록별 서브 컴포넌트 |
| `lib/` | 유틸리티, API 클라이언트 | 순수 함수, API 호출 로직 |
| `types/` | TypeScript 타입 정의 | 전역 타입(`index.ts`), 도메인 타입(`recipe.ts`) |
| `docs/` | 프로젝트 문서 | PRD, ROADMAP |

### 레이아웃 흐름

```
app/layout.tsx (RootLayout — 서버 컴포넌트)
  └─ components/providers/index.tsx ("use client" — ThemeProvider + TooltipProvider + Toaster)
       ├─ components/layout/header.tsx (sticky — MobileNav + 로고 + MainNav + ThemeToggle)
       ├─ <main className="flex-1">{children}</main>
       └─ components/layout/footer.tsx
```

---

## 코드 규칙

### 기본 컨벤션

- **들여쓰기**: 2칸 스페이스
- **네이밍**: camelCase (변수/함수), PascalCase (컴포넌트/타입)
- **변수명**: 영어
- **주석**: 한국어, 비즈니스 로직 설명이 필요한 경우만
- **import 별칭**: `@/*` → 프로젝트 루트 (절대 경로 사용)

### Next.js 16 필수 규칙

- **`params`는 반드시 `await`**: `const { id } = await params`
- **`searchParams`는 반드시 `await`**: `const { category } = await searchParams`
- 위 규칙을 어기면 런타임 에러 발생

```tsx
// DO
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}

// DON'T
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params // 런타임 에러
}
```

### 렌더링 전략

- **기본값은 서버 컴포넌트** — `"use client"` 선언 없이 작성
- **클라이언트 컴포넌트 사용 조건**: useState, useEffect, 이벤트 핸들러, 브라우저 API가 필요할 때만
- **메타데이터 + 클라이언트 로직이 동시에 필요한 경우**: `page.tsx`는 서버 컴포넌트로 유지, 클라이언트 로직을 별도 컴포넌트로 분리

```tsx
// DO — page.tsx (서버 컴포넌트)
import { ClientFilter } from "@/components/recipe/recipe-filter"
export default async function Page() {
  const recipes = await getPublishedRecipes()
  return <ClientFilter recipes={recipes} />
}

// DON'T — page.tsx에 "use client" 선언
"use client"
export default function Page() { /* 메타데이터 사용 불가 */ }
```

### 타입 정의

- **전역 타입**: `types/index.ts` — NavItem, SiteConfig, ApiResponse
- **도메인 타입**: `types/recipe.ts` — Recipe, NotionBlock, CategoryType
- 모든 함수에 반환 타입 명시
- `any` 사용 금지, 불가피할 경우 `unknown` 사용 후 타입 가드

---

## 컴포넌트 작성 규칙

### ShadcnUI 컴포넌트

- **추가**: `npx shadcn@latest add <name>` 명령으로만 추가
- **수정**: `components/ui/` 내 파일 직접 수정 가능
- **스타일**: radix-nova 스타일, components.json 설정 참조
- **Radix Slot 사용법**: `import { Slot } from "radix-ui"` → `<Slot.Root>`

### 아이콘

- **lucide-react v1.17.0 사용**
- **`Github` 아이콘 없음** → `ExternalLink` 아이콘으로 대체
- 아이콘 크기: `className="size-4"` 또는 `className="size-5"` 패턴

### 폼 패턴

- **조합**: react-hook-form + zod + ShadcnUI Form 컴포넌트
- **모든 필드를 `defaultValues`에 포함** (누락 시 undefined → Zod 타입 에러)

```tsx
// DO
const schema = z.object({ role: z.string().min(1, "역할을 선택해주세요.") })
useForm({ resolver: zodResolver(schema), defaultValues: { role: "" } })

// DON'T — defaultValues 누락
useForm({ resolver: zodResolver(schema) }) // role이 undefined → 에러
```

### Toast

- **sonner** 라이브러리의 `toast()` 함수 사용
- `Toaster` 컴포넌트는 `components/providers/index.tsx`에 이미 등록됨
- 별도 Provider 추가 불필요

### ThemeToggle

- `mounted` 상태 확인 후 렌더링 (하이드레이션 불일치 방지)
- 기존 패턴: `components/shared/theme-toggle.tsx` 참조

---

## 스타일링 규칙

### Tailwind CSS v4

- **`tailwind.config.ts` 파일 생성 금지** — Tailwind v4는 CSS 기반 설정
- 테마 커스터마이징: `app/globals.css`에서 CSS 변수로 관리
- 유틸리티 함수: `cn()` (`lib/utils.ts`) — clsx + tailwind-merge

```tsx
// DO
import { cn } from "@/lib/utils"
<div className={cn("flex gap-4", isActive && "bg-primary")} />

// DON'T
<div className={`flex gap-4 ${isActive ? 'bg-primary' : ''}`} />
```

### 다크 모드

- `next-themes` ThemeProvider (attribute="class")
- CSS 변수: `:root` (라이트) / `.dark` (다크) — `globals.css`에서 정의
- 새 컴포넌트 작성 시 다크 모드 스타일 함께 확인

### 반응형 레이아웃

- **Container**: `max-w-7xl px-4 sm:px-6 lg:px-8`
- **그리드 패턴**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **모바일 네비게이션**: `md:hidden` (MobileNav) / `hidden md:flex` (MainNav)

---

## Notion API 연동 규칙

### API 클라이언트 (`lib/notion.ts`)

- **Notion Client 인스턴스**: 모듈 스코프에서 1개만 생성
- **필수 함수 시그니처**:
  - `getPublishedRecipes(category?: string): Promise<Recipe[]>`
  - `getRecipeById(id: string): Promise<Recipe>`
  - `getRecipeBlocks(id: string): Promise<NotionBlock[]>`
  - `getAllRecipeIds(): Promise<string[]>`
- **필터 조건**: Status가 "발행됨"인 항목만 조회
- **정렬**: Published 속성 기준 내림차순

### Rate Limit 대응

- Notion API 초당 3회 제한
- ISR 캐싱(`revalidate: 60`)으로 API 호출 최소화
- 빌드 시 요청 간 딜레이 적용

### 이미지 URL 만료 대응

- Notion 호스팅 이미지는 1시간 후 만료
- `next/image` 사용 + ISR 재검증 주기로 URL 갱신
- `next.config.ts`에 이미지 도메인 허용: `*.amazonaws.com`, `*.notion.so`

### 블록 변환 (`lib/notion-utils.ts`)

- Notion 블록 → 내부 `NotionBlock` 타입 변환
- 지원 블록: paragraph, heading_1/2/3, bulleted_list_item, numbered_list_item, image, divider, quote, code, callout, toggle
- 미지원 블록: fallback UI 표시 (무시하지 않음)

---

## 파일 연동 규칙 (동시 수정 필수)

| 변경 대상 | 함께 수정해야 하는 파일 |
|-----------|------------------------|
| `navItems` 추가/수정 (`lib/constants.ts`) | 자동 반영: `components/layout/main-nav.tsx`, `components/layout/mobile-nav.tsx` — **수동 수정 불필요** |
| `siteConfig` 수정 (`lib/constants.ts`) | 확인: `app/layout.tsx` (metadata), `components/layout/header.tsx`, `components/layout/footer.tsx` |
| `NavItem` 타입 변경 (`types/index.ts`) | `lib/constants.ts`, `main-nav.tsx`, `mobile-nav.tsx` |
| `Recipe` 타입 변경 (`types/recipe.ts`) | `lib/notion.ts` (변환 로직), 모든 recipe 컴포넌트 |
| CSS 변수 추가 (`app/globals.css`) | `:root`와 `.dark` 양쪽 모두 정의 필수 |
| 새 Provider 추가 | `components/providers/index.tsx`에 래핑 |
| 새 UI 컴포넌트 추가 | `npx shadcn@latest add <name>` 실행 후 `components/ui/`에 자동 생성 |

---

## ISR 및 라우팅 규칙

### ISR 적용 페이지

| 페이지 | 파일 | revalidate |
|--------|------|------------|
| 메인 목록 | `app/page.tsx` | 60초 |
| 레시피 상세 | `app/recipes/[id]/page.tsx` | 60초 |

### ISR 재검증 API

- `app/api/revalidate/route.ts` — POST 엔드포인트
- `REVALIDATE_SECRET` 환경 변수로 인증
- `revalidatePath('/')` + `revalidatePath('/recipes/[id]')` 호출

### 동적 라우트

- `app/recipes/[id]/page.tsx`에 `generateStaticParams()` 필수
- `generateMetadata()`로 SEO 메타데이터 + OG 태그 동적 생성
- 존재하지 않는 ID → `notFound()` 호출

---

## 환경 변수

| 변수명 | 용도 | 필수 |
|--------|------|------|
| `NOTION_API_KEY` | Notion Integration API 키 | Yes |
| `NOTION_DATABASE_ID` | 레시피 데이터베이스 ID | Yes |
| `REVALIDATE_SECRET` | ISR 재검증 인증 토큰 | No (선택) |

- `.env.local`에 설정 (Git 추적 안 됨)
- `.env.example`에 템플릿 제공

---

## AI 의사결정 기준

### 서버 컴포넌트 vs 클라이언트 컴포넌트

```
데이터 fetch 필요? → 서버 컴포넌트
메타데이터(generateMetadata) 필요? → 서버 컴포넌트
useState/useEffect 필요? → 클라이언트 컴포넌트
이벤트 핸들러(onClick, onChange) 필요? → 클라이언트 컴포넌트
브라우저 API(window, localStorage) 필요? → 클라이언트 컴포넌트
둘 다 필요? → page.tsx 서버 + 별도 클라이언트 컴포넌트 분리
```

### 새 파일 위치 결정

```
라우트/페이지? → app/
API 엔드포인트? → app/api/
ShadcnUI 프리미티브? → npx shadcn@latest add (components/ui/)
레이아웃 관련? → components/layout/
레시피 도메인? → components/recipe/
Notion 렌더링? → components/notion/
2+ 페이지 공유? → components/shared/
특정 페이지 전용 클라이언트? → components/<page-name>/
타입 정의? → types/
유틸/API 클라이언트? → lib/
```

### ISR vs CSR 판단

```
SEO 필요 + 데이터 변경 빈도 낮음? → ISR (revalidate: 60)
실시간 인터랙션? → CSR (클라이언트 사이드 필터링)
URL 공유로 상태 복원 필요? → URL 쿼리 파라미터 + 서버 사이드 필터
```

---

## 금지 사항

| # | 금지 항목 | 이유 |
|---|----------|------|
| 1 | `tailwind.config.ts` 생성 | Tailwind v4는 CSS 기반 설정, 이 파일 불필요 |
| 2 | `components/ui/` 파일 수동 생성 | `npx shadcn@latest add`로만 추가 |
| 3 | `lucide-react`의 `Github` 아이콘 import | v1.17.0에 없음, `ExternalLink` 사용 |
| 4 | `params`/`searchParams` await 없이 접근 | Next.js 16에서 Promise 반환, await 필수 |
| 5 | page.tsx에 불필요한 `"use client"` 선언 | 서버 컴포넌트 이점(메타데이터, 데이터 fetch) 상실 |
| 6 | Notion API를 컴포넌트에서 직접 호출 | `lib/notion.ts` 통해서만 호출 |
| 7 | `any` 타입 사용 | `unknown` + 타입 가드 사용 |
| 8 | CSS 변수를 `:root`에만 정의 | `.dark`에도 반드시 함께 정의 |
| 9 | `className` 문자열 직접 조합 | `cn()` 유틸리티 사용 |
| 10 | 에러 핸들링 생략 | API 호출, 데이터 변환에 에러 핸들링 필수 |
| 11 | `next.config.ts` 훈련 데이터 기반 작성 | `node_modules/next/dist/docs/` 가이드 먼저 확인 |

---

## 개발 명령어

| 명령어 | 용도 |
|--------|------|
| `npm run dev` | 개발 서버 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 + 타입 체크 |
| `npm run lint` | ESLint 검사 |
| `npx shadcn@latest add <name>` | ShadcnUI 컴포넌트 추가 |

---

## 참고 문서

- PRD: `docs/PRD.md`
- 개발 로드맵: `docs/ROADMAP.md`
- Next.js 16 가이드: `node_modules/next/dist/docs/`
- ShadcnUI 설정: `components.json`
