# AI-FAQ
> 라이브 커머스 채팅 데이터를 AI로 분석하여 자동으로 상품 FAQ를 생성하는 시스템

<img width="500" height="905" alt="image" src="https://github.com/user-attachments/assets/e02f5f35-824f-45c1-8a9f-6f50cc06a17a" />
<img width="500" height="904" alt="image" src="https://github.com/user-attachments/assets/81542a3c-527a-4357-8a9f-81b5cfdbd60e" />

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#%EF%B8%8F-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
  
---

## 🎯 프로젝트 소개

### 배경

라이브 커머스 방송에서는 하루 평균 **3,000개 이상**의 고객 질문이 실시간으로 발생합니다.  
하지만 방송 종료 후 이 귀중한 Q&A 데이터가 활용되지 못하고 사라지는 문제가 있었습니다.

### 기존 문제점

| 문제 | 영향 |
|------|------|
| CS팀이 방송 다시보기를 보며 수동으로 FAQ 작성 | 상품당 2-3시간 소요 |
| 주관적인 선별로 중요한 질문 누락 가능성 | FAQ 품질 편차 발생 |
| 방송 종료 후 2-3일 뒤에야 FAQ 게시 | 고객 이탈 및 문의 증가 |

### 해결 방안

**AI 기반 자동 FAQ 생성 시스템**을 구축하여:
- ✅ 방송 종료 후 **30분 이내** FAQ 자동 생성
- ✅ 모든 질문을 객관적으로 분석하여 **중요도 기반 선별**

### 프로젝트 정보

- **기간**: 2024.11 - 2024.12 (4주)
- **역할**: 백엔드 개발 및 AI 파이프라인 설계
- **팀 구성**: 1인 프로젝트 (실무 경험 기반 재구성)

---

## ✨ 주요 기능

### 1. 🤖 AI 기반 FAQ 자동 생성
- OpenAI GPT-4 API를 활용한 자연어 처리
- 질문-답변 자동 페어링 알고리즘
- 중복 질문 자동 병합 및 요약

### 2. ⚙️ Spring Batch 배치 처리
- 방송별 상품 시간대 기반 데이터 수집
- Chunk 기반 대용량 데이터 처리 (10개 단위)
- 실패 복구 및 재시작 기능
- Skip/Retry 정책을 통한 안정성 확보

## 🛠️ 기술 스택

### Backend
- **Java** 17
- **Spring Boot** 3.2.0
- **Spring Batch** (Spring Boot 3.x)
- **MyBatis** 3.0.3
- **Gradle** 8.x
- **Spring WebFlux** (비동기 처리)
- **Spring AOP** (로깅, 트랜잭션)

### AI/ML
- **OpenAI** GPT-4 API
- **Prompt Engineering**
- **WebClient** (API 통신)

### Frontend
- **Thymeleaf**
- **Vue.js** (선택적)
- **JavaScript**

### Database
- **MySQL** 8.0
- **MyBatis** (Persistence Layer)

---

## 🏗 시스템 아키텍처

### 전체 구조

```
프로그램 (1-3시간)
  └─ 여러 개의 방송 (상품 그룹)
      └─ 여러 개의 상품
          └─ 대표 상품 1개
              └─ AI 생성 FAQ
```

### 운영 규칙
- ✅ 프로그램: 기간을 가지고 있음 (예: 12/1 ~ 12/31)
- ✅ 방송: 한 번에 1개만 노출 가능 (라이브 중)
- ✅ 방송 중 톡 발생 → 방송 종료 → AI FAQ 자동 생성
- ✅ FAQ는 대표 상품에 저장됨

---

## 📊 시스템 흐름도

```mermaid
graph TB
    subgraph "1️⃣ 사전 준비 (이미 완료)"
        P[프로그램 데이터<br/>가데이터 등록]
        G[상품 데이터<br/>가데이터 등록]
    end
    
    subgraph "2️⃣ 방송 시작"
        CLICK[프로그램 클릭]
        POPUP[상품 선택 팝업]
        SELECT[여러 상품 선택<br/>상품 그룹]
        MAIN[대표 상품 지정]
        START[방송 시작<br/>🔴 LIVE]
    end
    
    subgraph "3️⃣ 방송 진행"
        LIVE[라이브 방송 중<br/>단 1개만 가능]
        CHAT[고객 ↔ PD<br/>톡 진행]
        SAVE[톡 데이터 저장<br/>chat_message]
    end
    
    subgraph "4️⃣ 방송 종료"
        END[방송 종료 버튼]
        CLOSE[라이브 상태 OFF]
        TRIGGER[배치 스케줄 생성]
    end
    
    subgraph "5️⃣ AI 처리 (자동)"
        BATCH[Spring Batch 실행]
        READ[해당 방송 시간대<br/>톡 데이터 조회]
        PAIR[질문-답변 페어링]
        AI[OpenAI로 FAQ 요약]
        WRITE[대표 상품에<br/>FAQ 저장]
    end
    
    subgraph "6️⃣ 결과"
        WEB[상품 상세 페이지]
        FAQ_VIEW[AI 생성 FAQ 노출]
    end
    
    P --> CLICK
    G --> POPUP
    CLICK --> POPUP
    POPUP --> SELECT
    SELECT --> MAIN
    MAIN --> START
    START --> LIVE
    LIVE --> CHAT
    CHAT --> SAVE
    SAVE --> END
    END --> CLOSE
    CLOSE --> TRIGGER
    TRIGGER --> BATCH
    BATCH --> READ
    READ --> PAIR
    PAIR --> AI
    AI --> WRITE
    WRITE --> WEB
    WEB --> FAQ_VIEW
    
    style LIVE fill:#ff6b6b,color:#fff
    style AI fill:#ffd93d
    style FAQ_VIEW fill:#6bcf7f
```

