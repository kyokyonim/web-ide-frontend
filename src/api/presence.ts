import { apiFetch } from './client';

export function updatePresence(projectId: string) {
  return apiFetch(`/api/projects/${projectId}/presence`, {
    method: 'PUT',
  });
}