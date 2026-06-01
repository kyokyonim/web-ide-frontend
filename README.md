# Web IDE Frontend

Web IDE 프로젝트의 프론트엔드 레포지토리입니다.

React + TypeScript + Vite 기반으로 구현되었으며, 로그인/프로젝트/IDE/파일/채팅/Presence 화면을 제공합니다.  
백엔드 Spring Boot API와 연동하여 프로젝트 생성, 파일 트리 조회, 파일 열기/저장, 채팅 송수신, 접속 상태 갱신 기능을 수행합니다.

---

## 1. 기술 스택

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- STOMP WebSocket (`@stomp/stompjs`)
- REST API 연동
- JWT 기반 인증 연동

---

## 2. 실행 방법

### 2-1. 프로젝트 클론

```bash
git clone https://github.com/kyokyonim/web-ide-frontend.git
cd web-ide-frontend
백엔드(`team5-backend` `dev` 브랜치)도 같이 실행할 때는 Spring 서버를 `8080` 포트로 켜면 됩니다.

```bash
# PostgreSQL (Docker) 실행 후
cd ../team5-backend
./gradlew bootRun
```

`.env.local` 예시 (`.env.example` 참고):

```bash
VITE_API_BASE_URL=http://localhost:8080
```

개발 서버에서는 `/api/*`, `/ws` 요청이 `http://localhost:8080`으로 프록시됩니다.

### 3. 백엔드 API 연동 현황 (`dev` 브랜치)

| 화면 | 연동 |
|------|------|
| 로그인 | ✅ |
| 프로젝트 목록·생성 | ✅ |
| IDE 파일 트리·열기·저장·생성 | ✅ |
| IDE 실시간 채팅 | ✅ (REST 기록 + WebSocket) |
| IDE 댓글 | ⏳ mock (추후) |
| Presence 하트비트 | ✅ |

## 4. 기술 스택

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- React Router v7

2-2. dev 브랜치 이동
git checkout dev
git pull origin dev
2-3. 패키지 설치
npm install
2-4. 환경변수 설정

프로젝트 루트에 .env.local 파일을 생성합니다.

VITE_API_BASE_URL=http://localhost:8080

백엔드가 로컬에서 8080 포트로 실행되고 있어야 합니다.

2-5. 프론트 실행
npm run dev

실행 후 아래 주소로 접속합니다.

http://localhost:5173/design/minimal/login
3. 백엔드 실행 조건

프론트 기능 테스트를 위해 백엔드 서버, PostgreSQL, Redis가 실행되어 있어야 합니다.

백엔드 실행
cd ~/Desktop/ide-project/team5-backend
git checkout dev
./gradlew bootRun

정상 실행 기준:

Tomcat started on port 8080
Started WebIdeApplication
Docker DB/Redis 실행
docker start efide-postgres efide-redis

실행 여부 확인:

docker ps
4. 주요 접속 URL
로그인
http://localhost:5173/design/minimal/login
프로젝트 목록
http://localhost:5173/design/minimal/projects
IDE 화면
http://localhost:5173/design/minimal/ide/{projectId}

예시:

http://localhost:5173/design/minimal/ide/1

### 5. 폴더 구조
src
├── api
│   ├── auth.ts
│   ├── chat.ts
│   ├── client.ts
│   ├── files.ts
│   ├── presence.ts
│   ├── projects.ts
│   └── types.ts
│
├── components
│   ├── ide
│   │   ├── CodeEditor.tsx
│   │   ├── FileTree.tsx
│   │   └── RightPanel.tsx
│   │
│   ├── layout
│   │   ├── AppShell.tsx
│   │   ├── AuthLayout.tsx
│   │   └── TopBar.tsx
│   │
│   └── ui
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Modal.tsx
│
├── context
│   └── ThemeContext.tsx
│
├── data
│   └── mock.ts
│
├── lib
│   ├── chatSocket.ts
│   └── fileTreeMapper.ts
│
├── pages
│   ├── admin
│   ├── auth
│   ├── ide
│   ├── profile
│   └── projects
│
├── routes
│   └── DesignRoutes.tsx
│
├── styles
│   └── figma-spec.ts
│
├── types
│   └── index.ts
│
├── App.tsx
└── main.tsx
### **6. 주요 폴더 설명
src/api

백엔드 API 호출 함수들을 모아둔 폴더입니다.

각 기능별 API 파일은 직접 fetch()를 사용하지 않고, 공통 함수인 apiFetch()를 사용합니다.

api/client.ts   → 공통 API 요청 함수
api/auth.ts     → 로그인 API
api/projects.ts → 프로젝트 목록/생성 API
api/files.ts    → 파일 트리/파일 열기/저장/생성 API
api/chat.ts     → 채팅 기록 조회 API
api/presence.ts → 접속 상태 heartbeat API
src/api/client.ts

백엔드 통신 공통 설정을 담당합니다.

역할:

1. 백엔드 기본 주소 조합
2. localStorage의 accessToken 조회
3. Authorization: Bearer 토큰 자동 첨부
4. JSON 응답 파싱
5. API 실패 시 에러 처리

예시:

apiFetch('/api/projects/1/files/tree', {
  method: 'GET',
});

실제 요청:

GET http://localhost:8080/api/projects/1/files/tree
Authorization: Bearer {accessToken}
src/pages

라우트 단위 화면 컴포넌트를 관리합니다.

pages/auth      → 로그인, 회원가입 화면
pages/projects  → 프로젝트 목록, 프로젝트 설정 화면
pages/ide       → IDE 메인 화면
pages/admin     → 관리자 화면
pages/profile   → 프로필 화면
src/components

재사용 가능한 UI 컴포넌트를 관리합니다.

components/ui      → Button, Input, Modal, Badge 등 공통 UI
components/layout  → AppShell, AuthLayout, TopBar 등 레이아웃
components/ide     → FileTree, CodeEditor, RightPanel 등 IDE 전용 컴포넌트
src/lib

화면과 API 사이에서 필요한 보조 로직을 관리합니다.

lib/chatSocket.ts      → STOMP WebSocket 연결 및 채팅 송수신
lib/fileTreeMapper.ts  → 백엔드 파일 트리 응답을 프론트 UI 구조로 변환
src/context

전역 상태나 테마 관련 Context를 관리합니다.

context/ThemeContext.tsx

현재 디자인 스타일별 경로와 테마 정보를 제공합니다.

/design/minimal
/design/dark
/design/saas
### 7. 프론트-백엔드 연동 구조

프론트와 백엔드 연동은 아래 흐름으로 구성됩니다.

화면 Component
    ↓
기능별 API 파일
    ↓
api/client.ts
    ↓
Spring Boot API

예시: 파일 트리 조회

IDEPage.tsx
    ↓
getFileTree(projectId)
    ↓
api/files.ts
    ↓
apiFetch('/api/projects/{projectId}/files/tree')
    ↓
GET /api/projects/{projectId}/files/tree
### 8. 인증 처리 방식

로그인 성공 시 백엔드에서 accessToken, refreshToken, userId, nickname, profileColor를 응답받습니다.

프론트는 이 값을 localStorage에 저장합니다.

accessToken
refreshToken
userId
nickname
profileColor

이후 API 요청 시 api/client.ts에서 accessToken을 자동으로 꺼내 Authorization 헤더에 첨부합니다.

Authorization: Bearer {accessToken}

로그인 요청은 아직 토큰이 없으므로 auth: false 옵션을 사용합니다.

apiFetch('/api/auth/login', {
  method: 'POST',
  auth: false,
  body: JSON.stringify({
    email,
    password,
  }),
});
### 9. 주요 기능
로그인
이메일/비밀번호 로그인
로그인 성공 시 토큰 저장
이후 API 요청에 JWT 자동 첨부
프로젝트
프로젝트 목록 조회
프로젝트 생성
프로젝트 카드 클릭 시 IDE 화면 이동
IDE
프로젝트별 IDE 화면 진입
파일 트리 조회
파일/폴더 생성
파일 열기
코드 수정
파일 저장
채팅
채팅 기록 조회
STOMP WebSocket 기반 메시지 전송
프로젝트별 채팅방 구분
Presence
IDE 화면 진입 시 접속 상태 갱신
30초마다 heartbeat 전송
백엔드는 최근 heartbeat 기준으로 현재 접속자 판단
댓글
현재 일부 mock 데이터 유지
추후 백엔드 Comment API와 연동 예정
### 10. 테스트 시나리오

로컬 실행 후 아래 순서로 확인합니다.

1. 로그인 화면 접속
2. 로그인
3. 프로젝트 목록 조회
4. 프로젝트 생성
5. 프로젝트 카드 클릭
6. IDE 화면 진입
7. 파일/폴더 생성
8. 파일 클릭 후 열기
9. 코드 수정
10. 저장
11. 오른쪽 채팅 탭에서 메시지 전송
12. Presence heartbeat 동작 확인
11. 빌드 확인

TypeScript 검사와 Vite 프로덕션 빌드를 확인합니다.

npm run build

정상 빌드 시 dist/ 폴더가 생성됩니다.
