import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { AuthLayout } from '../components/layout/AuthLayout';
import { AppShell, AdminShell } from '../components/layout/AppShell';
import { LoginPage } from '../pages/auth/LoginPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { ProjectListPage } from '../pages/projects/ProjectListPage';
import { ProjectSettingsPage } from '../pages/projects/ProjectSettingsPage';
import { IDEPage } from '../pages/ide/IDEPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { SecurityManagementPage } from '../pages/admin/SecurityManagementPage';
import { AdminProjectsPage } from '../pages/admin/AdminProjectsPage';
import type { DesignStyle } from '../types';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

function DesignLayout() {
  const { style } = useParams<{ style: string }>();

  const validStyle: DesignStyle =
    style === 'dark' || style === 'saas' || style === 'minimal'
      ? style
      : 'minimal';

  return (
    <ThemeProvider style={validStyle}>
      <div className="h-full">
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          <Route element={<AppShell />}>
            <Route path="projects" element={<ProjectListPage />} />
            <Route path="projects/settings" element={<Navigate to="../projects" replace />} />
            <Route path="projects/:projectId/settings" element={<ProjectSettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="ide" element={<IDEPage />} />
          <Route path="ide/:projectId" element={<IDEPage />} />

          <Route element={<AdminRouteGuard />}>
            <Route element={<AdminShell />}>
              <Route path="admin" element={<AdminDashboardPage />} />
              <Route path="admin/users" element={<UserManagementPage />} />
              <Route path="admin/projects" element={<AdminProjectsPage />} />
              <Route path="admin/security" element={<SecurityManagementPage />} />
            </Route>
          </Route>

          <Route
            index
            element={<Navigate to={`/design/${validStyle}/login`} replace />}
          />

          <Route
            path="*"
            element={<Navigate to={`/design/${validStyle}/login`} replace />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

function AdminRouteGuard() {
  const { basePath } = useTheme();
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to={`${basePath}/login`} replace />;
  }

  if (role !== 'ADMIN') {
    return <Navigate to={`${basePath}/projects`} replace />;
  }

  return <Outlet />;
}

export function DesignRoutes() {
  return (
    <Routes>
      <Route path=":style/*" element={<DesignLayout />} />
    </Routes>
  );
}
