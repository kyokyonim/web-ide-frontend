import { apiFetch } from './client';
import type { ApiResponse } from './types';

export type BackendComment = {
  commentId: number;
  projectId: number;
  fileId: number;
  userId: number;
  nickname: string;
  profileColor: string;
  lineNumber: number | null;
  content: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
};

export function getFileComments(
  projectId: string,
  fileId: string,
  resolved?: boolean,
) {
  const params = new URLSearchParams();
  if (resolved != null) {
    params.set('resolved', String(resolved));
  }
  const query = params.toString() ? `?${params.toString()}` : '';

  return apiFetch<ApiResponse<BackendComment[]>>(
    `/api/projects/${projectId}/files/${fileId}/comments${query}`,
    { method: 'GET' },
  );
}

export function createFileComment(
  projectId: string,
  fileId: string,
  payload: { lineNumber?: number | null; content: string },
) {
  return apiFetch<ApiResponse<BackendComment>>(
    `/api/projects/${projectId}/files/${fileId}/comments`,
    {
      method: 'POST',
      body: JSON.stringify({
        lineNumber: payload.lineNumber ?? 1,
        content: payload.content,
      }),
    },
  );
}
