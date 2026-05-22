import { FileCode, Moon, Settings } from 'lucide-react';
import { FileTree } from '../../components/ide/FileTree';
import { CodeEditor } from '../../components/ide/CodeEditor';
import { RightPanel } from '../../components/ide/RightPanel';
import { TopBar } from '../../components/layout/TopBar';
import { mockCode, mockFileTree } from '../../data/mock';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';

export function IDEPage() {
  const { theme, basePath } = useTheme();

  return (
    <div className={`flex h-full flex-col ${theme.pageBg}`}>
      <TopBar showBack backTo={`${basePath}/projects`} />
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex ${figma.layout.activityBar} shrink-0 flex-col items-center border-r py-3 ${theme.activityBar} ${theme.border}`}
        >
          <button
            className={`flex h-10 w-10 items-center justify-center rounded ${theme.text}`}
            title="파일"
          >
            <FileCode size={22} />
          </button>
          <div className="flex-1" />
          <button
            className={`mb-2 flex h-10 w-10 items-center justify-center rounded ${theme.textMuted}`}
            title="다크 모드"
          >
            <Moon size={18} />
          </button>
          <button
            className={`flex h-10 w-10 items-center justify-center rounded ${theme.textMuted}`}
            title="설정"
          >
            <Settings size={18} />
          </button>
        </div>
        <div className={`${figma.layout.fileTree} shrink-0 overflow-hidden`}>
          <FileTree tree={mockFileTree} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <CodeEditor filename="web_ide.py" code={mockCode} />
        </div>
        <div className={`${figma.layout.rightPanel} shrink-0`}>
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
