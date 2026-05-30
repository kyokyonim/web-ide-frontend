import { apiFetch } from './client';
import type { ApiResponse } from './types';

export type BackendFileType = 'FILE' | 'FOLDER';

export type BackendFileTreeNode = {
  id: number;
  name: string;
  type: BackendFileType;
  path: string;
  parentId: number | null;
  language?: string | null;
  version?: number | null;
  children: BackendFileTreeNode[];
};

export type BackendFileDetail = {
  id: number;
  name: string;
  type: BackendFileType;
  path: string;
  parentId: number | null;
  content: string | null;
  language: string | null;
  version: number;
};

export async function getFileTree(projectId: string) {
  return apiFetch<ApiResponse<BackendFileTreeNode[]>>(
    `/api/projects/${projectId}/files/tree`,
    { method: 'GET' },
  );
}

export async function getFileDetail(projectId: string, fileId: string) {
  return apiFetch<ApiResponse<BackendFileDetail>>(
    `/api/projects/${projectId}/files/${fileId}`,
    { method: 'GET' },
  );
}

export async function createFile(
  projectId: string,
  payload: { name: string; parentId?: number | null; content?: string; language?: string },
) {
  return apiFetch<ApiResponse<{ id: number; name: string; version: number }>>(
    `/api/projects/${projectId}/files`,
    {
      method: 'POST',
      body: JSON.stringify({
        parentId: payload.parentId ?? null,
        name: payload.name,
        content: payload.content ?? '',
        language: payload.language ?? null,
      }),
    },
  );
}

export async function createFolder(projectId: string, payload: { name: string; parentId?: number | null }) {
  return apiFetch<ApiResponse<{ id: number; name: string }>>(
    `/api/projects/${projectId}/folders`,
    {
      method: 'POST',
      body: JSON.stringify({
        parentId: payload.parentId ?? null,
        name: payload.name,
      }),
    },
  );
}

export async function updateFileContent(
  projectId: string,
  fileId: string,
  payload: { content: string; version: number },
) {
  return apiFetch<ApiResponse<BackendFileDetail>>(
    `/api/projects/${projectId}/files/${fileId}/content`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );
}
