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

export async function getChatMessages(projectId: string, size = 50, before?: number | null) {
  const params = new URLSearchParams({ size: String(size) });
  if (before != null) {
    params.set('before', String(before));
  }

  return apiFetch<ApiResponse<BackendChatMessageList>>(
    `/api/projects/${projectId}/chats?${params.toString()}`,
    { method: 'GET' },
  );
}
