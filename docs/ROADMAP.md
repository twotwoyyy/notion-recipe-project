# ROADMAP: 레시피 모음 — 고도화

> **기준 문서**: [PRD v1.0.0](./PRD.md)  
> **이전 로드맵**: [ROADMAP v1 (MVP)](./guides/ROADMAP_v1.md)  
> **작성일**: 2026-06-25  
> **Sprint 주기**: 1주 단위  
> **프로덕션 URL**: https://notion-cms-project-dun.vercel.app

---

## MVP 완료 요약

MVP(Phase 1~3 + Phase 5 일부)는 개발 및 Vercel 배포가 완료된 상태입니다.

| 영역 | 완료 항목 | 관련 파일 |
|------|----------|-----------|
| 환경 설정 | `.env.local`, `@notionhq/client` v5, 타입 시스템 | `types/recipe.ts`, `lib/constants.ts` |
| Notion API | 클라이언트, 블록 변환 유틸, 실 DB 연동 검증 | `lib/notion.ts`, `lib/notion-utils.ts` |
| 목록 페이지 | RecipeCard, RecipeGrid, HeroSection, ISR(60s) | `app/page.tsx`, `components/recipe/*` |
| 상세 페이지 | NotionRenderer(10종 블록), 브레드크럼, 에러/로딩 페이지 | `app/recipes/[id]/page.tsx`, `components/notion/*` |
| SEO 기본 | `generateMetadata`, OG 태그, sitemap, robots | `app/sitemap.ts`, `app/robots.ts` |
| ISR 재검증 | POST API + secret 검증 | `app/api/revalidate/route.ts` |
| PDF 다운로드 | 브라우저 인쇄 기반 + `@media print` 스타일 | `components/recipe/recipe-print-button.tsx` |
| 이미지 최적화 | `next/image` 리모트 패턴, avif/webp, 디바이스 사이즈 | `next.config.ts` |
| 배포 | Vercel 프로덕션 배포 완료 | — |
| 관리자 기능 | 대시보드(통계 카드), 레시피 테이블 뷰, 관리자 레이아웃(사이드바+모바일 탭) | `app/admin/*`, `components/admin/*` |

### PRD 매핑 — 완료된 기능

| ID | 기능 | 상태 |
|----|------|------|
| F-01 | Notion API로 레시피 목록 조회 | ✅ |
| F-02 | Status "발행됨" 필터링 | ✅ |
| F-03 | Notion 블록 → HTML 렌더링 | ✅ |
| F-04 | ISR (revalidate: 60초) | ✅ |
| F-05 | 레시피 카드 목록 표시 | ✅ |
| F-08 | 발행일 기준 내림차순 정렬 | ✅ |
| F-10 | Notion 블록 콘텐츠 렌더링 | ✅ |
| F-11 | 메타데이터 표시 | ✅ |
| F-16 | 반응형 레이아웃 | ✅ |
| F-18 | PDF 다운로드 | ✅ |

---

## 미완료 기능 + 신규 요구사항

### PRD 미완료

| ID | 기능 | 우선순위 | 현재 상태 |
|----|------|----------|-----------|
| F-06 | 카테고리 필터 (URL 쿼리 파라미터 기반) | P0 | UI 완료, URL 연동 미구현 |
| F-07 | 제목/태그 기반 텍스트 검색 | P1 | 미구현 |
| F-09 | 페이지네이션 또는 무한 스크롤 | P2 | 미구현 |
| F-12 | 이전/다음 레시피 네비게이션 | P2 | 미구현 |
| F-13 | 관련 레시피 추천 (동일 카테고리) | P2 | 미구현 |
| F-14 | 실시간 검색 (클라이언트 사이드) | P1 | 미구현 |
| F-15 | 검색어 하이라이팅 | P2 | 미구현 |
| F-17 | 다크 모드 지원 | P1 | ThemeToggle 존재, 스타일 점검 미실시 |

### 신규 요구사항

