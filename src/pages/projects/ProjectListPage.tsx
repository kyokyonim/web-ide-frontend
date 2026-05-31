import { Folder, Grid, List, Plus, Search, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { useTheme } from '../../context/ThemeContext';
import { figma } from '../../styles/figma-spec';
import type { Project, UserRole } from '../../types';
import { getMyProjects, type BackendProject } from '../../api/projects';
import { NewProjectModal } from './NewProjectModal';

function normalizeRole(role?: string): UserRole {
  const lower = role?.toLowerCase();

  if (lower === 'editor') return 'editor';
  if (lower === 'viewer') return 'viewer';
  return 'owner';
}

function formatDate(value?: string) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('ko-KR');
}

function toProject(p: BackendProject): Project {
  return {
    id: String(p.id),
    name: p.projectName ?? p.name ?? `Project ${p.id}`,
    role: normalizeRole(p.myRole ?? p.role),
    participants: p.memberCount ?? p.participants ?? 1,
    lastModified: formatDate(p.updatedAt ?? p.createdAt),
    languages: [p.language ?? 'JAVA'],
  };
}

export function ProjectListPage() {
  const { theme, basePath } = useTheme();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getMyProjects();
      setProjects(response.data.map(toProject));
    } catch (err) {
      console.error(err);
      setError('프로젝트 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  return (
    <div className={`mx-auto ${figma.layout.contentMax} ${figma.spacing.page}`}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={`${figma.typography.h1} ${theme.text}`}>프로젝트</h1>
          <p className={`mt-1 ${figma.typography.body} ${theme.textMuted}`}>
            {loading ? '불러오는 중...' : `${projects.length}개의 프로젝트`}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className={figma.sizes.buttonHeight}>
          <Plus size={16} /> 새 프로젝트
        </Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

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
          {projects.map((p) => (
            <Card
              key={p.id}
              hover
              className={`${figma.sizes.projectCardMin} flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <Link to={`${basePath}/ide/${p.id}`} className="flex items-start gap-3">
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
            {projects.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-4 px-5 ${figma.sizes.tableRow} ${theme.cardHover}`}
              >
                <Folder size={18} className="shrink-0 text-amber-500" />
                <Link to={`${basePath}/ide/${p.id}`} className={`min-w-0 flex-1 truncate font-medium ${theme.text}`}>
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

      <NewProjectModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={loadProjects}
      />
    </div>
  );
}