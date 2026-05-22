# EFIDE Studio — UI Prototype

> **팀 리뷰:** [docs/TEAM_NOTICE.md](docs/TEAM_NOTICE.md) · 배포 URL은 Vercel 연동 후 README 상단에 추가

Web IDE 화면설계서 기반 **정적 UI 프로토타입** (Mock 데이터, 백엔드 미연결)

## 디자인 시안 (3종)

| 스타일 | 경로 | 설명 |
|--------|------|------|
| Minimal Developer | `/design/minimal` | VS Code · GitHub 느낌 |
| Modern SaaS | `/design/saas` | 카드형 대시보드 |
| Dark IDE | `/design/dark` | 다크모드 Web IDE |

홈(`/`)에서 시안을 선택하거나, 하단 **DesignNav**로 스타일·화면을 전환할 수 있습니다.

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

백엔드 연동 시 `data/mock.ts`를 API 레이어로 교체하고, 페이지 컴포넌트는 그대로 재사용할 수 있도록 구성했습니다.

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
