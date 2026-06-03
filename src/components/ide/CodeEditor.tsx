import { Save, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';
import { Button } from '../ui/Button';

interface CodeEditorProps {
  filename: string;
  code: string;
  unsaved?: boolean;
  readOnly?: boolean;
  readOnlyBanner?: string;
  saving?: boolean;
  onChange?: (value: string) => void;
  onSave?: () => void;
}

export function CodeEditor({
  filename,
  code,
  unsaved = false,
  readOnly = false,
  readOnlyBanner,
  saving = false,
  onChange,
  onSave,
}: CodeEditorProps) {
  const { theme } = useTheme();

  return (
    <div className={`flex h-full flex-col ${theme.editorBg}`}>
      <div className={`flex h-9 items-stretch justify-between border-b ${theme.border} bg-[#2d2d30]`}>
        <div
          className={`flex items-center gap-2 border-r px-4 text-[13px] ${theme.border} bg-[#1e1e1e] text-[#cccccc] ${theme.fontMono}`}
        >
          {unsaved && <span className="tab-unsaved-dot shrink-0" />}
          <span>{filename || '파일을 선택하세요'}</span>
        </div>
        {!readOnly && onSave && (
          <Button size="sm" className="mr-2 h-7" onClick={onSave} disabled={saving || !filename}>
            <Save size={14} /> {saving ? '저장 중…' : '저장'}
          </Button>
        )}
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
      <textarea
        className={`min-h-0 flex-1 resize-none border-0 bg-transparent p-4 outline-none ${theme.fontMono} ${theme.text}`}
        value={code}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        spellCheck={false}
        placeholder={readOnly ? '' : '코드를 입력하세요…'}
      />
    </div>
  );
}
