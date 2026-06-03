import { apiFetch } from './client';
import type { ApiResponse } from './types';

export type AdminRecentChat = {
  messageId: number;
  projectId: number;
  projectName: string;
  senderId: number;
  senderNickname: string;
  senderProfileColor: string;
  createdAt: string;
};

export function getAdminRecentChats(size = 5) {
  return apiFetch<ApiResponse<AdminRecentChat[]>>(
    `/api/admin/chats/recent?size=${size}`,
    { method: 'GET' },
  );
}
