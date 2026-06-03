import { apiFetch } from './client';
import type { ApiResponse } from './types';

export type BackendFileType = 'FILE' | 'FOLDER';

export type BackendFileTreeNode = {
  id: number;
  name: string;
  type: BackendFileType;
  path: string;
  parentId: number | null;
  language: string | null;
  version: number;
  children: BackendFileTreeNode[];
};

export type BackendLockStatus =
  | 'UNLOCKED'
  | 'LOCKED_BY_ME'
  | 'LOCKED_BY_OTHER'
  | 'VIEWER_MODE';

export type BackendLockUser = {
  userId: number;
  nickname: string;
};

export type BackendFileDetail = {
  id: number;
  projectId: number;
  parentId: number | null;
  name: string;
  type: BackendFileType;
  path: string;
  language: string | null;
  content: string | null;
  version: number;

  lockStatus: BackendLockStatus;
  editable: boolean;
  lockedBy: BackendLockUser | null;
  lockedAt: string | null;

  createdAt?: string;
  updatedAt?: string;
};

export type BackendFileCreateResponse = {
  id: number;
  name: string;
  type: BackendFileType;
  path: string;
  parentId: number | null;
  language: string | null;
  version: number;
};

export type BackendFileRenameResponse = {
  id: number;
  name: string;
  path: string;
};

export type BackendFileNameValidateResponse = {
  valid: boolean;
  reason: string | null;
};

export type BackendFileLockResponse = {
  fileId: number;
  locked: boolean;
  lockStatus: BackendLockStatus;
  lockedAt: string | null;
  lockedBy: BackendLockUser | null;
  lockedByMe: boolean;
};

export type BackendFileLockEvent = {
  type: 'LOCKED' | 'UNLOCKED';
  projectId: number;
  fileId: number;
  lockedBy: BackendLockUser | null;
  lockedAt: string | null;
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
  payload: {
    name: string;
    parentId?: number | null;
    content?: string;
    language?: string | null;
  },
) {
  return apiFetch<ApiResponse<BackendFileCreateResponse>>(
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

export async function createFolder(
  projectId: string,
  payload: {
    name: string;
    parentId?: number | null;
  },
) {
  return apiFetch<ApiResponse<BackendFileCreateResponse>>(
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
  payload: {
    content: string;
    version: number;
  },
) {
  return apiFetch<ApiResponse<BackendFileDetail>>(
    `/api/projects/${projectId}/files/${fileId}/content`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );
}

export async function renameFile(
  projectId: string,
  fileId: string,
  payload: {
    name: string;
  },
) {
  return apiFetch<ApiResponse<BackendFileRenameResponse>>(
    `/api/projects/${projectId}/files/${fileId}/name`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteFile(projectId: string, fileId: string) {
  return apiFetch<ApiResponse<null>>(
    `/api/projects/${projectId}/files/${fileId}`,
    {
      method: 'DELETE',
    },
  );
}

export async function validateFileName(
  projectId: string,
  payload: {
    parentId?: number | null;
    excludeId?: number | null;
    name: string;
    type: BackendFileType;
  },
) {
  return apiFetch<ApiResponse<BackendFileNameValidateResponse>>(
    `/api/projects/${projectId}/files/validate-name`,
    {
      method: 'POST',
      body: JSON.stringify({
        parentId: payload.parentId ?? null,
        excludeId: payload.excludeId ?? null,
        name: payload.name,
        type: payload.type,
      }),
    },
  );
}

export async function lockFile(projectId: string, fileId: string) {
  return apiFetch<ApiResponse<BackendFileLockResponse>>(
    `/api/projects/${projectId}/files/${fileId}/lock`,
    {
      method: 'POST',
    },
  );
}

export async function unlockFile(projectId: string, fileId: string) {
  return apiFetch<ApiResponse<null>>(
    `/api/projects/${projectId}/files/${fileId}/lock`,
    {
      method: 'DELETE',
    },
  );
}