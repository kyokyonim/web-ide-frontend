import { apiFetch } from './client';
import type { ApiResponse } from './types';

export type ProjectLanguage = 'JAVA' | 'JAVASCRIPT' | 'PYTHON';
export type ProjectRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export type BackendProject = {
  id: number;
  projectName?: string;
  name?: string;
  language?: ProjectLanguage;
  status?: string;
  ownerId?: number;
  ownerNickname?: string;
  role?: string;
  myRole?: string;
  memberCount?: number;
  participants?: number;
  createdAt?: string;
  updatedAt?: string;
};


export type ProjectInviteResponse = {
  inviteId: number;
  projectId: number;
  projectName: string;
  inviteeEmail: string;
  role: Exclude<ProjectRole, 'OWNER'>;
  status: string;
  inviteUrl: string;
  expiresAt: string;
  createdAt: string;
};

export type BackendProjectMember = {
  memberId: number;
  projectId: number;
  userId: number;
  email: string;
  nickname: string;
  profileColor: string;
  role: ProjectRole;
};

function requesterQuery(paramName = 'requesterId') {
  const userId = localStorage.getItem('userId');
  return userId ? `?${paramName}=${userId}` : '';
}

export async function getMyProjects() {
  const userId = localStorage.getItem('userId');
  const query = userId ? `?userId=${userId}` : '';

  return apiFetch<ApiResponse<BackendProject[]>>(`/api/projects${query}`, {
    method: 'GET',
  });
}

export async function getProject(projectId: string) {
  return apiFetch<ApiResponse<BackendProject>>(
    `/api/projects/${projectId}${requesterQuery()}`,
    {
      method: 'GET',
    }
  );
}

export async function createProject(projectName: string, language: ProjectLanguage) {
  const ownerId = Number(localStorage.getItem('userId'));

  return apiFetch<ApiResponse<BackendProject>>('/api/projects', {
    method: 'POST',
    body: JSON.stringify({
      ownerId,
      projectName,
      language,
    }),
  });
}

export async function updateProject(
  projectId: string,
  payload: { projectName?: string; language?: ProjectLanguage }
) {
  const requesterId = Number(localStorage.getItem('userId'));

  return apiFetch<ApiResponse<BackendProject>>(`/api/projects/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      requesterId,
      ...payload,
    }),
  });
}

export async function deleteProject(projectId: string) {
  return apiFetch<ApiResponse<void>>(
    `/api/projects/${projectId}${requesterQuery()}`,
    {
      method: 'DELETE',
    }
  );
}

export async function getProjectMembers(projectId: string) {
  return apiFetch<ApiResponse<BackendProjectMember[]>>(
    `/api/projects/${projectId}/members${requesterQuery()}`,
    {
      method: 'GET',
    }
  );
}

export async function updateProjectMemberRole(
  projectId: string,
  memberId: number,
  role: Exclude<ProjectRole, 'OWNER'>
) {
  const requesterId = Number(localStorage.getItem('userId'));

  return apiFetch<ApiResponse<BackendProjectMember>>(
    `/api/projects/${projectId}/members/${memberId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        requesterId,
        role,
      }),
    }
  );
}

export async function sendProjectInvite(
  projectId: string,
  email: string,
  role: Exclude<ProjectRole, 'OWNER'>
) {
  return apiFetch<ApiResponse<ProjectInviteResponse>>(`/api/projects/${projectId}/invites`, {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  });
}

export async function removeProjectMember(projectId: string, memberId: number) {
  return apiFetch<ApiResponse<void>>(
    `/api/projects/${projectId}/members/${memberId}${requesterQuery()}`,
    {
      method: 'DELETE',
    }
  );
}
