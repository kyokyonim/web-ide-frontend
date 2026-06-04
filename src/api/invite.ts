import { apiFetch } from './client';
import type { ApiResponse } from './types';

export type InvitePreview = {
  projectId: number;
  projectName: string;
  inviteeEmail: string;
  role: 'EDITOR' | 'VIEWER';
  status: string;
  expiresAt: string;
  expired: boolean;
};

export type InviteAcceptResult = {
  projectId: number;
  projectName: string;
  member: {
    memberId: number;
    projectId: number;
    userId: number;
    email: string;
    nickname: string;
    profileColor: string;
    role: string;
  };
};

export function getInvitePreview(token: string) {
  return apiFetch<ApiResponse<InvitePreview>>(`/api/invites/${token}`, {
    auth: false,
  });
}

export function acceptInvite(token: string) {
  return apiFetch<ApiResponse<InviteAcceptResult>>(`/api/invites/${token}/accept`, {
    method: 'POST',
  });
}

export function sendProjectInvite(
  projectId: string,
  email: string,
  role: 'EDITOR' | 'VIEWER'
) {
  return apiFetch<ApiResponse<unknown>>(`/api/projects/${projectId}/invites`, {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  });
}