---

### 데이터베이스 ERD

**핵심 테이블 구조**
```mermaid
erDiagram
    PROGRAM ||--o{ BROADCAST : "has"
    BROADCAST ||--o{ BROADCAST_GOODS : "displays"
    GOODS ||--o{ BROADCAST_GOODS : "featured_in"
    BROADCAST ||--o{ CHAT_MESSAGE : "contains"
    BROADCAST_GOODS ||--o{ FAQ_DTL : "generates"
    
    PROGRAM {
        bigint pgm_id PK "프로그램 ID"
        varchar pgm_name "프로그램명"
        date start_date "시작일"
        date end_date "종료일"
    }
    
    BROADCAST {
        bigint broadcast_id PK "방송 ID"
        bigint pgm_id FK "프로그램 ID"
        datetime start_time "방송 시작"
        datetime end_time "방송 종료"
        varchar status "상태 (LIVE/ENDED)"
    }
    
    GOODS {
        bigint goods_id PK "상품 ID"
        varchar goods_name "상품명"
    }
    
    BROADCAST_GOODS {
        bigint id PK "방송상품 ID"
        bigint broadcast_id FK "방송 ID"
        bigint goods_id FK "상품 ID"
        boolean is_main "대표 상품 여부"
    }
    
    CHAT_MESSAGE {
        bigint message_id PK "톡 ID"
        bigint broadcast_id FK "방송 ID"
        varchar user_type "사용자 유형"
        text content "톡 내용"
        datetime timestamp "시간"
    }
    
    FAQ_DTL {
        bigint faq_id PK "FAQ ID"
        bigint goods_id FK "대표 상품 ID"
        varchar question "질문 요약"
        text answer "답변 요약"
    }
```
## 💡 운영 시나리오 예시

```mermaid
sequenceDiagram
    participant 운영자
    participant 시스템
    participant 고객
    participant AI
    
    Note over 운영자,시스템: 📺 프로그램: "저녁 특가전" (20:00-23:00)
    
    운영자->>시스템: 프로그램 클릭
    시스템->>운영자: 상품 선택 팝업
    운영자->>시스템: 상품 5개 선택대표: 무선청소기
    운영자->>시스템: 방송 시작
    
    Note over 시스템: 🔴 LIVE (20:00-20:30)
    
    고객->>시스템: "배송 언제 오나요?"
    운영자->>시스템: "내일 출발합니다"
    고객->>시스템: "필터 교체는요?"
    운영자->>시스템: "6개월마다 교체"
    
    Note over 시스템: 톡 데이터 실시간 저장
    
    운영자->>시스템: 방송 종료 (20:30)
    
    Note over 시스템,AI: ⚙️ 배치 자동 실행
    
    시스템->>AI: 20:00-20:30 톡 전송
    AI->>시스템: FAQ 요약 완료
    시스템->>시스템: 무선청소기에 FAQ 저장
    
    Note over 고객: 🌐 상품 페이지
    
    고객->>시스템: 무선청소기 상세 보기
    시스템->>고객: AI 생성 FAQ 노출Q. 배송 기간?A. 주문 후 익일 출발
```

---

## 🎨 화면 흐름

```mermaid
graph LR
    subgraph "관리자 화면"
        A1[프로그램 목록]
        A2[상품 선택 팝업]
        A3[방송 현황🔴 LIVE]
    end
    
    subgraph "고객 화면"
        C1[라이브 방송 보기]
        C2[톡 참여]
        C3[상품 상세 페이지]
        C4[FAQ 확인]
    end
    
    A1 -->|클릭| A2
    A2 -->|상품 선택| A3
    A3 -.->|방송 중| C1
    C1 --> C2
    C2 -.->|방송 종료 후| C3
    C3 --> C4
    
    style A3 fill:#ff6b6b,color:#fff
    style C4 fill:#6bcf7f
```

---