| ID | 기능 | 우선순위 | 설명 |
|----|------|----------|------|
| F-19 | 관리자 레이아웃으로 레시피 목록 보기 | P1 | `/admin` 경로에서 테이블 형태로 전체 레시피를 조회 (초안 포함) |

---

## 마일스톤 요약

| Phase | 이름 | Sprint | 기간 | 목표 |
|-------|------|--------|------|------|
| **1** | 필터링 및 검색 | Sprint 1 | 1주 | 카테고리 필터 URL 연동 + 텍스트 검색 — 레시피 탐색 UX 완성 |
| **2** | UX 강화 | Sprint 2 | 1주 | 다크 모드 점검, 접근성, 이전/다음 네비게이션, 관련 레시피 추천 |
| **3** | 관리자 기능 | Sprint 3 | 1주 | 관리자 레이아웃, 전체 레시피 테이블 뷰, 상태 관리 |
| **4** | 완성도 및 최적화 | Sprint 4 | 1주 | 검색어 하이라이팅, 페이지네이션, 성능 최적화, SEO 마무리 |

---

## Phase 1 — 필터링 및 검색 (Sprint 1)

### 왜 이 순서인가?

> 카테고리 필터(F-06)는 **PRD P0 기능**이면서 MVP에서 유일하게 빠진 P0입니다. UI는 이미 존재하지만 URL 쿼리 파라미터와 연동되지 않아 서버 사이드 필터링이 불가능합니다. 검색(F-07, F-14)은 필터와 같은 `searchParams` 메커니즘을 공유하므로 함께 구현하는 것이 효율적입니다.

### Sprint 1: 카테고리 필터 URL 연동 + 텍스트 검색 (1주)

> **목표**: 카테고리 필터와 텍스트 검색이 URL 쿼리 파라미터와 연동되어, 서버 사이드 필터링 + 클라이언트 검색이 동작하는 상태

#### 태스크

- [ ] **S1-1** RecipeFilter URL 연동 (3h) — `components/recipe/recipe-filter.tsx`
  - 기존 로컬 `useState`를 `useRouter` + `useSearchParams`로 교체
  - 카테고리 선택 시 `?category=한식` URL 쿼리 파라미터 반영
  - URL의 `category` 값으로 초기 선택 상태 동기화 (`useSearchParams().get("category")`)
  - "전체" 선택 시 `category` 파라미터 제거
  - 기존 `q` 파라미터 유지하면서 `category`만 변경 (파라미터 병합)

- [ ] **S1-2** RecipeSearch 컴포넌트 구현 (3h) — `components/recipe/recipe-search.tsx`
  - `"use client"` 클라이언트 컴포넌트
  - `useRouter`, `useSearchParams` 사용
  - 검색 입력 → 디바운스 300ms → URL 쿼리 파라미터 (`?q=검색어`) 반영
  - URL의 `q` 값으로 입력 필드 초기값 동기화
  - 기존 `category` 파라미터 유지하면서 `q`만 변경 (파라미터 병합)
  - 빈 문자열 입력 시 `q` 파라미터 제거
  - `lucide-react`의 `Search` 아이콘 + `Input` 컴포넌트 활용

- [ ] **S1-3** HeroSection 검색창 연동 (1h) — `components/recipe/hero-section.tsx`
  - 현재 `readOnly` 검색 Input을 실제 검색 기능과 연결
  - 히어로 검색창을 `RecipeSearch`로 교체하거나, 입력 시 `#recipes` 섹션의 검색바로 포커스 이동
  - `"use client"` 전환 또는 별도 클라이언트 래퍼 컴포넌트 분리

- [ ] **S1-4** 메인 페이지 필터/검색 통합 (4h) — `app/page.tsx`
  - `searchParams` prop 수신 및 `await searchParams` (Next.js 16 필수)
  - `category` 파라미터 → `getPublishedRecipes(category)` 서버 사이드 Notion 쿼리 필터
  - `q` 파라미터 → 서버에서 제목/태그 기준 필터링 (`recipes.filter()`)
  - `RecipeFilter`에 현재 `category` 값 전달 (서버 → 클라이언트 prop)
  - `RecipeSearch`에 현재 `q` 값 전달
  - `RecipeGrid`에 필터링된 결과 전달
  - 결과 없을 때 빈 상태(Empty State)는 기존 `RecipeGrid` 컴포넌트에서 처리

