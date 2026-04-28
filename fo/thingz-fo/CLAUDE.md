@AGENTS.md

# THINGZ FO — 개발 규칙

## 기술 스택
- Next.js (App Router) + TypeScript
- MUI (Material UI) v9 — 스타일링은 MUI `sx` prop 사용
- `next dev --webpack` (Turbopack 미사용)

## 폴더 구조

```
app/
├── (main)/                      # 메인 레이아웃 (Header + pagePadding)
│   ├── layout.tsx
│   ├── page.tsx                 # 메인 피드
│   └── article/[id]/
│       ├── layout.tsx           # 상세 전용 레이아웃 (grey.100 배경)
│       ├── page.tsx
│       └── _components/         # 이 페이지 전용 컴포넌트 (_prefix = 라우팅 제외)
│           └── SidePanel.tsx
├── (write)/                     # 글쓰기 레이아웃 (grey.100 배경 + pagePadding)
│   ├── layout.tsx
│   └── write/page.tsx
└── components/                  # 전역 공유 컴포넌트
    ├── article/
    │   ├── ArticleContent.tsx
    │   ├── ArticleTrade.tsx
    │   └── ArticleEditorProfile.tsx
    ├── write/
    │   ├── WriteHeader.tsx
    │   ├── WriteEditor.tsx
    │   └── WriteSaleSettings.tsx
    ├── FeaturedCard.tsx
    ├── ItemCard.tsx
    ├── TodayEditors.tsx
    ├── EditorItem.tsx
    ├── Header.tsx
    └── MobileSidebar.tsx

lib/
├── api/
│   ├── client.ts                # fetch wrapper, ApiError 클래스
│   ├── articles.ts              # article API 함수
│   └── users.ts                 # user API 함수
├── types/
│   ├── article.ts               # Article 관련 타입
│   └── user.ts                  # User 관련 타입
└── styles/
    └── sx.ts                    # 공통 MUI sx 상수
```

## import 경로 규칙

- `lib/`, `app/components/` 등 참조 시 항상 `@/` 절대 경로 사용
- 상대 경로(`../../../`)는 같은 폴더 레벨에서만 허용
- `_components/` 같은 중첩 폴더에서는 반드시 절대 경로

```ts
// 금지
import ArticleTrade from "../../../components/article/ArticleTrade";

// 권장
import ArticleTrade from "@/app/components/article/ArticleTrade";
import { fetchArticle } from "@/lib/api/articles";
```

## 데이터 페칭 규칙

### 서버 컴포넌트 (기본)
- 메인 피드, 아티클 상세 등 SEO가 필요한 페이지는 서버 컴포넌트에서 fetch
- `"use client"` 없이 `async` 함수로 작성
- 병렬 호출: `Promise.all` + `.catch(() => [])` 패턴

```ts
export default async function Page() {
  const [articles, users] = await Promise.all([
    fetchArticles().catch(() => []),
    fetchUsers().catch(() => []),
  ]);
}
```

### 클라이언트 컴포넌트
- 인터랙션(폼, 버튼 핸들러 등)이 있는 경우만 `"use client"` 사용
- 단순 UI 렌더링이면 서버 컴포넌트로 유지
- API 에러는 `ApiError` 인스턴스로 구분

```ts
try {
  await createArticle(payload);
} catch (e) {
  const msg = e instanceof ApiError ? `실패 (${e.status})` : "오류가 발생했습니다.";
}
```

## API 클라이언트 규칙

- `lib/api/client.ts`의 `apiClient.get / apiClient.post` 사용
- 직접 `fetch` 호출 금지 — 반드시 `apiClient` 경유
- BASE URL은 `NEXT_PUBLIC_API_BASE` 환경변수 (`.env.local`)
- API 함수는 에러 시 `throw` — 빈 값 반환 금지

```ts
// lib/api/articles.ts
export async function fetchArticles(): Promise<ArticleListItem[]> {
  return apiClient.get<ArticleListItem[]>("/articles");
}
```

## 타입 규칙

- 모든 API 응답 타입은 `lib/types/`에 정의
- page 파일 내 인라인 `interface` 정의 금지
- 컴포넌트 props 타입은 컴포넌트 파일 안에 정의 (전역 공유 불필요)

