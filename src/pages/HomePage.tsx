import { Link } from 'react-router-dom';

const styles = [
  {
    id: 'minimal',
    name: 'Minimal Developer',
    desc: 'VS Code · GitHub 스타일의 깔끔한 개발자 도구 UI',
    preview: 'bg-white border-2 border-slate-200',
  },
  {
    id: 'saas',
    name: 'Modern SaaS',
    desc: '카드형 레이아웃, 둥근 모서리, 발표용 대시보드 스타일',
    preview: 'bg-slate-50 border-2 border-indigo-100 shadow-lg rounded-2xl',
  },
  {
    id: 'dark',
    name: 'Dark IDE',
    desc: '다크모드 Web IDE — 코드 에디터 중심 UI',
    preview: 'bg-[#1e1e1e] border-2 border-[#3e3e42] text-gray-300',
  },
];

export function HomePage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white">EFIDE Studio</h1>
        <p className="mt-3 text-slate-300">Web IDE UI 디자인 시안 — 3가지 스타일</p>
      </div>
      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-3">
        {styles.map((s) => (
          <Link
            key={s.id}
            to={`/design/${s.id}/login`}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
          >
            <div className={`mb-4 h-24 ${s.preview}`} />
            <h2 className="text-lg font-semibold text-white group-hover:text-indigo-300">
              {s.name}
            </h2>
            <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
            <span className="mt-4 inline-block text-sm text-indigo-400">
              시안 보기 →
            </span>
          </Link>
        ))}
      </div>
      <p className="mt-10 text-xs text-slate-500">
        Mock 데이터 기반 정적 UI 프로토타입 · 백엔드 미연결
      </p>
    </div>
  );
}