- [ ] **S1-5** 필터/검색 E2E 검증 (1h)
  - 개발 서버에서 `/?category=한식` 접속 → 한식 레시피만 표시 확인
  - `/?q=김치` 접속 → 제목/태그에 "김치" 포함된 레시피만 표시 확인
  - `/?category=한식&q=김치` 복합 필터 동작 확인
  - 카테고리 탭 클릭 → URL 변경 + 결과 갱신 확인
  - 검색 입력 → 디바운스 후 URL 변경 + 결과 갱신 확인
  - 필터/검색 적용 상태에서 페이지 새로고침 → 상태 유지 확인

**의존성**: S1-1, S1-2 독립 → S1-3은 S1-2 이후 → S1-4에서 통합 → S1-5 검증

**완료 기준 (DoD)**:
- [ ] `/?category=한식`으로 접속 시 한식 레시피만 표시 (F-06)
- [ ] 검색어 입력 시 제목/태그 기준 실시간 필터링 (F-07, F-14)
- [ ] URL 공유 시 필터/검색 상태 유지
- [ ] 카테고리 + 검색 복합 필터 동작
- [ ] 결과 없을 때 빈 상태 안내 표시
- [ ] `npm run build` 성공

---

## Phase 2 — UX 강화 (Sprint 2)

### 왜 이 순서인가?

> 다크 모드 점검, 접근성, 탐색 네비게이션은 **기존 페이지 위에 얹는 품질 개선**입니다. Phase 1에서 필터/검색이 완성되어야 다크 모드에서의 필터 UI, 검색 하이라이팅 등을 함께 점검할 수 있습니다. 이전/다음 + 관련 레시피는 상세 페이지의 탐색 편의성을 높이는 기능으로, 핵심 페이지가 안정된 후에 추가합니다.

### Sprint 2: 다크 모드, 접근성, 탐색 네비게이션 (1주)

> **목표**: 다크 모드 완전 지원, 접근성 기본 준수, 상세 페이지 탐색 편의성 강화

#### 태스크

- [ ] **S2-1** 다크 모드 스타일 점검 (2h) — `app/globals.css`, 각 컴포넌트
  - ThemeToggle 동작 확인 (기존 `components/shared/theme-toggle.tsx`)
  - RecipeCard 다크 모드: 카드 배경, 텍스트 색상, 배지 색상 확인
  - RecipeFilter 다크 모드: 활성/비활성 탭 색상 확인
  - NotionRenderer 다크 모드: 코드 블록 배경색, 인용 테두리, 콜아웃 배경 조정
  - HeroSection 다크 모드: 배경 색상, 검색창 스타일 확인
  - 필요 시 `globals.css`의 `.dark` 변수 또는 컴포넌트 클래스 조정

- [ ] **S2-2** 접근성 점검 (2h) — 전체 페이지
  - 이미지 `alt` 텍스트: `RecipeCard` 커버 이미지, `NotionRenderer` 이미지 블록
  - 키보드 네비게이션: 카테고리 필터 탭 이동(Tab), 카드 포커스(Enter), 검색창 포커스
  - 색상 대비: WCAG 2.1 AA 기준 (4.5:1 텍스트, 3:1 대형 텍스트) — 라이트/다크 모두
  - `aria-label` 확인: 검색 입력, 필터 버튼, 네비게이션 링크
  - skip-to-content 링크 추가 (`app/layout.tsx`)

- [ ] **S2-3** 이전/다음 레시피 네비게이션 (3h) — `components/recipe/recipe-navigation.tsx`
  - `RecipeNavigation` 컴포넌트: `prev`/`next` Recipe 객체를 prop으로 수신
  - `lib/notion.ts`에 `getAdjacentRecipes(currentId: string): Promise<{ prev: Recipe | null, next: Recipe | null }>` 함수 추가
  - 발행일 기준 정렬된 목록에서 현재 레시피 위치를 기준으로 이전/다음 결정
  - 첫 번째 레시피: "이전" 비표시, 마지막 레시피: "다음" 비표시
  - `ChevronLeft`, `ChevronRight` 아이콘 + 레시피 제목 표시
  - 반응형: 모바일에서는 제목 축약 (truncate)