## 스타일 규칙

### 타이포그래피 / 치수 토큰 (`lib/styles/typography.ts`)

| 토큰 | 용도 |
|------|------|
| `fs` | 폰트 사이즈 — `fs.sm`(12px) `fs.md`(14px) `fs.lg`(15px) `fs.xl`(16px) `fs["2xl"]`(18px) `fs["3xl"]`(20px) `fs["4xl"]`(24px) `fs["5xl"]`(28px) `fs["6xl"]`(32px) |
| `fw` | 폰트 굵기 — `fw.normal`(400) `fw.bold`(700) |
| `lh` | 줄 높이 — `lh.relaxed`(1.8) |
| `dim` | 공통 치수 — `avatarSize`, `followBtnHeight`, `inputRowHeight`, `appBarHeight`, `drawerWidth`, `searchWidth`, `badgeHeight` |
| `textPrimary` | `fontSize: fs.md, color: "text.primary"` |
| `textSecondary` | `fontSize: fs.sm, color: "text.secondary"` |
| `labelBold` | `fontSize: fs.md, fontWeight: fw.bold, color: "text.primary"` |
| `captionText` | `fontSize: fs.sm, color: "text.secondary"` |
| `titleLg` | `fontSize: { xs: "18px", md: "24px" }, fontWeight: fw.bold, color: "text.primary"` |
| `titleMd` | `fontSize: fs.xl, fontWeight: fw.bold` |
| `titleSm` | `fontSize: fs.lg, fontWeight: fw.bold, color: "text.primary"` |
| `btnDark` | 다크 버튼 (grey.900 배경, py:1.5, borderRadius:2) |
| `btnPill` | 다크 pill 버튼 (borderRadius:"20px", px:3) |
| `badgeChip` | 이미지 위 뱃지 Chip (fontWeight, fontSize, height, borderRadius) |

- **픽셀 하드코딩 금지**: `"12px"`, `700` 같은 값을 `sx` 안에 직접 쓰지 말고 위 토큰 사용
- 새 치수/폰트가 2곳 이상 쓰이면 즉시 `typography.ts`에 추가

### 공통 sx 상수 (`lib/styles/sx.ts`)

| 상수 | 용도 | 사용처 |
|------|------|--------|
| `cardBase` | 카드 공통 (shadow, hover, radius) | FeaturedCard, ItemCard |
| `cardImage` | 카드/패널 이미지 (cover, center) | FeaturedCard, ItemCard, ArticleContent, ArticleEditorProfile |
| `panelBase` | 패널 공통 (white bg, shadow, radius) | ArticleTrade, ArticleEditorProfile, TodayEditors, WriteSaleSettings |
| `pagePadding` | 페이지 공통 px/py | layout.tsx들 |
| `pageWithSidebar` | 메인+사이드 flex 레이아웃 | page.tsx들 |
| `sidebarWidth` | PC 사이드바 (xs: none, md: flex) | page.tsx들 |
| `mobileSidebar` | 모바일 사이드바 (xs: flex, md: none) | page.tsx들 |
| `mainContent` | flex: 1, minWidth: 0 | page.tsx들 |

### 배경색/padding은 layout에서 처리
- page 파일에서 `bgcolor`, `minHeight`, `px/py` 직접 지정 금지
- 레이아웃이 다른 페이지 그룹은 별도 `layout.tsx` 추가

```
(main)/layout.tsx            → 기본 흰 배경, pagePadding
article/[id]/layout.tsx      → grey.100 배경, pagePadding
(write)/layout.tsx           → grey.100 배경, pagePadding
```

### sx 추출 기준
- 3곳 이상 반복될 때만 `sx.ts`로 추출
- 1회성 스타일은 인라인 `sx`로 유지
- `cardBase`를 비클릭 컴포넌트에 적용할 때는 `cursor`/`hover` 오버라이드

```ts
// ArticleContent — 클릭 불가 카드
<Box sx={{ ...cardBase, cursor: "default", "&:hover": undefined }}>
```

### 새 컴포넌트 작성 체크리스트

