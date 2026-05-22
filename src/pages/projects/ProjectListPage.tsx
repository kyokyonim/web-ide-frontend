import { Folder, Grid, List, Plus, Search, Settings } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { mockProjects } from '../../data/mock';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';
import { NewProjectModal } from './NewProjectModal';

export function ProjectListPage() {
  const { theme, basePath } = useTheme();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={`mx-auto ${figma.layout.contentMax} ${figma.spacing.page}`}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={`${figma.typography.h1} ${theme.text}`}>프로젝트</h1>
          <p className={`mt-1 ${figma.typography.body} ${theme.textMuted}`}>
            {mockProjects.length}개의 프로젝트
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className={figma.sizes.buttonHeight}>
          <Plus size={16} /> 새 프로젝트
        </Button>
      </div>

      <div className={`mb-6 flex flex-wrap items-center ${figma.spacing.inline}`}>
        <div
          className={`flex h-10 min-w-[280px] flex-1 items-center gap-2 border px-3 ${theme.input}`}
        >
          <Search size={16} className={theme.textSubtle} />
          <input
            placeholder="프로젝트 검색..."
            className={`flex-1 bg-transparent text-sm outline-none ${theme.text}`}
          />
        </div>
        <Select
          options={[
            { value: 'modified', label: '최근 수정' },
            { value: 'created', label: '최근 생성' },
            { value: 'name', label: '이름 (A-Z)' },
          ]}
          defaultValue="modified"
        />
        <div className={`flex overflow-hidden rounded border ${theme.border}`}>
          <button
            type="button"
            onClick={() => setView('grid')}
            className={`flex h-10 w-10 items-center justify-center ${view === 'grid' ? theme.primary : theme.surfaceMuted}`}
          >
            <Grid size={16} />
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            className={`flex h-10 w-10 items-center justify-center border-l ${theme.border} ${view === 'list' ? theme.primary : theme.surfaceMuted}`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="project-grid grid sm:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((p) => (
            <Card
              key={p.id}
              hover
              className={`${figma.sizes.projectCardMin} flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <Link to={`${basePath}/ide`} className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center ${theme.surfaceMuted} ${theme.radius}`}
                  >
                    <Folder size={22} className="text-amber-500" />
                  </div>
                  <div>
                    <div className={`${figma.typography.h3} ${theme.text}`}>{p.name}</div>
                    <Badge variant={p.role} className="mt-2 capitalize">
                      {p.role}
                    </Badge>
                  </div>
                </Link>
                {p.role === 'owner' ? (
                  <Link
                    to={`${basePath}/projects/settings`}
                    className={`flex h-8 w-8 items-center justify-center rounded hover:bg-black/5`}
                  >
                    <Settings size={16} className={theme.textMuted} />
                  </Link>
                ) : (
                  <Settings size={16} className={`opacity-25 ${theme.textSubtle}`} />
                )}
              </div>
              <div className={`mt-5 flex gap-4 ${figma.typography.caption} ${theme.textMuted}`}>
                <span>참여자 {p.participants}명</span>
                <span>{p.lastModified}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding={false}>
          <div className={`divide-y ${theme.border}`}>
            {mockProjects.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-4 px-5 ${figma.sizes.tableRow} ${theme.cardHover}`}
              >
                <Folder size={18} className="shrink-0 text-amber-500" />
                <Link to={`${basePath}/ide`} className={`min-w-0 flex-1 truncate font-medium ${theme.text}`}>
                  {p.name}
                </Link>
                <Badge variant={p.role} className="capitalize">
                  {p.role}
                </Badge>
                <span className={`hidden shrink-0 sm:inline ${figma.typography.caption} ${theme.textMuted}`}>
                  참여자 {p.participants}명
                </span>
                <span className={`shrink-0 ${figma.typography.caption} ${theme.textMuted}`}>
                  {p.lastModified}
                </span>
                {p.role === 'owner' && (
                  <Link to={`${basePath}/projects/settings`}>
                    <Settings size={16} className={theme.textMuted} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <NewProjectModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
