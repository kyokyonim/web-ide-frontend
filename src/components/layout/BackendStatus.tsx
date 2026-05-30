import { Server } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getBackendHello } from '../../lib/api';
import { useTheme } from '../../context/ThemeContext';

type BackendState = 'checking' | 'online' | 'offline';

export function BackendStatus() {
  const { theme } = useTheme();
  const [state, setState] = useState<BackendState>('checking');

  useEffect(() => {
    let active = true;

    getBackendHello()
      .then(() => {
        if (active) setState('online');
      })
      .catch(() => {
        if (active) setState('offline');
      });

    return () => {
      active = false;
    };
  }, []);

  const dotClass =
    state === 'online' ? 'bg-emerald-500' : state === 'offline' ? 'bg-red-500' : 'bg-amber-400';
  const title =
    state === 'online'
      ? 'Backend connected'
      : state === 'offline'
        ? 'Backend offline'
        : 'Checking backend';

  return (
    <div
      className={`hidden h-9 items-center gap-2 rounded-md border px-2.5 text-xs font-medium sm:flex ${theme.border} ${theme.surfaceMuted} ${theme.textMuted}`}
      title={title}
      aria-label={title}
    >
      <Server size={15} />
      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
      <span>API</span>
    </div>
  );
}
