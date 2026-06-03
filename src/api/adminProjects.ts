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

export type AdminProjectMemberRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export type AdminProjectMember = {
  userId: number;
  nickname: string;
  email: string;
  role: AdminProjectMemberRole;
};

export type AdminProjectDetail = Omit<AdminProject, 'ownerNickname'> & {
  ownerName: string;
  members: AdminProjectMember[];
};

export function getAdminProjects() {
  return apiFetch<ApiResponse<AdminProject[]>>('/api/admin/projects', {
    method: 'GET',
  });
}

export function getAdminProjectDetail(projectId: number) {
  return apiFetch<ApiResponse<AdminProjectDetail>>(`/api/admin/projects/${projectId}`, {
    method: 'GET',
  });
}
