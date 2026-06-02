import { useCallback, useEffect, useRef, useState } from 'react';
import { mockComments, mockParticipants } from '../../data/mock';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { roleBadgeClass } from '../../themes/tokens';
import { getChatMessages, type BackendChatMessage } from '../../api/chat';
import { connectChatSocket } from '../../lib/chatSocket';
import type { ChatMessage } from '../../types';

type Tab = 'chat' | 'comments' | 'participants';

function formatChatTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

function formatChatError(body: string) {
  try {
    const parsed = JSON.parse(body) as { message?: string; code?: string };
    return parsed.message || parsed.code || body;
  } catch {
    return body;
  }
}

function toUiMessage(message: BackendChatMessage, myUserId: number | null): ChatMessage {
  return {
    id: String(message.id),
    user: message.senderNickname,
    avatar: message.senderNickname.slice(0, 2),
    message: message.content,
    time: formatChatTime(message.createdAt),
    isMe: myUserId != null && message.senderId === myUserId,
  };
}

type RightPanelProps = {
  projectId?: string;
};

export function RightPanel({ projectId }: RightPanelProps) {
  const { theme, style } = useTheme();
  const [tab, setTab] = useState<Tab>('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatError, setChatError] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [olderLoading, setOlderLoading] = useState(false);
  const [chatConnected, setChatConnected] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const chatSocketRef = useRef<ReturnType<typeof connectChatSocket> | null>(null);
  const myUserId = Number(localStorage.getItem('userId')) || null;

  const appendMessage = useCallback(
    (message: BackendChatMessage) => {
      setChatMessages((prev) => {
        if (prev.some((item) => item.id === String(message.id))) {
          return prev;
        }
        return [...prev, toUiMessage(message, myUserId)];
      });
    },
    [myUserId],
  );

  useEffect(() => {
    if (!projectId || tab !== 'chat') return;

    let cancelled = false;
    setChatConnected(false);

    const loadHistory = async () => {
      setChatLoading(true);
      setChatError('');
      try {
        const response = await getChatMessages(projectId);
        if (cancelled) return;
        const ordered = [...response.data.messages].reverse();
        setChatMessages(ordered.map((m) => toUiMessage(m, myUserId)));
        setHasMoreMessages(response.data.hasMore);
        setNextCursor(response.data.nextCursor);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setChatError('채팅 기록을 불러오지 못했습니다.');
        }
      } finally {
        if (!cancelled) setChatLoading(false);
      }
    };

    void loadHistory();

    try {
      const socket = connectChatSocket(projectId, {
        onMessage: (message) => {
          if (!cancelled) appendMessage(message);
        },
        onError: (body) => {
          if (!cancelled) setChatError(formatChatError(body));
        },
        onConnect: () => {
          if (!cancelled) setChatConnected(true);
        },
        onDisconnect: () => {
          if (!cancelled) setChatConnected(false);
        },
      });
      chatSocketRef.current = socket;
    } catch (err) {
      console.error(err);
      if (!cancelled) {
        setChatError(err instanceof Error ? err.message : '채팅 연결에 실패했습니다.');
      }
    }

    return () => {
      cancelled = true;
      chatSocketRef.current?.disconnect();
      chatSocketRef.current = null;
      setChatConnected(false);
    };
  }, [projectId, tab, myUserId, appendMessage]);

  const handleLoadOlderMessages = async () => {
    if (!projectId || !nextCursor || olderLoading) return;

    setOlderLoading(true);
    setChatError('');
    try {
      const response = await getChatMessages(projectId, 50, nextCursor);
      const ordered = [...response.data.messages].reverse().map((m) => toUiMessage(m, myUserId));

      setChatMessages((prev) => {
        const existingIds = new Set(prev.map((message) => message.id));
        const newMessages = ordered.filter((message) => !existingIds.has(message.id));
        return [...newMessages, ...prev];
      });
      setHasMoreMessages(response.data.hasMore);
      setNextCursor(response.data.nextCursor);
    } catch (err) {
      console.error(err);
      setChatError(err instanceof Error ? err.message : '이전 채팅 기록을 불러오지 못했습니다.');
    } finally {
      setOlderLoading(false);
    }
  };

  const handleSendChat = () => {
    const trimmed = chatInput.trim();
    if (!trimmed || !chatSocketRef.current) return;

    try {
      chatSocketRef.current.send(trimmed);
      setChatInput('');
      setChatError('');
    } catch (err) {
      console.error(err);
      setChatError(err instanceof Error ? err.message : '메시지 전송에 실패했습니다.');
    }
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'chat', label: '채팅', count: chatMessages.length },
    { id: 'comments', label: '댓글', count: mockComments.length },
    { id: 'participants', label: '참여자', count: mockParticipants.length },
  ];

  return (
    <div className={`flex h-full flex-col border-l ${theme.border} ${theme.surface}`}>
      <div className={`flex border-b ${theme.border}`}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-2 py-3 text-xs font-medium transition ${
              tab === t.id ? `${theme.text} border-b-2 border-blue-500` : theme.textMuted
            }`}
          >
            {t.label} {t.count}
          </button>
        ))}
      </div>

      {tab === 'chat' && (
        <>
          {chatError && <p className="border-b px-3 py-2 text-xs text-red-500">{chatError}</p>}
          {!chatConnected && !chatError && (
            <p className={`border-b px-3 py-2 text-xs ${theme.textMuted}`}>채팅 연결 중…</p>
          )}
          <div className="flex-1 space-y-3 overflow-auto p-3">
            {chatLoading && <p className={`text-xs ${theme.textMuted}`}>기록 불러오는 중…</p>}
            {!chatLoading && hasMoreMessages && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={handleLoadOlderMessages}
                disabled={olderLoading}
              >
                {olderLoading ? '불러오는 중…' : '이전 메시지 더보기'}
              </Button>
            )}
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-600 text-[10px] text-white">
                  {msg.avatar}
                </div>
                <div className={`max-w-[85%] ${msg.isMe ? 'text-right' : ''}`}>
                  <div className={`text-xs font-medium ${theme.text}`}>{msg.user}</div>
                  <div
                    className={`mt-1 rounded px-3 py-2 text-xs ${
                      msg.isMe ? 'bg-blue-600 text-white' : `${theme.surfaceMuted} ${theme.text}`
                    }`}
                  >
                    {msg.message}
                  </div>
                  <div className={`mt-0.5 text-[10px] ${theme.textSubtle}`}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={`border-t p-3 ${theme.border}`}>
            <textarea
              placeholder="메시지 입력..."
              className={`mb-2 w-full resize-none border px-3 py-2 text-xs outline-none ${theme.input}`}
              rows={2}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendChat();
                }
              }}
            />
            <Button size="sm" className="w-full" onClick={handleSendChat} disabled={!chatConnected}>
              전송
            </Button>
          </div>
        </>
      )}

      {tab === 'comments' && (
        <>
          <div className={`flex gap-2 border-b p-2 text-xs ${theme.border}`}>
            {['전체', '해결됨', '내 댓글'].map((f, i) => (
              <button
                key={f}
                className={`rounded px-2 py-1 ${i === 0 ? theme.primary : theme.textMuted}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex-1 space-y-2 overflow-auto p-3">
            {mockComments.map((c) => (
              <button
                key={c.id}
                className={`w-full rounded border p-3 text-left text-xs transition ${theme.border} ${theme.cardHover}`}
              >
                <div className={`font-medium ${theme.textSubtle}`}>
                  {c.file}: {c.line}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-500 text-[10px] text-white">
                    {c.avatar}
                  </span>
                  <span className={theme.text}>{c.user}</span>
                  <span className={theme.textSubtle}>{c.time}</span>
                </div>
                <p className={`mt-2 ${theme.textMuted}`}>{c.content}</p>
                {c.resolved && (
                  <span className={`mt-2 inline-block text-[10px] ${theme.success}`}>✓ 해결됨</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {tab === 'participants' && (
        <div className="flex-1 overflow-auto p-3">
          <Section title="접속 중" count={2} theme={theme}>
            {mockParticipants
              .filter((p) => p.status === 'online')
              .map((p) => (
                <ParticipantRow key={p.id} participant={p} style={style} theme={theme} />
              ))}
          </Section>
          <Section title="오프라인" count={3} theme={theme}>
            {mockParticipants
              .filter((p) => p.status === 'offline')
              .map((p) => (
                <ParticipantRow key={p.id} participant={p} style={style} theme={theme} />
              ))}
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  count,
  children,
  theme,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  theme: ReturnType<typeof useTheme>['theme'];
}) {
  return (
    <div className="mb-4">
      <div className={`mb-2 text-xs font-semibold ${theme.textMuted}`}>
        {title} · {count}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ParticipantRow({
  participant: p,
  style,
  theme,
}: {
  participant: (typeof mockParticipants)[0];
  style: ReturnType<typeof useTheme>['style'];
  theme: ReturnType<typeof useTheme>['theme'];
}) {
  return (
    <div className={`flex items-center gap-2 rounded border p-2 ${theme.border}`}>
      <div className="relative">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">
          {p.avatar}
        </div>
        {p.status === 'online' && (
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className={`truncate text-xs font-medium ${theme.text}`}>{p.name}</div>
        <div className={`truncate text-[10px] ${theme.textSubtle}`}>{p.activity}</div>
      </div>
      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${roleBadgeClass(style, p.role)}`}>
        {p.role}
      </span>
    </div>
  );
}
