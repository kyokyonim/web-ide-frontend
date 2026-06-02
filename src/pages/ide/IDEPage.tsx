import { FileCode, Moon, Settings } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileTree } from '../../components/ide/FileTree';
import { CodeEditor } from '../../components/ide/CodeEditor';
import { RightPanel } from '../../components/ide/RightPanel';
import { TopBar } from '../../components/layout/TopBar';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';
import { updatePresence } from '../../api/presence';
import {
  createFile,
  createFolder,
  getFileDetail,
  getFileTree,
  lockFile,
  updateFileContent,
  type BackendLockStatus,
  type BackendLockUser,
} from '../../api/files';
import { connectFileLockSocket } from '../../lib/fileLockSocket';
import { mapBackendFileTree } from '../../lib/fileTreeMapper';
import type { FileNode } from '../../types';

export function IDEPage() {
  const { theme, basePath, style } = useTheme();
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeError, setTreeError] = useState('');

  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [activeFileName, setActiveFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileVersion, setFileVersion] = useState<number | null>(null);
  const [savedContent, setSavedContent] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  const [fileSaving, setFileSaving] = useState(false);
  const [fileError, setFileError] = useState('');

  const [lockError, setLockError] = useState('');
  const fileLockSocketRef = useRef<ReturnType<typeof connectFileLockSocket> | null>(null);

  const myUserId = Number(localStorage.getItem('userId')) || null;

  const [activeLockStatus, setActiveLockStatus] = useState<BackendLockStatus>('UNLOCKED');
  const [activeLockedBy, setActiveLockedBy] = useState<BackendLockUser | null>(null);

  const unsaved = fileContent !== savedContent;

  const loadFileTree = useCallback(async () => {
    if (!projectId) return;

    setTreeLoading(true);
    setTreeError('');

    try {
      const response = await getFileTree(projectId);
      setFileTree(mapBackendFileTree(response.data));
    } catch (err) {
      console.error(err);
      setTreeError('파일 트리를 불러오지 못했습니다.');
    } finally {
      setTreeLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        void loadFileTree();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [loadFileTree]);

  useEffect(() => {
    if (!projectId) return;

    updatePresence(projectId).catch((err) => {
      console.error('Presence update failed:', err);
    });

    const timer = window.setInterval(() => {
      updatePresence(projectId).catch((err) => {
        console.error('Presence update failed:', err);
      });
    }, 30000);

    return () => window.clearInterval(timer);
  }, [projectId]);

  useEffect(() => {
    if (!unsaved) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [unsaved]);

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;
    let socket: ReturnType<typeof connectFileLockSocket> | null = null;

    queueMicrotask(() => {
      if (cancelled) return;

      try {
        socket = connectFileLockSocket(projectId, {
          onLockEvent: (event) => {
            if (cancelled) return;

            if (String(event.fileId) !== activeFileId) {
              return;
            }

            if (event.type === 'UNLOCKED') {
              setActiveLockStatus('UNLOCKED');
              setActiveLockedBy(null);
              return;
            }

            if (event.lockedBy?.userId === myUserId) {
              setActiveLockStatus('LOCKED_BY_ME');
            } else {
              setActiveLockStatus('LOCKED_BY_OTHER');
            }

            setActiveLockedBy(event.lockedBy);
          },
          onError: (body) => {
            if (!cancelled) {
              setLockError(body);
            }
          },
        });

        fileLockSocketRef.current = socket;
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setLockError(err instanceof Error ? err.message : '파일 잠금 알림 연결에 실패했습니다.');
        }
      }
    });

    return () => {
      cancelled = true;
      socket?.disconnect();
      fileLockSocketRef.current = null;
    };
  }, [projectId, activeFileId, myUserId]);

  const handleSelectFile = async (fileId: string, fileName: string) => {
    if (!projectId) return;

    setActiveFileId(fileId);
    setActiveFileName(fileName);
    setFileLoading(true);
    setFileError('');

    try {
      const response = await getFileDetail(projectId, fileId);
      const content = response.data.content ?? '';

      setFileContent(content);
      setSavedContent(content);
      setFileVersion(response.data.version);

      setActiveLockStatus(response.data.lockStatus);
      setActiveLockedBy(response.data.lockedBy);
    } catch (err) {
      console.error(err);
      setFileError(err instanceof Error ? err.message : '파일을 불러오지 못했습니다.');
      setActiveLockStatus('UNLOCKED');
      setActiveLockedBy(null);
    } finally {
      setFileLoading(false);
    }
  };

  const handleSaveFile = async () => {
    if (!projectId || !activeFileId || fileVersion == null) return;

    setFileSaving(true);
    setFileError('');

    try {
      const response = await updateFileContent(projectId, activeFileId, {
        content: fileContent,
        version: fileVersion,
      });

      setFileVersion(response.data.version);
      setSavedContent(fileContent);

      // 백엔드에서 저장 성공 후 lock을 자동 해제하므로 프론트 상태도 맞춤
      setActiveLockStatus('UNLOCKED');
      setActiveLockedBy(null);
    } catch (err) {
      console.error(err);
      setFileError(err instanceof Error ? err.message : '파일 저장에 실패했습니다.');
    } finally {
      setFileSaving(false);
    }
  };

  const handleCreateFile = async () => {
    if (!projectId) return;

    const name = window.prompt('새 파일 이름', 'main.py');
    if (!name?.trim()) return;

    try {
      const response = await createFile(projectId, {
        name: name.trim(),
        content: '',
      });

      await loadFileTree();
      await handleSelectFile(String(response.data.id), name.trim());
    } catch (err) {
      console.error(err);
      setTreeError(err instanceof Error ? err.message : '파일 생성에 실패했습니다.');
    }
  };

  const handleCreateFolder = async () => {
    if (!projectId) return;

    const name = window.prompt('새 폴더 이름', 'src');
    if (!name?.trim()) return;

    try {
      await createFolder(projectId, {
        name: name.trim(),
      });

      await loadFileTree();
    } catch (err) {
      console.error(err);
      setTreeError(err instanceof Error ? err.message : '폴더 생성에 실패했습니다.');
    }
  };

  const handleChangeFileContent = async (value: string) => {
    if (!projectId || !activeFileId) return;

    if (activeLockStatus === 'UNLOCKED') {
      try {
        const response = await lockFile(projectId, activeFileId);
        setActiveLockStatus(response.data.lockStatus);
        setActiveLockedBy(response.data.lockedBy);
      } catch (err) {
        console.error(err);
        setFileError(err instanceof Error ? err.message : '파일 잠금에 실패했습니다.');
        return;
      }
    }

    setFileContent(value);
  };

  const handleToggleTheme = () => {
    const nextStyle = style === 'dark' ? 'minimal' : 'dark';

    if (projectId) {
      navigate(`/design/${nextStyle}/ide/${projectId}`);
    } else {
      navigate(`/design/${nextStyle}/ide`);
    }
  };

  const editorReadOnly =
    !activeFileId ||
    fileLoading ||
    activeLockStatus === 'LOCKED_BY_OTHER' ||
    activeLockStatus === 'VIEWER_MODE';

  const readOnlyBanner = !activeFileId
    ? '왼쪽에서 파일을 선택하세요.'
    : activeLockStatus === 'LOCKED_BY_ME'
      ? '내가 편집 중'
      : activeLockStatus === 'LOCKED_BY_OTHER'
        ? `${activeLockedBy?.nickname ?? '다른 사용자'}님이 편집 중입니다.`
        : activeLockStatus === 'VIEWER_MODE'
          ? '뷰어 모드'
          : undefined;

  return (
    <div className={`flex h-full flex-col ${theme.pageBg}`}>
      <TopBar showBack backTo={`${basePath}/projects`} />

      {(treeError || fileError || lockError) && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600">
          {treeError || fileError || lockError}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex ${figma.layout.activityBar} shrink-0 flex-col items-center border-r py-3 ${theme.activityBar} ${theme.border}`}
        >
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded ${theme.text}`}
            title="파일"
          >
            <FileCode size={22} />
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={handleToggleTheme}
            className={`mb-2 flex h-10 w-10 items-center justify-center rounded ${theme.textMuted}`}
            title="다크 모드"
          >
            <Moon size={18} />
          </button>

          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded ${theme.textMuted}`}
            title="설정"
          >
            <Settings size={18} />
          </button>
        </div>

        <div className={`${figma.layout.fileTree} shrink-0 overflow-hidden`}>
          <FileTree
            tree={fileTree}
            activeFileId={activeFileId}
            loading={treeLoading}
            onSelectFile={(id, name) => void handleSelectFile(id, name)}
            onRefresh={() => void loadFileTree()}
            onCreateFile={() => void handleCreateFile()}
            onCreateFolder={() => void handleCreateFolder()}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <CodeEditor
            filename={activeFileName}
            code={fileLoading ? '불러오는 중…' : fileContent}
            unsaved={unsaved}
            readOnly={editorReadOnly}
            readOnlyBanner={readOnlyBanner}
            saving={fileSaving}
            onChange={(value) => void handleChangeFileContent(value)}
            onSave={() => void handleSaveFile()}
          />
        </div>

        <div className={`${figma.layout.rightPanel} shrink-0`}>
          <RightPanel projectId={projectId} />
        </div>
      </div>
    </div>
  );
}