- [ ] **S2-4** 관련 레시피 추천 (2.5h) — `components/recipe/related-recipes.tsx`
  - `RelatedRecipes` 컴포넌트: 동일 카테고리의 다른 레시피 최대 3개 표시
  - `lib/notion.ts`에 `getRelatedRecipes(category: string, excludeId: string, limit?: number): Promise<Recipe[]>` 함수 추가
  - 기존 `RecipeCard` 컴포넌트 재사용
  - 관련 레시피가 없을 때 섹션 자체를 숨김
  - "관련 레시피" 제목 + 카드 그리드 (최대 3열)

- [ ] **S2-5** 상세 페이지 통합 (1.5h) — `app/recipes/[id]/page.tsx`
  - `getAdjacentRecipes(id)` 호출하여 `RecipeNavigation` 렌더링 (본문 하단)
  - `getRelatedRecipes(recipe.category, id)` 호출하여 `RelatedRecipes` 렌더링 (네비게이션 하단)
  - 구분선(`Separator`)으로 본문 / 네비게이션 / 관련 레시피 영역 분리

- [ ] **S2-6** UX 강화 E2E 검증 (1h)
  - 라이트/다크 모드 전환 시 모든 페이지 시각적 확인
  - 키보드만으로 메인 페이지 → 필터 → 카드 → 상세 페이지 이동 확인
  - 상세 페이지에서 이전/다음 레시피 이동 동작 확인
  - 관련 레시피 카드 클릭 → 해당 상세 페이지 이동 확인

**의존성**: S2-1, S2-2 독립 병렬 가능 / S2-3, S2-4 독립 병렬 가능 → S2-5에서 통합 → S2-6 검증

**완료 기준 (DoD)**:
- [ ] 다크/라이트 모드 전환 시 모든 페이지 정상 렌더링 (F-17)
- [ ] 키보드만으로 주요 기능 사용 가능 (WCAG 2.1 AA)
- [ ] 이미지 alt 텍스트 100% 설정
- [ ] 상세 페이지에서 이전/다음 레시피 이동 가능 (F-12)
- [ ] 동일 카테고리 관련 레시피 최대 3개 표시 (F-13)
- [ ] 첫 번째/마지막 레시피 경계 처리 정상
- [ ] `npm run build` 성공

---

## Phase 3 — 관리자 기능 (Sprint 3)

### 왜 이 순서인가?

> 관리자 레이아웃(F-19)은 **기존 공개 페이지와 독립적인 영역**이지만, `lib/notion.ts`의 API 함수들과 `types/recipe.ts`의 타입을 재사용합니다. Phase 1~2에서 필터/검색/탐색 기능이 안정된 후에 새로운 라우트 그룹을 추가하는 것이 안전합니다. 관리자 페이지는 "초안" 상태의 레시피도 볼 수 있어야 하므로 기존 `getPublishedRecipes()`와 다른 전용 API 함수가 필요합니다.

### Sprint 3: 관리자 레이아웃 및 레시피 테이블 (1주)

> **목표**: `/admin` 경로에서 전체 레시피(초안 포함)를 테이블 형태로 조회할 수 있는 관리자 페이지 구현

#### 태스크

- [x] **S3-1** 관리자용 Notion API 함수 (2h) — `lib/notion.ts`
  - `getAllRecipes(): Promise<Recipe[]>` — Status 필터 없이 전체 레시피 조회 (초안 + 발행됨)
  - 발행일 기준 내림차순 정렬 유지
  - `getRecipeStats(): Promise<{ total: number, published: number, draft: number }>` — 통계 조회

