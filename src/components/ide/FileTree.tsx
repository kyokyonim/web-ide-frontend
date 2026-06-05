import {
  ChevronDown,
  ChevronRight,
  File,
  FilePlus,
  Folder,
  FolderPlus,
  Pencil,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';
import type { FileNode } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';

type ContextMenuState = {
  x: number;
  y: number;
  node: FileNode;
} | null;

function TreeNode({
  node,
  depth = 0,
  activeFileId,
  onSelectFile,
  onOpenContextMenu,
}: {
  node: FileNode;
  depth?: number;
  activeFileId?: string | null;
  onSelectFile?: (fileId: string, fileName: string) => void;
  onOpenContextMenu?: (event: MouseEvent<HTMLButtonElement>, node: FileNode) => void;
}) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(depth < 2);
  const isFolder = node.type === 'folder';
  const isActive = node.id === activeFileId;

  const handleClick = () => {
    if (isFolder) {
      setOpen(!open);
      return;
    }
    onSelectFile?.(node.id, node.name);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        onContextMenu={(event) => onOpenContextMenu?.(event, node)}
        className={`flex h-7 w-full items-center gap-1 text-left ${figma.typography.caption} ${theme.fontMono} ${
          isActive ? 'bg-[#094771] text-white' : theme.textMuted
        } hover:opacity-90`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isFolder ? (
          open ? <ChevronDown size={12} /> : <ChevronRight size={12} />
        ) : (
          <span className="w-3" />
        )}
        {isFolder ? (
          <Folder size={14} className="shrink-0 text-[#DCB67A]" />
        ) : (
          <File size={14} className="shrink-0 text-[#519ABA]" />
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {isFolder &&
        open &&
        node.children?.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            activeFileId={activeFileId}
            onSelectFile={onSelectFile}
            onOpenContextMenu={onOpenContextMenu}
          />
        ))}
    </div>
  );
}

type FileTreeProps = {
  tree: FileNode[];
  activeFileId?: string | null;
  loading?: boolean;
  onSelectFile?: (fileId: string, fileName: string) => void;
  onRefresh?: () => void;
  onCreateFile?: () => void;
  onCreateFolder?: () => void;
  onCreateFileInFolder?: (folder: FileNode) => void;
  onCreateFolderInFolder?: (folder: FileNode) => void;
  onRename?: (node: FileNode) => void;
  onDelete?: (node: FileNode) => void;
  canEdit?: boolean;
};

export function FileTree({
  tree,
  activeFileId = null,
  loading = false,
  onSelectFile,
  onRefresh,
  onCreateFile,
  onCreateFolder,
  onCreateFileInFolder,
  onCreateFolderInFolder,
  onRename,
  onDelete,
  canEdit = true,
}: FileTreeProps) {
  const { theme } = useTheme();
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  useEffect(() => {
    if (!contextMenu) return;

    const handleClose = () => setContextMenu(null);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContextMenu(null);
      }
    };

    window.addEventListener('click', handleClose);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('click', handleClose);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu]);

  const handleOpenContextMenu = (event: MouseEvent<HTMLButtonElement>, node: FileNode) => {
    if (!canEdit) return;

    event.preventDefault();
    event.stopPropagation();

    const menuWidth = 176;
    const menuHeight = node.type === 'folder' ? 168 : 96;

    setContextMenu({
      x: Math.max(8, Math.min(event.clientX, window.innerWidth - menuWidth - 8)),
      y: Math.max(8, Math.min(event.clientY, window.innerHeight - menuHeight - 8)),
      node,
    });
  };

  const runContextAction = (action?: (node: FileNode) => void) => {
    if (!contextMenu || !action) return;

    const { node } = contextMenu;
    setContextMenu(null);
    action(node);
  };

  const menuItemClass = `flex w-full items-center gap-2 px-3 py-1.5 text-left ${theme.text} hover:bg-black/5`;

  return (
    <div className={`flex h-full flex-col border-r ${theme.border} ${theme.surface}`}>
      <div
        className={`flex h-9 items-center justify-between border-b px-3 ${figma.typography.caption} font-semibold ${theme.border} ${theme.text}`}
      >
        <span>파일 {loading ? '…' : ''}</span>
        <div className="flex gap-1">
          {canEdit && (
            <>
              <button
                type="button"
                className={theme.textMuted}
                aria-label="새 파일"
                onClick={onCreateFile}
              >
                <FilePlus size={14} />
              </button>
              <button
                type="button"
                className={theme.textMuted}
                aria-label="새 폴더"
                onClick={onCreateFolder}
              >
                <FolderPlus size={14} />
              </button>
            </>
          )}
          <button
            type="button"
            className={theme.textMuted}
            aria-label="새로고침"
            onClick={onRefresh}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-1">
        {!canEdit && (
          <p className={`border-b px-3 py-2 text-xs ${theme.textMuted}`}>VIEWER는 파일을 읽기만 할 수 있습니다.</p>
        )}
        {tree.length === 0 && !loading && (
          <p className={`px-3 py-2 text-xs ${theme.textMuted}`}>파일이 없습니다.{canEdit ? ' + 로 추가하세요.' : ''}</p>
        )}
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            activeFileId={activeFileId}
            onSelectFile={onSelectFile}
            onOpenContextMenu={handleOpenContextMenu}
          />
        ))}
      </div>
      {contextMenu && (
        <div
          role="menu"
          className={`fixed z-[1000] w-44 overflow-hidden border py-1 ${figma.typography.caption} ${theme.modal}`}
          style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
          onClick={(event) => event.stopPropagation()}
        >
          {contextMenu.node.type === 'folder' && (
            <>
              <button
                type="button"
                role="menuitem"
                className={menuItemClass}
                onClick={() => runContextAction(onCreateFileInFolder)}
              >
                <FilePlus size={14} />
                <span>새 파일</span>
              </button>
              <button
                type="button"
                role="menuitem"
                className={menuItemClass}
                onClick={() => runContextAction(onCreateFolderInFolder)}
              >
                <FolderPlus size={14} />
                <span>새 폴더</span>
              </button>
              <div className={`my-1 border-t ${theme.border}`} />
            </>
          )}
          <button
            type="button"
            role="menuitem"
            className={menuItemClass}
            onClick={() => runContextAction(onRename)}
          >
            <Pencil size={14} />
            <span>이름 변경</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-red-600 hover:bg-red-50"
            onClick={() => runContextAction(onDelete)}
          >
            <Trash2 size={14} />
            <span>삭제</span>
          </button>
        </div>
      )}
    </div>
  );
}