1. **스타일 먼저 확인**: `lib/styles/sx.ts`와 `lib/constants/theme.ts`를 먼저 확인하고, 이미 있는 상수를 재사용
2. **새 스타일 등장 시**: 인라인으로 먼저 작성 → 3곳 이상 반복되면 즉시 `sx.ts`에 추출
3. **컬러 하드코딩 금지**: `#FBA96E` 등 직접 입력 금지 — 반드시 `BRAND_COLOR` 상수 사용
4. **panelBase 우선**: 흰 배경 + 그림자 + radius 패턴은 무조건 `panelBase` spread
5. **cardBase 우선**: 클릭 가능한 카드 패턴은 `cardBase` spread, 비클릭이면 `cursor/hover` 오버라이드
6. **import 경로**: 항상 `@/` 절대 경로, 상대 경로는 동일 폴더 내에서만

## 컴포넌트 규칙

### props 가공은 사용하는 쪽 책임
- API 응답 → props 변환 로직은 page 또는 `_components`에서 처리
- 공통 컴포넌트(`FeaturedCard`, `ItemCard` 등)는 가공된 값만 받음

### 페이지 전용 컴포넌트는 `_components/` 폴더
```
article/[id]/
└── _components/
    └── SidePanel.tsx    # ArticleDetail 받아서 하위 컴포넌트 조합 + props 가공
```

### PC/모바일 중복 렌더링 패턴
- 사이드 패널처럼 PC/모바일 둘 다 필요한 경우 컴포넌트로 추출 후 `sidebarWidth`/`mobileSidebar`로 제어

```tsx
<Box sx={sidebarWidth}>   {/* PC only */}
  <SidePanel article={article} />
</Box>
<Box sx={mobileSidebar}>  {/* 모바일 only */}
  <SidePanel article={article} />
</Box>
```

### 빈 상태 처리
- API 실패/데이터 없음 → 하드코딩 더미 렌더링 금지
- 빈 문자열/메시지로 처리

```tsx
// 금지
{rest.length > 0 ? rest.map(...) : <><ItemCard /><ItemCard /><ItemCard /></>}

// 권장
{rest.length > 0 ? rest.map(...) : (
  <Typography>아직 아티클이 없습니다.</Typography>
)}
```

## 상수 규칙

### 브랜드 컬러 (`lib/constants/theme.ts`)
- `#FBA96E` 같은 컬러 하드코딩 금지 — 반드시 상수 사용

```ts
import { BRAND_COLOR, BRAND_COLOR_HOVER, KAKAO_COLOR, KAKAO_COLOR_HOVER } from "@/lib/constants/theme";
```

### 네비게이션 (`lib/constants/nav.ts`)
- `NAV_ITEMS` — 라벨/경로 한 곳에서 관리, `Header`와 `MobileSidebar`가 공유

## 공통 UI 컴포넌트 (`app/components/ui/`)

| 컴포넌트 | 용도 |
|----------|------|
| `SectionLabel` | 섹션 소제목 (`"판매자"`, `"거래 문의하기"` 등 12px grey) |
| `InputRow` | 회색 박스 인풋 (높이 40px, borderRadius 2) |
| `CardImageBox` | 카드 이미지 영역 (aspectRatio + 배지 옵션) — FeaturedCard, ItemCard, ArticleContent 공유 |

- 새로운 공통 UI 패턴이 3곳 이상 반복되면 `ui/` 폴더에 추출

## 백엔드 연동

- API Base: `http://localhost:8080/api/fo` (`.env.local`의 `NEXT_PUBLIC_API_BASE`)
- CORS: Spring Boot `@CrossOrigin(origins = "http://localhost:3000")`
- Swagger UI: `http://localhost:8080/swagger-ui`
- 임시 유저: `TEMP_USER_ID = "00000000-0000-0000-0000-000000000001"` (로그인 구현 전)

## 개선 예정 (NOTES.md 참고)
- `FeaturedCard`: `isFeatured` 컬럼 추가 후 관리자 지정 방식으로 전환
- 이미지 업로드: S3 presigned URL 방식
- 인증: JWT 기반 유저 ID 주입
