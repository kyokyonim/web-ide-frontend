import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { roleBadgeClass } from '../../themes/tokens';
import { getChatMessages, type BackendChatMessage } from '../../api/chat';
import {
  createFileComment,
  getFileComments,
  type BackendComment,
} from '../../api/comments';
import { getActivePresence, type PresenceUser } from '../../api/presence';
import {
  getProjectMembers,
  type BackendProjectMember,
  type ProjectRole,
} from '../../api/projects';
import { connectChatSocket } from '../../lib/chatSocket';
import type { ChatMessage } from '../../types';

type Tab = 'chat' | 'comments' | 'participants';
type ParticipantStatus = 'online' | 'offline';

type Participant = {
  id: number;
  name: string;
  email: string;
  role: Lowercase<ProjectRole>;
  profileColor: string;
  status: ParticipantStatus;
  activity: string;
};

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

function formatRelative(iso?: string) {
  if (!iso) return '접속 기록 없음';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '접속 기록 없음';

  const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diffSeconds < 10) return '방금 전 활성';
  if (diffSeconds < 60) return `${diffSeconds}초 전 활성`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}분 전 활성`;
  return date.toLocaleString('ko-KR');
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

function toParticipant(member: BackendProjectMember, presence?: PresenceUser): Participant {
  const isOnline = Boolean(presence);
  return {
    id: member.memberId,
    name: member.nickname,
    email: member.email,
    role: member.role.toLowerCase() as Lowercase<ProjectRole>,
    profileColor: member.profileColor,
    status: isOnline ? 'online' : 'offline',
    activity: isOnline ? formatRelative(presence?.lastSeenAt) : '오프라인',
  };
}

function toCommentTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('ko-KR');
}

type RightPanelProps = {
  projectId?: string;
  activeFileId?: string | null;
  activeFileName?: string;
};

export function RightPanel({ projectId, activeFileId, activeFileName }: RightPanelProps) {
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
  const [comments, setComments] = useState<BackendComment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentSaving, setCommentSaving] = useState(false);
  const [members, setMembers] = useState<BackendProjectMember[]>([]);
  const [activePresence, setActivePresence] = useState<PresenceUser[]>([]);
  const [participantsError, setParticipantsError] = useState('');
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const chatSocketRef = useRef<ReturnType<typeof connectChatSocket> | null>(null);
  const chatComposingRef = useRef(false);
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

  const loadParticipants = useCallback(async () => {
    if (!projectId) return;

    setParticipantsLoading(true);
    setParticipantsError('');
    try {
      const [memberResponse, presenceResponse] = await Promise.all([
        getProjectMembers(projectId),
        getActivePresence(projectId),
      ]);
      setMembers(memberResponse.data);
      setActivePresence(presenceResponse.data);
    } catch (err) {
      console.error(err);
      setParticipantsError('참여자 정보를 불러오지 못했습니다.');
    } finally {
      setParticipantsLoading(false);
    }
  }, [projectId]);

  const loadComments = useCallback(async () => {
    if (!projectId || !activeFileId) {
      setComments([]);
      return;
    }

    setCommentLoading(true);
    setCommentError('');
    try {
      const response = await getFileComments(projectId, activeFileId);
      setComments(response.data);
    } catch (err) {
      console.error(err);
      setCommentError('댓글을 불러오지 못했습니다.');
    } finally {
      setCommentLoading(false);
    }
  }, [activeFileId, projectId]);

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

  useEffect(() => {
    setCommentInput('');
    setCommentError('');
  }, [activeFileId]);

  useEffect(() => {
    if (tab === 'comments') {
      void loadComments();
    }
  }, [loadComments, tab]);

  useEffect(() => {
    if (tab !== 'participants') return;

    void loadParticipants();
    const timer = window.setInterval(() => {
      void loadParticipants();
    }, 10000);

    return () => window.clearInterval(timer);
  }, [loadParticipants, tab]);

  const participants = useMemo(() => {
    const presenceByUserId = new Map(activePresence.map((presence) => [presence.userId, presence]));
    return members.map((member) => toParticipant(member, presenceByUserId.get(member.userId)));
  }, [activePresence, members]);

  const onlineParticipants = participants.filter((p) => p.status === 'online');
  const offlineParticipants = participants.filter((p) => p.status === 'offline');

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
    if (!trimmed || !chatSocketRef.current || chatComposingRef.current) return;

    try {
      chatSocketRef.current.send(trimmed);
      setChatInput('');
      setChatError('');
    } catch (err) {
      console.error(err);
      setChatError(err instanceof Error ? err.message : '메시지 전송에 실패했습니다.');
    }
  };

  const handleChatKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) return;

    if (event.nativeEvent.isComposing || chatComposingRef.current || event.keyCode === 229) {
      return;
    }

    event.preventDefault();
    handleSendChat();
  };

  const handleCreateComment = async () => {
    const trimmed = commentInput.trim();
    if (!projectId || !trimmed) return;
    if (!activeFileId) {
      setCommentError('댓글을 남길 파일을 먼저 선택해주세요.');
      return;
    }

    setCommentSaving(true);
    setCommentError('');
    try {
      const response = await createFileComment(projectId, activeFileId, {
        lineNumber: 1,
        content: trimmed,
      });
      setComments((prev) => [response.data, ...prev]);
      setCommentInput('');
    } catch (err) {
      console.error(err);
      setCommentError(err instanceof Error ? err.message : '댓글 작성에 실패했습니다.');
    } finally {
      setCommentSaving(false);
    }
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'chat', label: '채팅', count: chatMessages.length },
    { id: 'comments', label: '댓글', count: comments.length },
    { id: 'participants', label: '참여자', count: participants.length },
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
              onCompositionStart={() => {
                chatComposingRef.current = true;
              }}
              onCompositionEnd={() => {
                window.setTimeout(() => {
                  chatComposingRef.current = false;
                }, 0);
              }}
              onKeyDown={handleChatKeyDown}
            />
            <Button size="sm" className="w-full" onClick={handleSendChat} disabled={!chatConnected}>
              전송
            </Button>
          </div>
        </>
      )}

      {tab === 'comments' && (
        <>
          {commentError && <p className="border-b px-3 py-2 text-xs text-red-500">{commentError}</p>}
          <div className="flex-1 space-y-2 overflow-auto p-3">
            {!activeFileId && (
              <p className={`text-xs ${theme.textMuted}`}>파일을 선택하면 댓글을 확인할 수 있습니다.</p>
            )}
            {activeFileId && commentLoading && (
              <p className={`text-xs ${theme.textMuted}`}>댓글 불러오는 중…</p>
            )}
            {activeFileId && !commentLoading && comments.length === 0 && (
              <p className={`text-xs ${theme.textMuted}`}>아직 댓글이 없습니다.</p>
            )}
            {comments.map((comment) => (
              <div
                key={comment.commentId}
                className={`w-full rounded border p-3 text-left text-xs ${theme.border}`}
              >
                <div className={`font-medium ${theme.textSubtle}`}>
                  {activeFileName || `파일 #${comment.fileId}`}
                  {comment.lineNumber ? `: ${comment.lineNumber}` : ''}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] text-white"
                    style={{ backgroundColor: comment.profileColor }}
                  >
                    {comment.nickname.slice(0, 2)}
                  </span>
                  <span className={theme.text}>{comment.nickname}</span>
                  <span className={theme.textSubtle}>{toCommentTime(comment.createdAt)}</span>
                  {comment.resolved && (
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
                      resolved
                    </span>
                  )}
                </div>
                <p className={`mt-2 ${theme.textMuted}`}>{comment.content}</p>
              </div>
            ))}
          </div>
          <div className={`border-t p-3 ${theme.border}`}>
            <textarea
              placeholder={activeFileId ? '댓글 입력...' : '파일을 먼저 선택하세요'}
              className={`mb-2 w-full resize-none border px-3 py-2 text-xs outline-none ${theme.input}`}
              rows={2}
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              disabled={!activeFileId}
            />
            <Button
              size="sm"
              className="w-full"
              onClick={() => void handleCreateComment()}
              disabled={commentSaving || !activeFileId || !commentInput.trim()}
            >
              {commentSaving ? '작성 중…' : '댓글 추가'}
            </Button>
          </div>
        </>
      )}

      {tab === 'participants' && (
        <div className="flex-1 overflow-auto p-3">
          {participantsError && <p className="mb-3 text-xs text-red-500">{participantsError}</p>}
          {participantsLoading && participants.length === 0 && (
            <p className={`mb-3 text-xs ${theme.textMuted}`}>참여자 불러오는 중…</p>
          )}
          <Section title="접속 중" count={onlineParticipants.length} theme={theme}>
            {onlineParticipants.length === 0 ? (
              <p className={`text-xs ${theme.textMuted}`}>현재 활성 사용자가 없습니다.</p>
            ) : (
              onlineParticipants.map((p) => (
                <ParticipantRow key={p.id} participant={p} style={style} theme={theme} />
              ))
            )}
          </Section>
          <Section title="오프라인" count={offlineParticipants.length} theme={theme}>
            {offlineParticipants.length === 0 ? (
              <p className={`text-xs ${theme.textMuted}`}>오프라인 참여자가 없습니다.</p>
            ) : (
              offlineParticipants.map((p) => (
                <ParticipantRow key={p.id} participant={p} style={style} theme={theme} />
              ))
            )}
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
  children: ReactNode;
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
  participant: Participant;
  style: ReturnType<typeof useTheme>['style'];
  theme: ReturnType<typeof useTheme>['theme'];
}) {
  return (
    <div className={`flex items-center gap-2 rounded border p-2 ${theme.border}`}>
      <div className="relative">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] text-white"
          style={{ backgroundColor: p.profileColor }}
        >
          {p.name.slice(0, 2)}
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
