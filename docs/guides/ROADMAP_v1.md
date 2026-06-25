# ROADMAP: 레시피 모음 (Recipe Collection)

> **기준 문서**: [PRD v1.0.0](./PRD.md)  
> **작성일**: 2026-06-18  
> **최종 업데이트**: 2026-06-23  
> **Sprint 주기**: 1주 단위  
> **구성 원칙**: 의존성 순서 — 아래 단계가 완성되어야 윗 단계가 동작

---

## 마일스톤 요약

| Phase | 이름 | Sprint | 기간 | 상태 | 목표 |
|-------|------|--------|------|------|------|
| **1** | 프로젝트 골격 | Sprint 1 | 1주 | ✅ 완료 | 환경 설정, 의존성, 타입 시스템 — 코드를 작성할 수 있는 상태 |
| **2** | 공통 모듈 | Sprint 2 | 1주 | ✅ 완료 | Notion API 클라이언트, 블록 변환 유틸 — 모든 기능의 데이터 공급원 |
| **3** | 핵심 기능 | Sprint 3~4 | 2주 | ✅ 완료 (PDF 다운로드 제외) | 목록 페이지 + 상세 페이지 — 사용자가 볼 수 있는 최소 제품 |
| **4** | 추가 기능 | Sprint 5~6 | 2주 | 🔶 일부 UI 완료 | 필터, 검색, SEO, 다크 모드, 네비게이션 — UX 완성 |
| **5** | 최적화 및 배포 | Sprint 7 | 1주 | ⬜ 대기 | 성능 튜닝, ISR 재검증, 프로덕션 배포 |

---

## Phase 1 — 프로젝트 골격 (Sprint 1) ✅ 완료

### 왜 이 순서인가?

> 환경 변수, 의존성, 타입 정의는 **모든 코드의 전제 조건**입니다. `.env.local`이 없으면 Notion API를 호출할 수 없고, 타입이 없으면 어떤 함수도 안전하게 작성할 수 없습니다. 건물의 기초 공사처럼 — 이것이 준비되지 않으면 그 위에 아무것도 쌓을 수 없습니다.

### Sprint 1: 환경 설정 및 타입 시스템 (1주) ✅

> **목표**: 프로젝트의 기술적 기반을 세우고, 코드 작성이 가능한 상태로 만듦

#### 태스크

