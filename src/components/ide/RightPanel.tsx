import { useState } from 'react';
import { mockChatMessages, mockComments, mockParticipants } from '../../data/mock';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { roleBadgeClass } from '../../themes/tokens';

type Tab = 'chat' | 'comments' | 'participants';

export function RightPanel() {
  const { theme, style } = useTheme();
  const [tab, setTab] = useState<Tab>('chat');

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'chat', label: '채팅', count: mockChatMessages.length },
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
          <div className="flex-1 space-y-3 overflow-auto p-3">
            {mockChatMessages.map((msg) => (
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
            />
            <Button size="sm" className="w-full">
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
