import { ChevronDown, ChevronRight, File, Folder, FolderPlus, FilePlus, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import type { FileNode } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';

function TreeNode({
  node,
  depth = 0,
  activeFile,
}: {
  node: FileNode;
  depth?: number;
  activeFile?: string;
}) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(depth < 3);
  const isFolder = node.type === 'folder';
  const isActive = node.name === activeFile;

  return (
    <div>
      <button
        type="button"
        onClick={() => isFolder && setOpen(!open)}
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
          <TreeNode key={child.id} node={child} depth={depth + 1} activeFile={activeFile} />
        ))}
    </div>
  );
}

export function FileTree({ tree, activeFile = 'web_ide.py' }: { tree: FileNode[]; activeFile?: string }) {
  const { theme } = useTheme();

  return (
    <div className={`flex h-full flex-col border-r ${theme.border} ${theme.surface}`}>
      <div
        className={`flex h-9 items-center justify-between border-b px-3 ${figma.typography.caption} font-semibold ${theme.border} ${theme.text}`}
      >
        <span>파일</span>
        <div className="flex gap-1">
          <button type="button" className={theme.textMuted} aria-label="새 파일">
            <FilePlus size={14} />
          </button>
          <button type="button" className={theme.textMuted} aria-label="새 폴더">
            <FolderPlus size={14} />
          </button>
          <button type="button" className={theme.textMuted} aria-label="새로고침">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-1">
        {tree.map((node) => (
          <TreeNode key={node.id} node={node} activeFile={activeFile} />
        ))}
      </div>
    </div>
  );
}
