import { apiFetch } from './client';
import type { ApiResponse } from './types';

export type PresenceUser = {
  presenceId: number;
  projectId: number;
  userId: number;
  nickname: string;
  profileColor: string;
  lastSeenAt: string;
};

export type PresenceConfig = {
  heartbeatIntervalMs: number;
  activeThresholdSeconds: number;
};

export function updatePresence(projectId: string) {
  return apiFetch<ApiResponse<PresenceUser>>(`/api/projects/${projectId}/presence`, {
    method: 'PUT',
  });
}

export function disconnectPresence(projectId: string, keepalive = false) {
  return apiFetch(`/api/projects/${projectId}/presence`, {
    method: 'DELETE',
    keepalive,
  });
}

export function getActivePresence(projectId: string) {
  return apiFetch<ApiResponse<PresenceUser[]>>(`/api/projects/${projectId}/presence`);
}

export function getPresenceConfig(projectId: string) {
  return apiFetch<ApiResponse<PresenceConfig>>(
    `/api/projects/${projectId}/presence/config`,
  );
}
