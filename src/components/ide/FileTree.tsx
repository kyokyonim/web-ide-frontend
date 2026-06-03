import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderPlus,
  FilePlus,
  RefreshCw,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type { FileNode } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';

type ContextMenuState = {
  node: FileNode;
  x: number;
  y: number;
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
  onOpenContextMenu?: (node: FileNode, x: number, y: number) => void;
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

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    onOpenContextMenu?.(node, event.clientX, event.clientY);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        onContextMenu={handleContextMenu}
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
  onRenameNode?: (node: FileNode) => void;
  onDeleteNode?: (node: FileNode) => void;
  onCreateFileInFolder?: (folder: FileNode) => void;
  onCreateFolderInFolder?: (folder: FileNode) => void;
};

export function FileTree({
  tree,
  activeFileId = null,
  loading = false,
  onSelectFile,
  onRefresh,
  onCreateFile,
  onCreateFolder,
  onRenameNode,
  onDeleteNode,
  onCreateFileInFolder,
  onCreateFolderInFolder,
}: FileTreeProps) {
  const { theme } = useTheme();
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleOpenContextMenu = (node: FileNode, x: number, y: number) => {
    setContextMenu({ node, x, y });
  };

  const handleRename = () => {
    if (!contextMenu) return;

    onRenameNode?.(contextMenu.node);
    closeContextMenu();
  };

  const handleDelete = () => {
    if (!contextMenu) return;

    onDeleteNode?.(contextMenu.node);
    closeContextMenu();
  };

  return (
    <div
      className={`relative flex h-full flex-col border-r ${theme.border} ${theme.surface}`}
      onClick={closeContextMenu}
    >
      <div
        className={`flex h-9 items-center justify-between border-b px-3 ${figma.typography.caption} font-semibold ${theme.border} ${theme.text}`}
      >
        <span>파일 {loading ? '…' : ''}</span>

        <div className="flex gap-1">
          <button
            type="button"
            className={theme.textMuted}
            aria-label="새 파일"
            onClick={(event) => {
              event.stopPropagation();
              onCreateFile?.();
            }}
          >
            <FilePlus size={14} />
          </button>

          <button
            type="button"
            className={theme.textMuted}
            aria-label="새 폴더"
            onClick={(event) => {
              event.stopPropagation();
              onCreateFolder?.();
            }}
          >
            <FolderPlus size={14} />
          </button>

          <button
            type="button"
            className={theme.textMuted}
            aria-label="새로고침"
            onClick={(event) => {
              event.stopPropagation();
              onRefresh?.();
            }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-1">
        {tree.length === 0 && !loading && (
          <p className={`px-3 py-2 text-xs ${theme.textMuted}`}>파일이 없습니다. + 로 추가하세요.</p>
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
          className={`fixed z-50 min-w-32 rounded border py-1 shadow-lg ${theme.surface} ${theme.border}`}
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          {contextMenu.node.type === 'folder' && (
            <>
              <button
                type="button"
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs ${theme.text} hover:opacity-80`}
                onClick={() => {
                  onCreateFileInFolder?.(contextMenu.node);
                  closeContextMenu();
                }}
              >
                <FilePlus size={13} />
                새 파일 만들기
              </button>

              <button
                type="button"
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs ${theme.text} hover:opacity-80`}
                onClick={() => {
                  onCreateFolderInFolder?.(contextMenu.node);
                  closeContextMenu();
                }}
              >
                <FolderPlus size={13} />
                새 폴더 만들기
              </button>
            </>
          )}

          <button
            type="button"
            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs ${theme.text} hover:opacity-80`}
            onClick={handleRename}
          >
            <Pencil size={13} />
            이름 변경
          </button>

          <button
            type="button"
            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-500 hover:opacity-80`}
            onClick={handleDelete}
          >
            <Trash2 size={13} />
            삭제
          </button>
        </div>
      )}
    </div>
  );
}