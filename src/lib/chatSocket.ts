import { Client, type IMessage } from '@stomp/stompjs';
import type { BackendChatMessage } from '../api/chat';

function getBrokerUrl() {
  const configured = import.meta.env.VITE_WS_BASE_URL as string | undefined;
  if (configured) return configured;

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${apiBase.replace(/^http/, 'ws')}/ws`;
}

export type ChatSocketHandlers = {
  onMessage: (message: BackendChatMessage) => void;
  onError?: (body: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

export function connectChatSocket(projectId: string, handlers: ChatSocketHandlers) {
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
      handlers.onConnect?.();

      client.subscribe(`/topic/projects/${projectId}/chat`, (frame: IMessage) => {
        try {
          const message = JSON.parse(frame.body) as BackendChatMessage;
          if (message?.id != null) {
            handlers.onMessage(message);
          }
        } catch (error) {
          console.error('Failed to parse chat message', error);
        }
      });

      client.subscribe('/user/queue/errors', (frame: IMessage) => {
        handlers.onError?.(frame.body);
      });
    },
    onDisconnect: () => {
      handlers.onDisconnect?.();
    },
    onWebSocketClose: () => {
      handlers.onDisconnect?.();
    },
  });

  client.activate();

  return {
    send(content: string) {
      if (!client.connected) {
        throw new Error('채팅 연결이 준비되지 않았습니다.');
      }

      client.publish({
        destination: `/app/projects/${projectId}/chat`,
        body: JSON.stringify({ content }),
      });
    },
    disconnect() {
      void client.deactivate();
    },
  };
}
