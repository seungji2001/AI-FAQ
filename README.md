# Thingz

> 빈티지 가구와 중고 물품을 거래하는 감성 커뮤니티 플랫폼

---

## 📸 화면 미리보기

| 피드 & 탐색 | 상품 상세 | 마이 페이지 |
|:-----------:|:---------:|:-----------:|
| <img width="500" alt="Feed" src="https://github.com/user-attachments/assets/f9f73150-bbb3-463d-bcac-a6bdc8c7a5f3" /> | <img width="500" alt="Detail" src="https://github.com/user-attachments/assets/77363d53-7a47-42d9-9b62-1eca94abc5cc" /> | <img width="500" alt="MyPage" src="https://github.com/user-attachments/assets/8557c1b2-4cd5-4649-9c15-7d5cef7c4b51" /> |

---

## 🎯 프로젝트 소개

**Thingz**는 빈티지 가구와 중고 물품을 사고파는 감성 기반 C2C 플랫폼입니다.  
단순한 거래를 넘어, 취향이 비슷한 사람들과 연결되는 커뮤니티를 지향합니다.

- **기간**: 2025.xx ~ 2026.xx
- **역할**: 풀스택 개발
- **팀 구성**: 개인 프로젝트

---

## ✨ 주요 기능

### 1. 피드 (Feed)
- 최신 등록 상품을 카드형으로 노출
- Featured 상품 하이라이트
- 오늘의 페이지 (인기 유저 추천)

### 2. 탐색 (Explore)
- 태그 기반 상품 탐색
- 인기 태그 노출

### 3. 상품 상세
- 상품명, 가격, 컨디션, 판매자 정보 표시
- 팔로우 버튼으로 판매자 구독 가능

### 4. 마이 페이지 (My Page)
- Published / Drafts / Following 탭 구성
- 게시글 등록, 수정, 삭제
- 팔로잉한 유저 목록 관리

---

## 🛠️ 기술 스택

### Frontend
- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**

### Backend
- **Next.js API Routes** / 별도 서버
- **REST API**

### 기타
- **GitHub** (버전 관리)

---

## 🚀 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

---

## 📁 프로젝트 구조

```
thingz/
├── app/
│   ├── feed/          # 피드 페이지
│   ├── explore/       # 탐색 페이지
│   ├── my-page/       # 마이 페이지
│   └── items/         # 상품 상세 페이지
├── components/        # 공통 컴포넌트
├── public/            # 정적 파일
└── styles/            # 글로벌 스타일
```

---

## 📌 페이지 구성

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 피드 | `/feed` | 최신 상품 피드 |
| 탐색 | `/explore` | 태그 기반 탐색 |
| 상품 상세 | `/items/:id` | 상품 정보 및 판매자 |
| 마이 페이지 | `/my-page` | 내 게시글 및 팔로잉 관리 |
| 회원가입 | `/register` | 신규 회원 등록 |
