import { apiFetch } from './client';
import type { ApiResponse } from './types';

export type AdminDashboardStats = {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  activeConnections: number;
  totalProjects: number;
};

export function getAdminDashboardStats() {
  return apiFetch<ApiResponse<AdminDashboardStats>>('/api/admin/dashboard/stats', {
    method: 'GET',
  });
}