- [x] **S3-2** 관리자 레이아웃 (2h) — `app/admin/layout.tsx`
  - 관리자 전용 레이아웃 (`app/admin/layout.tsx`)
  - 공개 페이지와 다른 사이드바 또는 헤더 구성 (관리자임을 나타내는 배지/배너)
  - `"관리자"` 타이틀 표시
  - 네비게이션: 대시보드(홈), 레시피 목록
  - 반응형: 모바일에서 사이드바 → 상단 탭으로 전환

- [x] **S3-3** 관리자 대시보드 (2h) — `app/admin/page.tsx`
  - 레시피 통계 카드: 전체 수, 발행됨 수, 초안 수
  - ShadcnUI `Card` 컴포넌트 활용
  - 최근 레시피 5개 미리보기 (제목 + 상태 + 발행일)
  - 서버 컴포넌트로 구현 (ISR 불필요, 항상 최신 데이터)

- [x] **S3-4** ShadcnUI Table 컴포넌트 설치 (0.5h)
  - `npx shadcn@latest add table` 실행
  - `components/ui/table.tsx` 생성 확인

- [x] **S3-5** 레시피 테이블 뷰 (4h) — `app/admin/recipes/page.tsx`
  - 서버 컴포넌트로 `getAllRecipes()` 호출
  - ShadcnUI `Table` 컴포넌트로 테이블 렌더링
  - 열 구성: 제목, 카테고리, 태그, 상태(배지), 발행일
  - 상태 배지: "발행됨" → 녹색, "초안" → 회색
  - 제목 클릭 → 공개 상세 페이지(`/recipes/[id]`)로 이동 (새 탭)
  - 빈 상태 UI (레시피 없을 때)
  - 반응형: 모바일에서 카드형 표시 또는 가로 스크롤

- [x] **S3-6** 관리자 네비게이션 연결 (0.5h) — `lib/constants.ts`
  - `adminNavItems` 배열 추가 (대시보드, 레시피 목록)
  - 또는 기존 `navItems`에 관리자 링크 조건부 추가

- [x] **S3-7** 관리자 페이지 E2E 검증 (1h)
  - `/admin` 접속 → 대시보드 통계 카드 표시 확인
  - `/admin/recipes` 접속 → 전체 레시피 테이블 표시 확인 (초안 포함)
  - 초안 레시피가 "초안" 배지로 표시되는지 확인
  - 제목 클릭 → 상세 페이지 이동 확인
  - 모바일 반응형 확인

**의존성**: S3-1 먼저 → S3-2, S3-4 독립 병렬 → S3-3은 S3-1 이후 → S3-5는 S3-1, S3-4 이후 → S3-6, S3-7 마지막

**완료 기준 (DoD)**:
- [x] `/admin`에서 관리자 대시보드 표시 (통계 카드)
- [x] `/admin/recipes`에서 전체 레시피 테이블 표시 (초안 포함) (F-19)
- [x] 상태(발행됨/초안) 배지 색상 구분
- [x] 모바일/데스크톱 반응형 정상 동작
- [x] `npm run build` 성공

---

## Phase 4 — 완성도 및 최적화 (Sprint 4)

### 왜 이 순서인가?

> 검색어 하이라이팅, 페이지네이션, 성능 최적화는 **모든 기능이 완성된 후에 추가하는 마무리 작업**입니다. 하이라이팅은 검색 기능이 있어야 의미가 있고, 페이지네이션은 레시피 수가 충분할 때 필요합니다. 성능 최적화는 기능 변경이 더 이상 없을 때 수행해야 이중 작업을 피할 수 있습니다.

### Sprint 4: 검색 하이라이팅, 페이지네이션, 성능 최적화 (1주)

> **목표**: 남은 P2 기능 구현 + 성능 목표 달성 + SEO 마무리

#### 태스크

- [ ] **S4-1** 검색어 하이라이팅 (2.5h) — `components/recipe/recipe-card.tsx`
  - `RecipeCard`에 `highlightQuery?: string` prop 추가
  - 제목과 태그에서 검색어 매칭 부분을 `<mark>` 태그로 래핑
  - 하이라이팅 유틸 함수 구현: `highlightText(text: string, query: string): ReactNode`
  - 대소문자/한글 무시 매칭
  - 검색어 없을 때는 일반 텍스트 그대로 렌더링

