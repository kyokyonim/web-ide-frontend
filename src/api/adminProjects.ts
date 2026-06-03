import { apiFetch } from './client';
import type { ApiResponse } from './types';

export type AdminProjectStatus = 'ACTIVE' | 'DELETED';
export type AdminProjectLanguage = 'JAVA' | 'JAVASCRIPT' | 'PYTHON';

export type AdminProject = {
  id: number;
  projectName: string;
  language: AdminProjectLanguage;
  status: AdminProjectStatus;
  ownerId: number;
  ownerNickname: string;
  ownerEmail: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

export function getAdminProjects() {
  return apiFetch<ApiResponse<AdminProject[]>>('/api/admin/projects', {
    method: 'GET',
  });
}
