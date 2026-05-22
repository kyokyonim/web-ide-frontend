# EFIDE Studio 프로토타입 — 팀 공유 가이드

디자인 시안 3종(Minimal / SaaS / Dark)을 팀원에게 보여주는 방법입니다.

## 방법 1: Vercel 배포 (추천, 가장 쉬움)

1. GitHub에 저장소를 push합니다.
2. [vercel.com](https://vercel.com) 로그인 → **Add New Project** → 해당 repo 선택
3. Framework: **Vite**, Build: `npm run build`, Output: `dist`
4. Deploy 후 URL 공유 (예: `https://efide-studio.vercel.app`)

로컬에서 Vercel CLI로 바로 배포:

```bash
npm i -g vercel
cd /path/to/efide-studio
vercel
```

## 방법 2: Netlify 배포

1. GitHub repo 연결 또는 `dist` 폴더 드래그 앤 드롭
2. Build command: `npm run build`, Publish directory: `dist`
3. `netlify.toml`이 SPA 라우팅을 처리합니다.

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## 방법 3: GitHub Pages

```bash
# vite.config.ts에 base: '/repo-name/' 설정 후
npm run build
npx gh-pages -d dist
```

팀원에게 `https://<username>.github.io/<repo-name>/` 링크를 공유합니다.

## 방법 4: GitHub 저장소만 공유 (개발자용)

```bash
git remote add origin git@github.com:<org>/efide-studio.git
git push -u origin main
```

팀원이 클론 후 실행:

```bash
git clone <repo-url>
cd efide-studio
npm install
npm run dev
```

→ `http://localhost:5173` 에서 확인

## 방법 5: 빌드 결과물 ZIP 공유 (비개발자)

```bash
npm run build
cd dist && zip -r ../efide-studio-preview.zip .
```

ZIP을 공유받은 사람은 간단한 정적 서버로 열 수 있습니다:

```bash
npx serve .
```

## 공유 시 안내 문구 예시

> **EFIDE Studio UI 시안 (정적 프로토타입)**  
> - 홈: `/`  
> - Minimal: `/design/minimal/login`  
> - SaaS: `/design/saas/login`  
> - Dark: `/design/dark/login`  
> - 화면 하단 바에서 스타일·페이지 전환 가능  
> - 실제 로그인/API는 동작하지 않습니다 (목업 UI만)

## 주의사항

- `npm run dev`는 본인 PC에서만 접근 가능합니다. 팀 공유에는 **배포 URL** 또는 **GitHub + README**를 사용하세요.
- 비공개 공유가 필요하면 Vercel/Netlify **비밀 링크** 또는 GitHub **Private repo**를 사용하세요.
