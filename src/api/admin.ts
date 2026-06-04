import { apiFetch } from './client';
import type { ApiResponse } from './types';

export type AdminDashboardStats = {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  activeConnections: number;
  totalProjects: number;
};

export type AdminUser = {
  id: number;
  email: string;
  nickname: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'DELETED' | 'BANNED';
  provider: 'LOCAL' | 'GOOGLE';
  createdAt: string;
  lastLoginAt: string | null;
};

export type AdminProject = {
  id: number;
  projectName: string;
  language: 'JAVA' | 'JAVASCRIPT' | 'PYTHON';
  status: 'ACTIVE' | 'DELETED';
  ownerId: number;
  ownerNickname: string;
  ownerEmail: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminPresence = {
  presenceId: number;
  projectId: number;
  projectName: string;
  userId: number;
  nickname: string;
  email: string;
  profileColor: string;
  lastSeenAt: string;
};

export function getAdminDashboardStats() {
  return apiFetch<ApiResponse<AdminDashboardStats>>('/api/admin/dashboard/stats');
}

export function getAdminUsers() {
  return apiFetch<ApiResponse<AdminUser[]>>('/api/admin/users');
}

export function getAdminProjects() {
  return apiFetch<ApiResponse<AdminProject[]>>('/api/admin/projects');
}

export function getAdminActivePresence() {
  return apiFetch<ApiResponse<AdminPresence[]>>('/api/admin/presence');
}
