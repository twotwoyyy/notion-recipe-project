---
description: '컴포넌트 이름을 받아 TypeScript + Tailwind CSS 기반 React 함수형 컴포넌트 파일을 생성합니다'
allowed-tools:
  [
    'Read',
    'Write',
    'Glob',
    'Bash(ls:*)',
  ]
---

# Claude 명령어: add-component

컴포넌트 이름 `$1`을 받아 프로젝트 규칙에 맞는 React 함수형 컴포넌트 파일을 생성합니다.

## 사용법

```
/add-component <컴포넌트명> [타입]
```

**타입 옵션** (두 번째 인자, 기본값: `shared`)

| 타입 | 경로 | 용도 |
|------|------|------|
| `shared` | `components/shared/` | 여러 페이지에서 재사용 (기본값) |
| `layout` | `components/layout/` | 헤더·푸터·네비게이션 등 레이아웃 |
| `examples` | `components/examples/` | 예제 페이지 전용 |

## 프로세스

1. **인자 확인**: `$1`(컴포넌트 이름)이 없으면 오류 메시지 출력 후 중단
2. **파일명 변환**: PascalCase 이름 → kebab-case 파일명 (예: `UserCard` → `user-card.tsx`)
3. **타입 결정**: 두 번째 인자로 타입 결정, 없으면 `shared` 사용
4. **중복 확인**: 대상 경로에 동일 파일이 있으면 덮어쓰기 전 사용자에게 확인
5. **파일 생성**: 아래 템플릿 규칙에 따라 컴포넌트 파일 작성
6. **결과 안내**: 생성된 파일 경로와 import 예시 출력

## 컴포넌트 템플릿 규칙

### 서버 컴포넌트 (기본 — `shared`, `layout`)

```tsx
import { cn } from "@/lib/utils"

interface <ComponentName>Props {
  className?: string
  children?: React.ReactNode
}

export function <ComponentName>({ className, children }: <ComponentName>Props) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}
```

### 클라이언트 컴포넌트 (`examples` 타입이거나 상태/이벤트가 명시된 경우)

```tsx
"use client"

import { cn } from "@/lib/utils"

interface <ComponentName>Props {
  className?: string
}

export function <ComponentName>({ className }: <ComponentName>Props) {
  return (
    <div className={cn("", className)}>

    </div>
  )
}
```

## 코딩 규칙

- **들여쓰기**: 2칸
- **네이밍**: 컴포넌트명 PascalCase, props 인터페이스 `<ComponentName>Props`
- **export**: named export 사용 (`export default` 금지)
- **cn()**: `@/lib/utils`의 `cn()` 함수로 className 병합
- **"use client"**: 상태(useState, useEffect), 이벤트 핸들러, 브라우저 API가 필요할 때만 추가
- **주석**: 비즈니스 로직의 WHY가 명확하지 않을 때만 한국어로 작성

## 생성 후 출력 형식

```
✅ 컴포넌트 생성 완료

파일: components/<타입>/<파일명>.tsx
import: import { <ComponentName> } from "@/components/<타입>/<파일명>"
```
