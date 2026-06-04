import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { useTheme } from '../../context/ThemeContext';

export type CreateFileModalMode = 'file' | 'folder';

interface CreateFileModalProps {
  open: boolean;
  mode: CreateFileModalMode;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export function CreateFileModal({ open, mode, onClose, onSubmit }: CreateFileModalProps) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFile = mode === 'file';
  const title = isFile ? '새 파일 생성' : '새 폴더 생성';
  const subtitle = isFile
    ? '프로젝트에 추가할 파일 이름을 입력하세요.'
    : '프로젝트에 추가할 폴더 이름을 입력하세요.';

  useEffect(() => {
    if (!open) {
      setName('');
      setError('');
      setLoading(false);
    }
  }, [open, mode]);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');

    try {
      await onSubmit(trimmed);
      setName('');
      onClose();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            취소
          </Button>
          <Button disabled={!name.trim() || loading} onClick={() => void handleSubmit()}>
            {loading ? '생성 중…' : '생성'}
          </Button>
        </>
      }
    >
      <div>
        <Input
          label={isFile ? '파일 이름 *' : '폴더 이름 *'}
          placeholder={isFile ? 'main.py' : 'src'}
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 255))}
          maxLength={255}
        />
        <div className={`mt-1 text-right text-xs ${theme.textSubtle}`}>{name.length}/255</div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    </Modal>
  );
}