- [x] **S1-1** 환경 변수 설정 (1h) ✅
  - `.env.local` 생성 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`, `REVALIDATE_SECRET`)
  - `.env.example` 생성 (팀 공유용 템플릿)
  - `next.config.ts`에 이미지 도메인 허용 추가 (Notion S3: `**.amazonaws.com`, `**.notion.so`)
- [x] **S1-2** 의존성 설치 (0.5h) ✅
  - `@notionhq/client` v5.22.0 설치
- [x] **S1-3** 타입 정의 (2h) — `types/recipe.ts` ✅
  - `Recipe` 인터페이스 (id, title, category, tags, publishedAt, status, coverImage)
  - `NotionBlock` 타입 (paragraph, heading_1/2/3, bulleted_list_item, numbered_list_item, image, divider, quote, code, callout, toggle)
  - `CategoryType` 유니온 타입 (한식, 양식, 중식, 일식, 베이킹, 음료, 기타)
  - `RichText`, `RichTextAnnotations`, `NotionBlockType`, `RecipeStatus` 타입 추가
- [x] **S1-4** 사이트 설정 업데이트 (1h) — `lib/constants.ts` ✅
  - `siteConfig` 수정 (사이트명: "레시피 모음", 설명 업데이트)
  - `navItems` 업데이트 (홈, 레시피)
  - `categories` 배열 추가 (카테고리 필터 UI 공용)

**의존성**: S1-1, S1-2 → S1-3, S1-4는 독립

**완료 기준 (DoD)**:
- [x] `.env.local`의 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 설정 완료
- [x] `@notionhq/client` 설치 및 import 가능
- [x] `Recipe`, `NotionBlock`, `CategoryType` 타입이 정의되고 다른 파일에서 import 가능
- [x] TypeScript 컴파일 에러 없음 (`npm run build` 통과)

---

### 🏁 Phase 1 마일스톤 ✅

- [x] 개발 환경 완전 구성 (env, 의존성, 타입)
- [x] 다른 개발자가 클론 후 `.env.local`만 세팅하면 바로 개발 가능
- [x] `npm run build` + `npm run lint` 통과

---

## Phase 2 — 공통 모듈 (Sprint 2) ✅ 완료

### 왜 이 순서인가?

> Notion API 클라이언트와 블록 변환 유틸리티는 **목록 페이지, 상세 페이지, 필터, 검색, ISR 재검증 등 모든 기능이 공유하는 데이터 공급원**입니다. 이것을 먼저 안정적으로 만들어야 이후 모든 기능 개발이 병렬로 진행될 수 있습니다. 반대로 이것이 불안정하면 이후 모든 Sprint에서 버그가 연쇄적으로 발생합니다.

### Sprint 2: Notion API 클라이언트 및 유틸리티 (1주) ✅

> **목표**: Notion 데이터베이스와 통신하는 공통 모듈을 완성하고, 모든 기능의 데이터 기반 확보

#### 태스크

- [x] **S2-1** Notion API 클라이언트 구현 (4h) — `lib/notion.ts` ✅
  - `notionClient` 인스턴스 생성
  - `getPublishedRecipes(category?: string): Promise<Recipe[]>` — 발행된 레시피 목록 조회
  - `getRecipeById(id: string): Promise<Recipe | null>` — 단일 레시피 조회
  - `getRecipeBlocks(id: string): Promise<BlockObjectResponse[]>` — 페이지 블록 조회 (페이지네이션 자동 처리)
  - `getAllRecipeIds(): Promise<string[]>` — generateStaticParams용
  - Notion 속성 → Recipe 타입 변환 로직 (`pageToRecipe`, `extractTitle`, `extractSelect`, `extractMultiSelect`, `extractDate`, `extractCoverImage`)
  - 발행일 기준 내림차순 정렬 (`sorts: [{ property: "Published", direction: "descending" }]`)
  - ⚠️ **`@notionhq/client` v5 대응**: `databases.query` → `dataSources.query` API 변경 반영, `data_source_id` 파라미터 사용
- [x] **S2-2** 블록 변환 유틸리티 (3h) — `lib/notion-utils.ts` ✅
  - `transformBlock(block: BlockObjectResponse): NotionBlock | null` — Notion 블록 → 내부 타입 변환
  - `transformBlocks(blocks: BlockObjectResponse[]): NotionBlock[]` — 배열 일괄 변환 (미지원 블록 자동 필터)
  - `extractPlainText(richTextItems): string` — 리치 텍스트 → 문자열
  - 지원 블록 (10종): paragraph, heading_1/2/3, bulleted_list_item, numbered_list_item, image, divider, quote, code, callout, toggle
  - 이미지 URL 추출 (external / file 타입 분기), 캡션 추출
  - 콜아웃 아이콘(emoji) 추출
- [x] **S2-3** API 연동 검증 (1h) ✅
  - 개발 서버에서 Notion DB 연결 확인 ✅
  - "발행됨" 필터링 정상 동작 확인 ✅ (발행됨 2개 표시, 초안 1개 제외)
  - `npm run build`에서 실제 Notion API로 정적 페이지 생성 확인 ✅

**의존성**: Phase 1 완료 → S2-1 → S2-2 → S2-3

**완료 기준 (DoD)**:
- [x] `getPublishedRecipes()`가 Notion DB에서 "발행됨" 레시피만 반환 (코드 구현 완료, 연동 검증 대기)
- [x] `getRecipeById()`가 단일 레시피 데이터를 올바른 타입으로 반환 (코드 구현 완료)
- [x] `getRecipeBlocks()`가 페이지 블록 목록 반환 (코드 구현 완료)
- [x] `getAllRecipeIds()`가 전체 레시피 ID 배열 반환 (코드 구현 완료)
- [x] TypeScript 컴파일 에러 없음 (`npm run build` 통과 확인)
- [x] **실제 Notion DB 연동 테스트** ✅ (2026-06-25 검증 완료):
  - API 호출 결과 검증: 발행됨 레시피 2개(김치찌개, 까르보나라 파스타) 정상 조회
  - "초안" 상태 레시피(마파두부) 결과에서 제외 확인
  - 상세 페이지 Notion 블록 렌더링(heading, paragraph, list, callout, quote, divider) 정상 확인

---

### 🏁 Phase 2 마일스톤

- [x] Notion API 클라이언트 코드 완성 — `lib/notion.ts`, `lib/notion-utils.ts`
- [x] 모든 Notion 블록 타입(10종)을 내부 타입으로 변환 가능
- [x] `npm run build` 통과 (TypeScript 에러 없음)
- [x] Notion DB 연동 검증 ✅ (2026-06-25 완료)

---

## Phase 3 — 핵심 기능 (Sprint 3~4) ✅ 완료

### 왜 이 순서인가?

> 목록 페이지와 상세 페이지는 **사용자가 실제로 보는 화면**이며, PRD의 P0 기능 대부분이 여기에 해당합니다. Phase 2에서 만든 공통 모듈 위에 UI를 올리는 단계로 — 이것이 완성되면 MVP(최소 기능 제품)로 배포할 수 있습니다. 필터, 검색, SEO는 이 핵심 페이지가 존재해야 의미가 있으므로 뒤로 미룹니다.

### Sprint 3: 레시피 목록 페이지 (1주) ✅

> **목표**: 메인 페이지에서 레시피 카드 그리드를 ISR로 렌더링

#### 태스크

- [x] **S3-1** RecipeCard 컴포넌트 (3h) — `components/recipe/recipe-card.tsx` ✅
  - 썸네일 이미지 (`next/image`, 커버 없을 때 placeholder 포함)
  - 제목, 카테고리 배지, 태그 목록, 발행일
  - 카드 클릭 시 `/recipes/[id]`로 이동
  - 반응형 레이아웃 (모바일 1열, 태블릿 2열, 데스크톱 3열)
- [x] **S3-2** RecipeGrid 컴포넌트 (2h) — `components/recipe/recipe-grid.tsx` ✅
  - Recipe[] 배열을 받아 카드 그리드 렌더링
  - 레시피 없을 때 빈 상태(Empty State) UI (UtensilsCrossed 아이콘 + 안내 문구)
- [x] **S3-3** 메인 페이지 구현 (3h) — `app/page.tsx` 수정 ✅
  - 서버 컴포넌트로 `getPublishedRecipes()` 호출 ✅
  - ISR 적용 (`revalidate: 60`) ✅
  - 히어로 영역 (사이트 제목 + 소개 문구 + 검색창 UI) ✅
  - RecipeGrid 렌더링 ✅

**의존성**: Phase 2 완료 → S3-1 → S3-2 → S3-3

**완료 기준 (DoD)**:
- [x] `/`에서 레시피가 카드 형태로 표시 (Notion API 실데이터) ✅
- [x] ISR 동작 확인 (`revalidate: 60`) ✅
- [x] 모바일/데스크톱 반응형 정상 동작 (Playwright 검증 완료: 375px 1열, 1280px 3열)
- [x] `npm run build` 성공
- [x] **Playwright MCP 테스트**:
  - `browser_navigate` → `/` 이동, 카드 그리드 DOM 구조 확인 ✅
  - `browser_resize`로 모바일(375px) / 데스크톱(1280px) 반응형 검증 + 스크린샷 확인 ✅
  - 빈 상태(Empty State) UI 컴포넌트 구현 확인 ✅

---

### Sprint 4: 레시피 상세 페이지 (1주) ✅

> **목표**: Notion 블록 콘텐츠를 렌더링하는 상세 페이지 완성

#### 태스크

- [x] **S4-1** NotionRenderer 컴포넌트 (6h) — `components/notion/notion-renderer.tsx` ✅
  - 지원 블록 (10종): paragraph, heading_1/2/3, bulleted_list_item, numbered_list_item, image, divider, quote, code, callout, toggle
  - 리치 텍스트 스타일 지원 (bold, italic, underline, strikethrough, code, link, color) + Notion 색상 매핑
  - 이미지: `next/image` 사용
- [x] **S4-2** 레시피 상세 페이지 (4h) — `app/recipes/[id]/page.tsx` ✅
  - `generateStaticParams()`로 정적 경로 생성 ✅
  - `generateMetadata()`로 SEO 메타데이터 + OG 태그 동적 생성 ✅
  - `await params` 사용 (Next.js 16 필수) ✅
  - 메타데이터 영역: 카테고리 배지, 태그, 발행일 ✅
  - NotionRenderer로 본문 렌더링 ✅ (Notion API 연동 완료)
  - ISR 적용 (`revalidate: 60`) ✅
  - 존재하지 않는 ID → `notFound()` 호출 ✅
- [x] **S4-3** 브레드크럼 (1.5h) ✅
  - ShadcnUI Breadcrumb 활용 (상세 페이지에 인라인 구현)
  - 홈 > 카테고리 > 레시피 제목
- [x] **S4-4** 에러/로딩 페이지 (1.5h) ✅
  - `app/recipes/[id]/loading.tsx` — 스켈레톤 UI (브레드크럼 + 제목 + 본문 스켈레톤)
  - `app/recipes/[id]/not-found.tsx` — 404 페이지 (SearchX 아이콘 + 홈 링크)
  - `app/recipes/[id]/error.tsx` — 에러 페이지 (`"use client"` 적용, 다시 시도 버튼)
- [ ] **S4-5** PDF 다운로드 기능 (2h) ⬜
  - `app/globals.css`에 `@media print` 스타일 추가 (헤더/푸터/네비 숨김, 본문 최대 너비 해제)
  - `components/recipe/recipe-print-button.tsx` — `"use client"`, `window.print()` 호출 버튼
  - 상세 페이지에 PDF 다운로드 버튼 배치
  - 인쇄 시 레시피 제목 + 메타데이터 + 본문만 깔끔하게 출력

**의존성**: Phase 2 완료 → S4-1 → S4-2, S4-3/S4-4는 독립

**완료 기준 (DoD)**:
- [x] `/recipes/[id]`에서 본문이 올바르게 렌더링 (Notion API 실데이터) ✅
- [x] 텍스트, 이미지, 목록, 코드블록 등 주요 블록 타입 정상 표시 (Playwright 검증 완료)
- [x] OG 태그가 생성됨 (Notion 실데이터 기반 generateMetadata) ✅
- [x] `app/recipes/[id]/not-found.tsx` 404 페이지 존재
- [x] `npm run build` 성공
- [x] **Playwright MCP 테스트**:
  - `browser_navigate` → `/recipes/recipe-1` 이동, 본문 블록 렌더링 확인 ✅
  - 각 블록 타입(heading, paragraph, list, code, quote, callout, toggle) 스타일 확인 ✅
  - 브레드크럼 렌더링 확인 ✅
  - `browser_take_screenshot`으로 모바일(375px) + 데스크톱(1280px) 시각적 검증 완료 ✅

---

### 🏁 Phase 3 마일스톤

- [x] 목록/상세 페이지 UI 완성 (Notion API 실데이터 기반) ✅
- [x] Notion DB에서 실제 레시피를 조회하여 렌더링 ✅ (2026-06-25 연동 완료)
- [x] ISR로 콘텐츠 자동 갱신 동작 (`revalidate: 60`) ✅
- [ ] Vercel 배포 가능 상태 (MVP)
- [ ] Lighthouse Performance 80+ (MVP 기준)
- [x] Playwright MCP 시각적 검증 통과 (반응형 + 블록 렌더링) ✅

---

## Phase 4 — 추가 기능 (Sprint 5~6) 🔶 일부 UI 완료

### 왜 이 순서인가?

> 필터, 검색, SEO, 다크 모드, 네비게이션은 모두 **핵심 페이지 위에 얹는 부가 기능**입니다. 목록 페이지가 없으면 필터를 붙일 곳이 없고, 상세 페이지가 없으면 "이전/다음" 네비게이션이 의미 없습니다. 또한 SEO 메타데이터는 실제 콘텐츠가 렌더링되는 페이지가 있어야 검증할 수 있습니다. Phase 3이 MVP를 만들었다면, Phase 4는 그 MVP를 **완성된 제품**으로 끌어올리는 단계입니다.

### Sprint 5: 필터링 및 검색 (1주) 🔶

> **목표**: 카테고리 필터와 텍스트 검색으로 레시피 탐색 UX 완성

#### 태스크

- [ ] **S5-1** RecipeFilter 컴포넌트 (3h) — `components/recipe/recipe-filter.tsx` 🔶 UI 완료 / URL 연동 대기
  - `"use client"` 클라이언트 컴포넌트 ✅
  - 카테고리 탭 UI (전체, 한식, 양식, 중식, 일식, 베이킹, 음료, 기타) ✅
  - ~~URL 쿼리 파라미터 (`?category=한식`) 기반 필터링~~ → 현재 로컬 state만 사용 중
  - ~~`useRouter`, `useSearchParams` 사용~~ → URL 연동 미구현
- [ ] **S5-2** RecipeSearch 컴포넌트 (3h) — `components/recipe/recipe-search.tsx`
  - `"use client"` 클라이언트 컴포넌트
  - 검색 입력 → URL 쿼리 파라미터 (`?q=검색어`) 반영
  - 디바운스 적용 (300ms)
- [ ] **S5-3** 메인 페이지 필터/검색 통합 (3h) — `app/page.tsx` 수정
  - `searchParams` 수신 (`await searchParams`, Next.js 16)
  - 카테고리 필터 → 서버 사이드 Notion 쿼리 필터
  - 텍스트 검색 → 클라이언트 사이드 필터링
  - RecipeFilter + RecipeSearch + RecipeGrid 조합

**의존성**: S5-1, S5-2 독립 → S5-3에서 통합

**완료 기준 (DoD)**:
- [ ] `/?category=한식`으로 접속 시 한식 레시피만 표시
- [ ] 검색어 입력 시 제목/태그 기준 실시간 필터링
- [ ] URL 공유 시 필터/검색 상태 유지
- [ ] 결과 없을 때 적절한 안내 표시
- [ ] **Playwright MCP 테스트**:
  - `browser_click`으로 카테고리 탭 클릭 → 필터링된 결과만 표시되는지 확인
  - `browser_type`으로 검색어 입력 → 디바운스 후 결과 필터링 확인 (`browser_wait_for`)
  - `browser_navigate` → `/?category=한식&q=김치` URL 직접 접속 시 필터/검색 상태 유지 확인
  - 결과 없는 검색어 입력 → 빈 상태 안내 표시 확인
  - `browser_snapshot`으로 필터 전후 DOM 변화 비교

---

### Sprint 6: SEO, 다크 모드, 탐색 네비게이션 (1주)

> **목표**: 검색 엔진 최적화, 테마 완성, 상세 페이지 탐색 편의성 강화

#### 태스크

- [ ] **S6-1** 메타데이터 최적화 (2h)
  - `app/layout.tsx` — 전역 메타데이터, 사이트 OG 이미지
  - `app/page.tsx` — 목록 페이지 메타데이터
  - `app/recipes/[id]/page.tsx` — `generateMetadata()`에서 레시피별 title, description, OG 태그
- [ ] **S6-2** sitemap + robots (1.5h)
  - `app/sitemap.ts` — 동적 사이트맵 생성 (전체 레시피 URL 포함)
  - `app/robots.ts` — robots.txt 생성
- [ ] **S6-3** 다크 모드 스타일 점검 (2h)
  - 기존 ThemeToggle 동작 확인
  - 레시피 카드, 상세 페이지, NotionRenderer의 다크 모드 스타일 조정
  - 코드 블록 다크 모드 색상 대응
- [ ] **S6-4** 접근성 점검 (1.5h)
  - 이미지 alt 텍스트 확인
  - 키보드 네비게이션 테스트
  - 색상 대비 확인 (WCAG 2.1 AA)
- [ ] **S6-5** 이전/다음 레시피 네비게이션 (2h) — `components/recipe/recipe-navigation.tsx`
  - 현재 레시피 기준 이전/다음 레시피 링크
  - `lib/notion.ts`에 `getAdjacentRecipes(id: string)` 함수 추가
- [ ] **S6-6** 관련 레시피 추천 (2h) — `components/recipe/related-recipes.tsx`
  - 동일 카테고리의 다른 레시피 최대 3개 표시
  - RecipeCard 재사용
  - `lib/notion.ts`에 `getRelatedRecipes(category: string, excludeId: string)` 함수 추가
- [ ] **S6-7** 상세 페이지 통합 (1h) — `app/recipes/[id]/page.tsx` 수정
  - RecipeNavigation 배치 (본문 하단)
  - RelatedRecipes 배치 (네비게이션 하단)

**의존성**: S6-1~S6-4 독립 병렬 가능, S6-5/S6-6 독립 → S6-7에서 통합

**완료 기준 (DoD)**:
- [ ] Lighthouse SEO 100점
- [ ] OG 태그 미리보기 정상 표시 (Twitter/Facebook 디버거)
- [ ] 다크/라이트 모드 전환 시 모든 페이지 정상 렌더링
- [ ] 키보드만으로 주요 기능 사용 가능
- [ ] 상세 페이지에서 이전/다음 레시피로 이동 가능
- [ ] 동일 카테고리 관련 레시피 표시
- [ ] 첫 번째/마지막 레시피에서 경계 처리 정상
- [ ] **Playwright MCP 테스트**:
  - `browser_evaluate`로 `<meta>` OG 태그 존재 및 값 검증
  - `browser_click`으로 다크 모드 토글 → `browser_take_screenshot`으로 라이트/다크 비교
  - `browser_press_key` (Tab, Enter)으로 키보드 네비게이션 동작 확인
  - 목록 페이지 + 상세 페이지 모두 다크 모드 스타일 정상 렌더링 확인
  - `browser_click`으로 "다음 레시피" 클릭 → 페이지 전환 확인 (`browser_wait_for` + `browser_snapshot`)
  - `browser_click`으로 "이전 레시피" 클릭 → 원래 페이지로 복귀 확인
  - 첫 번째/마지막 레시피에서 비활성화 상태 확인
  - 관련 레시피 카드 클릭 → 해당 상세 페이지 이동 확인

---

### 🏁 Phase 4 마일스톤

- [ ] 카테고리 필터 + 텍스트 검색 동작
- [ ] Lighthouse SEO 100점 달성
- [ ] 다크 모드 완전 지원
- [ ] WCAG 2.1 AA 기본 준수
- [ ] 이전/다음 + 관련 레시피 네비게이션 완성
- [ ] Playwright MCP E2E 테스트 전체 통과 (필터/검색 인터랙션 + SEO 메타태그 + 다크 모드 + 키보드 접근성 + 탐색 네비게이션)

---

## Phase 5 — 최적화 및 배포 (Sprint 7)

### 왜 이 순서인가?

> 성능 최적화와 배포는 **기능이 모두 구현된 후에야 의미가 있습니다.** 기능이 추가/변경될 때마다 번들 크기와 네트워크 요청 패턴이 바뀌기 때문에, 미완성 상태에서 최적화하면 이중 작업이 됩니다. ISR 재검증 API도 목록/상세 페이지가 안정된 후에 연결해야 올바르게 동작합니다. 마지막으로, 프로덕션 배포 전 전체 사이트를 대상으로 한 회귀 테스트가 이 단계에서 수행됩니다.

### Sprint 7: 성능 최적화 및 프로덕션 배포 (1주)

> **목표**: 프로덕션 수준의 성능과 운영 안정성 확보, 배포 완료

#### 태스크

- [ ] **S7-1** ISR 재검증 API (3h) — `app/api/revalidate/route.ts`
  - POST 엔드포인트: Notion Webhook 수신
  - `REVALIDATE_SECRET` 검증
  - `revalidatePath('/')` + `revalidatePath('/recipes/[id]')` 호출
- [ ] **S7-2** 이미지 최적화 (2h)
  - `next/image` 설정 최적화 (sizes, priority, placeholder)
  - Notion 이미지 URL 만료 대응 전략 적용
  - 커버 이미지 없을 때 기본 이미지 처리
- [ ] **S7-3** 성능 측정 및 최적화 (3h)
  - Lighthouse 측정 (Performance, Accessibility, SEO)
  - 번들 분석 (`@next/bundle-analyzer`)
  - 불필요한 클라이언트 번들 제거
  - Core Web Vitals 목표 달성 확인
- [ ] **S7-4** 페이지네이션 (선택) (2h) — `components/recipe/recipe-pagination.tsx`
  - Notion API cursor 기반 페이지네이션
  - 또는 "더 보기" 버튼 방식
- [ ] **S7-5** 프로덕션 배포 (1h)
  - Vercel 배포 설정 및 환경 변수 등록
  - 프로덕션 빌드 최종 확인

**의존성**: Phase 4 완료 → S7-1~S7-4 독립 병렬 가능 → S7-5 마지막

**완료 기준 (DoD)**:
- [ ] Webhook으로 ISR 재검증 정상 동작
- [ ] Lighthouse Performance 90+ 달성
- [ ] LCP < 2.5s, CLS < 0.1
- [ ] 이미지 로딩 최적화 완료
- [ ] 프로덕션 URL에서 전체 기능 동작 확인
- [ ] **Playwright MCP 테스트**:
  - `browser_evaluate`로 `/api/revalidate` POST 요청 → 성공/실패 응답 검증
  - 잘못된 secret 전송 시 401 응답 확인
  - `browser_network_requests`로 이미지 로딩 상태 확인 (200, 적절한 크기)
  - 커버 이미지 없는 레시피 → 기본 이미지 표시 확인
  - `browser_navigate` → 전체 사이트 주요 경로 순회하며 콘솔 에러 없음 최종 확인

---

### 🏁 Phase 5 마일스톤

- [ ] 전체 기능 완성 (PRD 요구사항 100% 충족)
- [ ] Lighthouse Performance 90+, SEO 100
- [ ] Core Web Vitals 목표 달성 (LCP < 2.5s, CLS < 0.1, FID < 100ms)
- [ ] 프로덕션 배포 완료
- [ ] Playwright MCP 전체 사이트 E2E 회귀 테스트 통과 (모든 주요 경로 + 엣지 케이스)

---

## 리스크 및 대응 방안

| # | 리스크 | 영향도 | 상태 | 대응 방안 |
|---|--------|--------|------|-----------|
| R1 | **Notion API Rate Limit** (초당 3회) | 높음 | ⬜ | ISR 캐싱으로 API 호출 최소화, `revalidate: 60` 적용. 빌드 시 요청 간 딜레이 추가 |
| R2 | **Notion 이미지 URL 만료** (1시간) | 중간 | ⬜ | ISR 재검증 주기(60초)로 URL 갱신. 필요 시 이미지 프록시 또는 외부 스토리지 업로드 검토 |
| R3 | **Notion 블록 타입 미지원** | 중간 | ✅ 대응 완료 | 10종 블록 지원 구현 (`lib/notion-utils.ts`), 미지원 블록은 `transformBlock`에서 `null` 반환하여 자동 필터링 |
| R4 | **Next.js 16 Breaking Changes** | 중간 | ✅ 인지 중 | `params`/`searchParams`는 반드시 `await` 사용. 공식 마이그레이션 가이드 참조 |
| R5 | **Notion DB 구조 변경** | 낮음 | ✅ 대응 완료 | 타입 정의를 중앙 관리(`types/recipe.ts`), 속성 매핑을 `lib/notion.ts`의 `pageToRecipe`에 집중 |
| R6 | **`@notionhq/client` v5 API 변경** | 중간 | ✅ 대응 완료 | `databases.query` → `dataSources.query`로 변경됨. `data_source_id` 파라미터 사용. `lib/notion.ts`에 반영 완료 |
| R7 | **Notion DB 인테그레이션 권한** | 높음 | ✅ 해결 완료 | 인테그레이션 연동 확인 완료 (2026-06-25). DB ID: `b91c3d60-0542-4539-b6f5-83fb61fdd451` |

---

## 전체 일정 요약

```
Phase 1 — 프로젝트 골격                                    ✅ 완료
Week 1  ████████ Sprint 1: 환경 설정 + 타입 시스템
        ──────── 코드 작성 가능 상태 ────────

