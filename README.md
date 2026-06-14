# 레시피 모음 🍳

Notion을 CMS로 활용하는 레시피 블로그입니다.  
Notion에서 레시피를 작성하면 자동으로 웹사이트에 반영됩니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| CMS | Notion API (`@notionhq/client`) |
| 스타일링 | Tailwind CSS v4 |
| UI 컴포넌트 | shadcn/ui |
| 아이콘 | Lucide React |
| 배포 | Vercel |

## 주요 기능

- **Notion 연동** — Notion 데이터베이스를 CMS로 사용, 별도 관리 페이지 불필요
- **카테고리 필터** — 한식, 양식, 중식 등 카테고리별 레시피 탐색
- **검색** — 제목·태그 기반 실시간 검색
- **ISR** — 콘텐츠 변경 후 60초 이내 자동 반영
- **반응형 디자인** — 모바일 / 태블릿 / 데스크톱 지원
- **다크 모드** — 시스템 설정 연동

## 시작하기

### 1. 저장소 클론 및 패키지 설치

```bash
git clone https://github.com/YOUR_USERNAME/notion-cms-project.git
cd notion-cms-project
npm install
```

### 2. Notion 설정

1. [Notion Integrations](https://www.notion.so/my-integrations)에서 새 통합(Integration) 생성
2. 레시피 데이터베이스 페이지에서 생성한 Integration 연결
3. 데이터베이스 ID 복사 (URL의 `notion.so/YOUR_DB_ID?v=...` 부분)

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다.

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## Notion 데이터베이스 구조

데이터베이스에 아래 속성을 추가하세요.

| 속성명 | 타입 | 설명 |
|--------|------|------|
| `Title` | title | 레시피 제목 |
| `Category` | select | 카테고리 (한식, 양식 등) |
| `Tags` | multi_select | 태그 (재료, 조리법 특성 등) |
| `Published` | date | 발행일 |
| `Status` | select | `초안` / `발행됨` |

> `Status`가 **발행됨**인 항목만 웹사이트에 노출됩니다.

## 개발 명령어

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## 프로젝트 구조

```
notion-cms-project/
├── app/                    # Next.js App Router 라우트
│   ├── page.tsx            # 메인 목록 페이지
│   ├── recipes/[id]/       # 레시피 상세 페이지
│   └── api/revalidate/     # ISR 재검증 엔드포인트
├── components/
│   ├── layout/             # Header, Footer, Nav
│   ├── recipe/             # 레시피 카드, 그리드, 필터
│   ├── notion/             # Notion 블록 렌더러
│   ├── ui/                 # shadcn/ui 컴포넌트
│   └── providers/          # 전역 Context Provider
├── lib/
│   ├── notion.ts           # Notion API 클라이언트
│   └── utils.ts            # 공통 유틸리티
├── types/
│   └── recipe.ts           # TypeScript 타입 정의
└── docs/
    └── PRD.md              # 제품 요구사항 문서
```

## 배포 (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Vercel에 저장소 연결
2. 환경 변수 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`) 추가
3. 배포 완료

## 라이선스

MIT
