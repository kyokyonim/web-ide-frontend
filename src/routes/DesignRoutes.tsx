import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
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
            <Route
              path="forgot-password"
              element={<Navigate to={`/design/${validStyle}/reset-password`} replace />}
            />
          </Route>

          <Route element={<AppShell />}>
            <Route path="projects" element={<ProjectListPage />} />
            <Route path="projects/settings" element={<ProjectSettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="ide" element={<IDEPage />} />
          <Route path="ide/:projectId" element={<IDEPage />} />

          <Route element={<AdminShell />}>
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="admin/users" element={<UserManagementPage />} />
            <Route path="admin/projects" element={<AdminProjectsPage />} />
            <Route path="admin/security" element={<SecurityManagementPage />} />
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

export function DesignRoutes() {
  return (
    <Routes>
      <Route path=":style/*" element={<DesignLayout />} />
    </Routes>
  );
}
