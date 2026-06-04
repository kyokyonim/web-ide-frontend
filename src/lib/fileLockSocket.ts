import { Client, type IMessage } from '@stomp/stompjs';
import type { BackendFileLockEvent } from '../api/files';

function toWebSocketUrl(value: string) {
  const normalized = value.trim().replace(/\/$/, '').replace(/^http/, 'ws');
  return normalized.endsWith('/ws') ? normalized : `${normalized}/ws`;
}

function getBrokerUrl() {
  const configured = import.meta.env.VITE_WS_BASE_URL as string | undefined;
  if (configured?.trim()) return toWebSocketUrl(configured);

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return toWebSocketUrl(apiBase);
}

export type FileLockSocketHandlers = {
  onLockEvent: (event: BackendFileLockEvent) => void;
  onError?: (body: string) => void;
};

export function connectFileLockSocket(
  projectId: string,
  handlers: FileLockSocketHandlers,
) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const client = new Client({
    brokerURL: getBrokerUrl(),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe(`/topic/projects/${projectId}/files/locks`, (frame: IMessage) => {
        try {
          const event = JSON.parse(frame.body) as BackendFileLockEvent;

          if (event?.type === 'LOCKED' || event?.type === 'UNLOCKED') {
            handlers.onLockEvent(event);
          }
        } catch (error) {
          console.error('Failed to parse file lock event', error);
        }
      });

      client.subscribe('/user/queue/errors', (frame: IMessage) => {
        handlers.onError?.(frame.body);
      });
    },
  });

  client.activate();

  return {
    disconnect() {
      void client.deactivate();
    },
  };
}