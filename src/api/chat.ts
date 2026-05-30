import { apiFetch } from './client';
import type { ApiResponse } from './types';

export type BackendChatMessage = {
  id: number;
  senderId: number;
  senderNickname: string;
  senderProfileColor: string;
  content: string;
  createdAt: string;
};

export type BackendChatMessageList = {
  messages: BackendChatMessage[];
  hasMore: boolean;
  nextCursor: number | null;
};

export async function getChatMessages(projectId: string, size = 50) {
  return apiFetch<ApiResponse<BackendChatMessageList>>(
    `/api/projects/${projectId}/chats?size=${size}`,
    { method: 'GET' },
  );
}