- [ ] **S4-2** 페이지네이션 (3h) — `components/recipe/recipe-pagination.tsx`
  - `RecipePagination` 컴포넌트: 페이지 번호 + 이전/다음 버튼
  - URL 쿼리 파라미터 (`?page=2`) 기반
  - `app/page.tsx`에서 `searchParams.page`로 현재 페이지 수신
  - 페이지당 9개 (3x3 그리드 기준)
  - `lib/notion.ts`의 `getPublishedRecipes()`에 `page`, `pageSize` 파라미터 추가 (Notion API `start_cursor` 활용 또는 서버 사이드 슬라이싱)
  - 총 페이지 수 계산을 위한 `getPublishedRecipeCount()` 함수 추가
  - ShadcnUI `Button` 조합 또는 커스텀 페이지네이션 UI

- [ ] **S4-3** SEO 메타데이터 최적화 (1.5h)
  - `app/page.tsx`에 `generateMetadata()` 추가 — 목록 페이지 전용 title, description
  - 카테고리 필터 적용 시 메타데이터 동적 변경 (`한식 레시피 모음`)
  - `app/recipes/[id]/page.tsx`의 `generateMetadata()` description 개선 (본문 첫 100자 발췌)
  - 구조화된 데이터(JSON-LD) 추가: `Recipe` 스키마 (`@type: Recipe`)
  - `siteConfig.url` 값을 실제 Vercel 배포 URL로 업데이트

- [ ] **S4-4** 성능 측정 및 최적화 (3h)
  - Lighthouse 측정: Performance, Accessibility, SEO, Best Practices
  - 번들 분석: `@next/bundle-analyzer` 설치 및 실행
  - 불필요한 클라이언트 번들 식별 및 제거
  - `next/image`의 `priority` 속성: 목록 페이지 첫 3개 카드의 이미지에 적용
  - `next/image`의 `sizes` 속성 최적화 (반응형 breakpoint 기반)
  - Core Web Vitals 목표 확인: LCP < 2.5s, CLS < 0.1

- [ ] **S4-5** 최종 검증 및 배포 (1.5h)
  - 전체 사이트 E2E 회귀 테스트 (목록, 상세, 필터, 검색, 관리자)
  - `npm run build` 최종 확인
  - Vercel 재배포 및 프로덕션 확인

**의존성**: S4-1, S4-2, S4-3, S4-4 독립 병렬 가능 → S4-5 마지막

**완료 기준 (DoD)**:
- [ ] 검색 결과에서 매칭 텍스트 하이라이팅 표시 (F-15)
- [ ] 레시피 9개 이상일 때 페이지네이션 동작 (F-09)
- [ ] Lighthouse SEO 100점
- [ ] Lighthouse Performance 90+ 달성
- [ ] LCP < 2.5s, CLS < 0.1
- [ ] 구조화된 데이터(JSON-LD) 검증 통과
- [ ] 프로덕션 URL에서 전체 기능 동작 확인
- [ ] `npm run build` 성공

---

## 리스크 및 대응 방안

| # | 리스크 | 영향도 | 대응 방안 |
|---|--------|--------|-----------|
| R1 | **Notion API Rate Limit** (초당 3회) — 관리자 페이지에서 전체 레시피 조회 시 부하 증가 | 높음 | ISR 캐싱(`revalidate: 60`)으로 호출 최소화. 관리자 페이지는 ISR 미적용(항상 최신)이므로 요청 빈도 모니터링 필요. 필요 시 관리자 페이지에도 짧은 캐시(10s) 적용 |
| R2 | **Notion 이미지 URL 만료** (1시간) | 중간 | ISR 재검증 주기(60초)로 URL 갱신. 관리자 테이블의 썸네일은 필요 시 생략하여 API 호출 절감 |
| R3 | **`searchParams` 비동기 처리** (Next.js 16) | 중간 | `await searchParams` 반드시 사용. `useSearchParams()`는 클라이언트 컴포넌트에서만 사용 |
| R4 | **관리자 페이지 인증 부재** | 중간 | 현재 인증 없이 `/admin` 접근 가능. MVP 단계에서는 URL 비공개로 운영, 추후 NextAuth 또는 미들웨어 기반 인증 추가 검토 |
| R5 | **Notion DB 구조 변경** | 낮음 | 타입 정의 중앙 관리(`types/recipe.ts`), 속성 매핑은 `lib/notion.ts`의 `pageToRecipe`에 집중 |
| R6 | **번들 크기 증가** — ShadcnUI Table 등 컴포넌트 추가 | 낮음 | ShadcnUI는 트리 셰이킹 지원. 번들 분석기로 확인 후 필요 시 dynamic import 적용 |

