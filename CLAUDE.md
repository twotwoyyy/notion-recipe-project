# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md

## ⚠️ Next.js 16 주의사항

**이 버전은 훈련 데이터와 다른 Breaking Changes가 존재합니다.** 코드 작성 전 `node_modules/next/dist/docs/`의 관련 가이드를 먼저 확인하세요.

- `params` / `searchParams`는 **`await` 필수** (Promise로 반환됨)
- App Router 규칙이 이전 버전과 다를 수 있음

## 개발 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## 아키텍처

### 렌더링 전략

- **기본: 서버 컴포넌트** — 별도 선언 없이 모든 파일은 서버 컴포넌트
- **클라이언트 컴포넌트** — 상태, 이벤트, 브라우저 API가 필요할 때만 `"use client"` 선언
- **메타데이터 + 클라이언트 로직이 함께 필요한 경우**: `page.tsx`는 서버 컴포넌트로 유지하고 클라이언트 로직을 별도 컴포넌트로 분리 (→ `components/examples/profile-form.tsx` 참고)

### 레이아웃 흐름

```
app/layout.tsx (RootLayout)
  └─ components/providers/index.tsx (ThemeProvider + TooltipProvider + Toaster)
       ├─ components/layout/header.tsx (sticky, MobileNav + MainNav + ThemeToggle)
       ├─ <main> {children}
       └─ components/layout/footer.tsx
```

### 디렉토리 역할

| 경로 | 용도 |
|------|------|
| `app/` | 라우트 (page.tsx, layout.tsx, error.tsx, loading.tsx, not-found.tsx) |
| `app/api/` | Route Handler (NextResponse 사용) |
| `components/ui/` | ShadcnUI 컴포넌트 (직접 수정 가능) |
| `components/layout/` | Header, Footer, Container, Nav |
| `components/providers/` | 전역 Context Provider 묶음 |
| `components/shared/` | 여러 페이지에서 재사용하는 컴포넌트 |
| `components/examples/` | 예제 페이지 전용 클라이언트 컴포넌트 |
| `lib/constants.ts` | `siteConfig`, `navItems` 등 전역 상수 |
| `lib/utils.ts` | `cn()` (clsx + tailwind-merge) |
| `types/index.ts` | `NavItem`, `SiteConfig`, `ApiResponse<T>` |

### 스타일링

Tailwind v4 사용 — **`tailwind.config.ts` 없음**. 테마 커스터마이징은 `app/globals.css`에서 CSS 변수로 관리.

```css
/* globals.css 패턴 */
@import "tailwindcss";
@import "tw-animate-css";
```

### 폼 패턴

react-hook-form + zod + ShadcnUI Form 컴포넌트 조합:

```tsx
const schema = z.object({ role: z.string().min(1, "역할을 선택해주세요.") })

useForm({ resolver: zodResolver(schema), defaultValues: { role: "" } })
//                                                               ^^^
// Select 등 모든 필드를 defaultValues에 포함해야 함
// 누락 시 undefined → Zod 타입 에러 메시지 노출
```

### 네비게이션 추가

`lib/constants.ts`의 `navItems` 배열에 항목을 추가하면 Header의 MainNav/MobileNav에 자동 반영됩니다.

## 주요 제약사항

- **lucide-react v1.17.0**: `Github` 아이콘 없음 → `ExternalLink` 사용
- **Radix Slot**: `import { Slot } from "radix-ui"` 후 `<Slot.Root>` 사용
- **ThemeToggle**: `mounted` 상태 확인 후 렌더링 (하이드레이션 불일치 방지)
- **Toast**: `sonner`의 `toast()` 함수 사용, `Toaster`는 `Providers`에 이미 등록되어 있음
