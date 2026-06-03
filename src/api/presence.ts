import { apiFetch } from './client';

export function updatePresence(projectId: string) {
  return apiFetch(`/api/projects/${projectId}/presence`, {
    method: 'PUT',
  });
}

export function disconnectPresence(projectId: string, keepalive = false) {
  return apiFetch(`/api/projects/${projectId}/presence`, {
    method: 'DELETE',
    keepalive,
  });
}
