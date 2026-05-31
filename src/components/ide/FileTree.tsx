import { ChevronDown, ChevronRight, File, Folder, FolderPlus, FilePlus, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import type { FileNode } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';

function TreeNode({
  node,
  depth = 0,
  activeFileId,
  onSelectFile,
}: {
  node: FileNode;
  depth?: number;
  activeFileId?: string | null;
  onSelectFile?: (fileId: string, fileName: string) => void;
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
};

export function FileTree({
  tree,
  activeFileId = null,
  loading = false,
  onSelectFile,
  onRefresh,
  onCreateFile,
  onCreateFolder,
}: FileTreeProps) {
  const { theme } = useTheme();

  return (
    <div className={`flex h-full flex-col border-r ${theme.border} ${theme.surface}`}>
      <div
        className={`flex h-9 items-center justify-between border-b px-3 ${figma.typography.caption} font-semibold ${theme.border} ${theme.text}`}
      >
        <span>파일 {loading ? '…' : ''}</span>
        <div className="flex gap-1">
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
        {tree.length === 0 && !loading && (
          <p className={`px-3 py-2 text-xs ${theme.textMuted}`}>파일이 없습니다. + 로 추가하세요.</p>
        )}
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            activeFileId={activeFileId}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    </div>
  );
}
