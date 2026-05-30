# EFIDE Studio — UI Prototype

> **팀 리뷰:** [docs/TEAM_NOTICE.md](docs/TEAM_NOTICE.md) · 배포 URL은 Vercel 연동 후 README 상단에 추가

Web IDE 화면설계서 기반 프론트엔드입니다. 기본 UI는 **Minimal Developer**를 사용하고, 상단 해/달 스위치로 라이트/다크 모드를 전환합니다.

## 디자인 시안 (3종)

| 스타일 | 경로 | 설명 |
|--------|------|------|
| Minimal Developer | `/design/minimal` | VS Code · GitHub 느낌 |
| Modern SaaS | `/design/saas` | 카드형 대시보드 |
| Dark IDE | `/design/dark` | 다크모드 Web IDE |

루트(`/`)는 `/design/minimal/login`으로 이동합니다.

## 포함 화면

- 로그인 / 회원가입
- 프로젝트 목록 / 새 프로젝트 모달 / 프로젝트 설정
- IDE 메인 (파일 트리, 코드 에디터, 채팅·댓글·참여자 패널)
- 프로필 설정
- 관리자 대시보드 / 사용자 관리 / 프로젝트 관리 / 보안 관리

## 실행

```bash
npm install
npm run dev
```

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

### 백엔드 API 연동 현황 (`dev` 브랜치)

| 화면 | 연동 |
|------|------|
| 로그인 | ✅ |
| 프로젝트 목록·생성 | ✅ |
| IDE 파일 트리·열기·저장·생성 | ✅ |
| IDE 실시간 채팅 | ✅ (REST 기록 + WebSocket) |
| IDE 댓글 | ⏳ mock (추후) |
| Presence 하트비트 | ✅ |

## 기술 스택

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- React Router v7

## 구조

```
src/
  components/   # UI, layout, IDE 공통 컴포넌트
  context/      # ThemeContext (스타일별 토큰)
  data/         # mock.ts
  pages/        # 화면별 페이지
  routes/       # DesignRoutes
  themes/       # minimal / saas / dark 토큰
```

백엔드 연동은 `src/api/client.ts` 공통 fetch를 사용합니다.

- `src/api/auth.ts`, `projects.ts` — 로그인·프로젝트
- `src/api/files.ts` — 파일 트리·내용·저장
- `src/api/chat.ts`, `src/lib/chatSocket.ts` — 채팅
- `src/api/presence.ts` — 접속 상태

## 팀 공유 (배포)

**가장 쉬운 방법:** GitHub에 push → [Vercel](https://vercel.com)에서 Import → URL 공유

자세한 방법(Vercel / Netlify / GitHub Pages / ZIP)은 [docs/SHARING.md](docs/SHARING.md)를 참고하세요.

```bash
npm run build   # dist/ 생성
npm run preview # 로컬에서 빌드 결과 미리보기
```

## Figma 스펙

레이아웃·색상 값은 `src/styles/figma-spec.ts`에 정리되어 있습니다.  
실제 Figma 파일 URL을 주시면 MCP로 더 정밀한 1:1 동기화도 가능합니다.
