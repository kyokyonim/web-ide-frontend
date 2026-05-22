import { Outlet } from 'react-router-dom';
import { authFeatures } from '../../data/mock';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../ui/Logo';
import { figma } from '../../styles/figma-spec';

export function AuthLayout() {
  const { theme, style } = useTheme();
  const isSaas = style === 'saas';

  return (
    <div className={`flex min-h-full ${theme.pageBg}`}>
      <aside
        className={`hidden ${figma.layout.authSplit} flex-col justify-center border-r px-12 py-16 lg:flex ${theme.border} ${theme.surfaceMuted}`}
      >
        <Logo />
        <h1 className={`mt-10 ${figma.typography.display} ${theme.text}`}>
          Code anywhere,
          <br />
          build anything.
        </h1>
        <ul className="mt-12 space-y-8">
          {authFeatures.map((f, i) => (
            <li key={f.title} className="flex gap-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center text-sm font-bold ${theme.primary} ${theme.radius}`}
              >
                {i + 1}
              </span>
              <div>
                <div className={`${figma.typography.h3} ${theme.text}`}>{f.title}</div>
                <p className={`mt-1.5 ${figma.typography.body} ${theme.textMuted}`}>{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex flex-1 items-center justify-center px-6 py-12 md:px-16">
        <div className={`w-full ${figma.layout.authForm}`}>
          <div
            className={
              isSaas
                ? `${theme.modal} ${theme.shadowLg} p-8 md:p-10`
                : 'p-2 md:p-4'
            }
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