Phase 2 — 공통 모듈                                        ✅ 완료
Week 2  ████████ Sprint 2: Notion API 클라이언트 + 블록 유틸
        ──────── 데이터 공급원 완성 ────────

Phase 3 — 핵심 기능                                        ✅ 완료
Week 3  ████████ Sprint 3: 레시피 목록 페이지 (API 연동 완료)
Week 4  ████████ Sprint 4: 레시피 상세 페이지 (API 연동 완료)
        ──────── MVP 완성 ────────

Phase 4 — 추가 기능                                        🔶 일부 UI 완료
Week 5  ██░░░░░░ Sprint 5: 필터링 + 검색 (필터 UI 완료)
Week 6  ░░░░░░░░ Sprint 6: SEO + 다크 모드 + 네비게이션
        ──────── 완성된 제품 ────────

Phase 5 — 최적화 및 배포                                   ⬜ 대기
Week 7  ░░░░░░░░ Sprint 7: 성능 최적화 + 프로덕션 배포
        ──────── 프로덕션 릴리스 ────────
```

---

## 기술 메모 (구현 중 발견사항)

| 발견일 | 항목 | 내용 |
|--------|------|------|
| 2026-06-22 | `@notionhq/client` v5 API 변경 | `databases.query()` → `dataSources.query()`, 파라미터 `database_id` → `data_source_id` |
| 2026-06-22 | Notion 블록 타입 구조 | `paragraph.rich_text`, `heading_1.rich_text` 등 블록 타입별 nested 구조. `image`는 `external.url` / `file.url` 분기 |
| 2026-06-22 | 커버 이미지 | `page.cover`는 `external` (URL) 또는 `file` (만료 URL) 타입. ISR 주기 내 갱신 필요 |
| 2026-06-22 | Status 속성 | Notion `select` 또는 `status` 타입 모두 대응 (`extractSelect` 함수에서 분기 처리) |
| 2026-06-23 | UI 디자인 일괄 완료 | RecipeCard, RecipeGrid, HeroSection, RecipeFilter, NotionRenderer, 상세 페이지, 로딩 스켈레톤, 404/에러 페이지 — mock 데이터 기반 디자인 완료. Playwright 검증 통과 (모바일 375px, 데스크톱 1280px) |
| 2026-06-23 | NotionRenderer 색상 매핑 | Notion 9가지 텍스트 색상 + 9가지 배경 색상을 Tailwind 클래스로 매핑, 다크 모드 대응 포함 |
| 2026-06-23 | 브레드크럼 구현 방식 | 별도 `recipe-breadcrumb.tsx` 대신 `app/recipes/[id]/page.tsx` 내 인라인으로 ShadcnUI Breadcrumb 적용 |
