import { apiFetch } from './client';

export type ProjectLanguage = 'JAVA' | 'JAVASCRIPT' | 'PYTHON';

export type BackendProject = {
  id: number;
  projectName?: string;
  name?: string;
  language?: ProjectLanguage;
  role?: string;
  myRole?: string;
  memberCount?: number;
  participants?: number;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function getMyProjects() {
  const userId = localStorage.getItem('userId');

  return apiFetch<ApiResponse<BackendProject[]>>(`/api/projects?userId=${userId}`, {
    method: 'GET',
  });
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