---

## PRD 매핑 전체 현황

| ID | 기능 | 우선순위 | Phase | 상태 |
|----|------|----------|-------|------|
| F-01 | Notion API 레시피 목록 조회 | P0 | MVP | ✅ 완료 |
| F-02 | Status "발행됨" 필터링 | P0 | MVP | ✅ 완료 |
| F-03 | Notion 블록 → HTML 렌더링 | P0 | MVP | ✅ 완료 |
| F-04 | ISR (revalidate: 60초) | P1 | MVP | ✅ 완료 |
| F-05 | 레시피 카드 목록 표시 | P0 | MVP | ✅ 완료 |
| F-06 | 카테고리 필터 (URL 쿼리) | P0 | Phase 1 | ⬜ S1-1, S1-4 |
| F-07 | 제목/태그 텍스트 검색 | P1 | Phase 1 | ⬜ S1-2, S1-4 |
| F-08 | 발행일 기준 내림차순 정렬 | P1 | MVP | ✅ 완료 |
| F-09 | 페이지네이션 | P2 | Phase 4 | ⬜ S4-2 |
| F-10 | Notion 블록 콘텐츠 렌더링 | P0 | MVP | ✅ 완료 |
| F-11 | 메타데이터 표시 | P0 | MVP | ✅ 완료 |
| F-12 | 이전/다음 레시피 네비게이션 | P2 | Phase 2 | ⬜ S2-3 |
| F-13 | 관련 레시피 추천 | P2 | Phase 2 | ⬜ S2-4 |
| F-14 | 실시간 검색 (클라이언트) | P1 | Phase 1 | ⬜ S1-2 |
| F-15 | 검색어 하이라이팅 | P2 | Phase 4 | ⬜ S4-1 |
| F-16 | 반응형 레이아웃 | P0 | MVP | ✅ 완료 |
| F-17 | 다크 모드 지원 | P1 | Phase 2 | ⬜ S2-1 |
| F-18 | PDF 다운로드 | P1 | MVP | ✅ 완료 |
| F-19 | 관리자 레이아웃 (신규) | P1 | Phase 3 | ✅ 완료 |

---

## 전체 일정 요약

```
MVP (완료)                                                 ✅ 배포됨
        ──────── Notion API + 목록/상세 + ISR + 배포 ────────

Phase 1 — 필터링 및 검색                                   ⬜ 대기
Week 1  ░░░░░░░░ Sprint 1: RecipeFilter URL 연동 + RecipeSearch + 통합
        ──────── F-06(P0) + F-07 + F-14 ────────

Phase 2 — UX 강화                                          ⬜ 대기
Week 2  ░░░░░░░░ Sprint 2: 다크 모드 + 접근성 + 이전/다음 + 관련 레시피
        ──────── F-12 + F-13 + F-17 ────────

Phase 3 — 관리자 기능                                      ✅ 완료
Week 3  ████████ Sprint 3: 관리자 레이아웃 + 대시보드 + 테이블 뷰
        ──────── F-19 (신규) ────────

Phase 4 — 완성도 및 최적화                                 ⬜ 대기
Week 4  ░░░░░░░░ Sprint 4: 하이라이팅 + 페이지네이션 + 성능 + SEO
        ──────── F-09 + F-15 + 최종 배포 ────────
```
