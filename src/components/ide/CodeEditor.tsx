import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';

interface CodeEditorProps {
  filename: string;
  code: string;
  unsaved?: boolean;
  readOnlyBanner?: string;
}

function highlightLine(line: string, isDark: boolean) {
  if (!line.trim()) return <span>&nbsp;</span>;
  if (line.startsWith('from ') || line.startsWith('import ')) {
    return (
      <>
        <span className={isDark ? 'text-[#C586C0]' : 'text-purple-600'}>
          {line.split(' ')[0]}
        </span>
        <span className={isDark ? 'text-[#9CDCFE]' : 'text-slate-700'}>
          {line.slice(line.indexOf(' '))}
        </span>
      </>
    );
  }
  if (line.includes('@dataclass') || line.startsWith('@')) {
    return <span className={isDark ? 'text-[#DCDCAA]' : 'text-amber-600'}>{line}</span>;
  }
  if (line.startsWith('def ') || line.startsWith('class ')) {
    return (
      <>
        <span className={isDark ? 'text-[#569CD6]' : 'text-blue-600'}>
          {line.match(/^(def|class)/)?.[0]}
        </span>
        <span className={isDark ? 'text-[#DCDCAA]' : 'text-amber-700'}>
          {line.replace(/^(def|class)/, '')}
        </span>
      </>
    );
  }
  if (line.includes('"')) {
    const parts = line.split(/(".*?")/g);
    return parts.map((part, j) =>
      part.startsWith('"') ? (
        <span key={j} className={isDark ? 'text-[#CE9178]' : 'text-green-600'}>
          {part}
        </span>
      ) : (
        <span key={j} className={isDark ? 'text-[#CCCCCC]' : ''}>
          {part}
        </span>
      )
    );
  }
  return <span className={isDark ? 'text-[#CCCCCC]' : ''}>{line}</span>;
}

export function CodeEditor({
  filename,
  code,
  unsaved = true,
  readOnlyBanner = '뷰어 모드 - 읽기 전용 모드입니다.',
}: CodeEditorProps) {
  const { theme, style } = useTheme();
  const isDark = style === 'dark';
  const lines = code.split('\n');

  return (
    <div className={`flex h-full flex-col ${theme.editorBg}`}>
      <div className={`flex h-9 items-stretch border-b ${theme.border} ${isDark ? 'bg-[#2d2d30]' : 'bg-[#F6F8FA]'}`}>
        <div
          className={`flex items-center gap-2 border-r px-4 text-[13px] ${theme.border} ${
            isDark ? 'bg-[#1e1e1e] text-[#cccccc]' : `${theme.text} font-medium`
          }`}
        >
          {unsaved && <span className="tab-unsaved-dot shrink-0" />}
          <span className={theme.fontMono}>{filename}</span>
          <button type="button" className={`opacity-60 ${theme.textSubtle}`}>
            <X size={14} />
          </button>
        </div>
      </div>
      {readOnlyBanner && (
        <div
          className={`flex h-9 items-center justify-between border-b px-4 ${figma.typography.caption} ${theme.warningBg} ${theme.border}`}
        >
          <span>{readOnlyBanner}</span>
          <button type="button" className={theme.textMuted}>
            <X size={14} />
          </button>
        </div>
      )}
      <div className={`flex flex-1 overflow-auto ${theme.fontMono}`}>
        <div
          className={`select-none border-r py-3 pr-3 text-right ${theme.editorGutter} ${theme.border}`}
          style={{ minWidth: 48 }}
        >
          {lines.map((_, i) => (
            <div key={i} className="px-2 leading-5">
              {i + 1}
            </div>
          ))}
        </div>
        <pre className="flex-1 overflow-auto py-3 pl-4">
          {lines.map((line, i) => (
            <div key={i} className="leading-5">
              {highlightLine(line, isDark)}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
