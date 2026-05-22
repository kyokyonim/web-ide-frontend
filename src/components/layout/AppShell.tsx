import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { AdminSidebar } from './AdminSidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  children?: React.ReactNode;
  showBack?: boolean;
}

export function AppShell({ children, showBack }: AppShellProps) {
  const { theme } = useTheme();

  return (
    <div className={`flex h-full flex-col ${theme.pageBg}`}>
      <TopBar showBack={showBack} />
      <div className="flex-1 overflow-auto">{children ?? <Outlet />}</div>
    </div>
  );
}

export function AdminShell() {
  const { theme } = useTheme();

  return (
    <div className={`flex h-full flex-col ${theme.pageBg}`}>
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className={`flex-1 overflow-auto p-6 ${theme.pageBg}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
