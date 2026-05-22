import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useTheme } from '../../context/ThemeContext';

const languages = [
  { id: 'java', name: 'Java', emoji: '☕' },
  { id: 'javascript', name: 'JavaScript', emoji: '🟨' },
  { id: 'python', name: 'Python', emoji: '🐍' },
];

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewProjectModal({ open, onClose }: NewProjectModalProps) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [lang, setLang] = useState<string | null>(null);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="새 프로젝트 생성"
      subtitle="새로운 프로젝트를 생성하여 팀과 함께 시작하세요."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button disabled={!name || !lang}>생성</Button>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <Input
            label="프로젝트 이름 *"
            placeholder="프로젝트 이름을 입력하세요."
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 50))}
            maxLength={50}
          />
          <div className={`mt-1 text-right text-xs ${theme.textSubtle}`}>
            {name.length}/50
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.text}`}>언어 (필수)</label>
          <p className={`mt-1 text-xs ${theme.textMuted}`}>
            프로젝트에서 사용할 주요 프로그래밍 언어를 선택하세요.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {languages.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                className={`relative rounded border-2 p-4 text-center transition ${
                  lang === l.id
                    ? 'border-blue-500 bg-blue-50/50'
                    : `${theme.border} ${theme.cardHover}`
                }`}
              >
                <span
                  className={`absolute right-2 top-2 h-4 w-4 rounded-full border-2 ${
                    lang === l.id ? 'border-blue-500 bg-blue-500' : theme.border
                  }`}
                />
                <div className="text-3xl">{l.emoji}</div>
                <div className={`mt-2 text-sm font-medium ${theme.text}`}>{l.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
