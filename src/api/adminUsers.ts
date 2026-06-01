import { apiFetch } from './client';
import type { ApiResponse } from './types';

export type AdminUserCategory = 'ALL' | 'NEW';
export type AdminUserStatusFilter = 'ALL' | 'ACTIVE' | 'BANNED';
export type AdminUserStatus = 'ACTIVE' | 'BANNED' | 'DELETED';

export type AdminUser = {
  userId: number;
  nickname: string;
  email: string;
  status: AdminUserStatus;
  joinedAt: string;
};

export type AdminUserListResponse = {
  users: AdminUser[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
};

export type AdminUserStatusResponse = {
  userId: number;
  nickname: string;
  status: AdminUserStatus;
  message: string;
};

export type GetAdminUsersParams = {
  category?: AdminUserCategory;
  status?: AdminUserStatusFilter;
  keyword?: string;
  page?: number;
  size?: number;
};

export function getAdminUsers(params: GetAdminUsersParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.category) searchParams.set('category', params.category);
  if (params.status) searchParams.set('status', params.status);
  if (params.keyword?.trim()) searchParams.set('keyword', params.keyword.trim());
  if (params.page != null) searchParams.set('page', String(params.page));
  if (params.size != null) searchParams.set('size', String(params.size));

  const query = searchParams.toString();

  return apiFetch<ApiResponse<AdminUserListResponse>>(
    `/api/admin/users${query ? `?${query}` : ''}`,
    { method: 'GET' },
  );
}

export function suspendAdminUser(userId: number) {
  return apiFetch<ApiResponse<AdminUserStatusResponse>>(
    `/api/admin/users/${userId}/suspend`,
    { method: 'PATCH' },
  );
}

export function activateAdminUser(userId: number) {
  return apiFetch<ApiResponse<AdminUserStatusResponse>>(
    `/api/admin/users/${userId}/activate`,
    { method: 'PATCH' },
  );
}
