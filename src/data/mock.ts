import type {
  AdminUser,
  ChatMessage,
  CodeComment,
  FileNode,
  HistoryItem,
  Participant,
  Project,
  ProjectMember,
  SecurityEvent,
} from '../types';

export const mockProjects: Project[] = [
  { id: '1', name: 'e-commerce-frontend', role: 'owner', participants: 6, lastModified: '1분 전', languages: ['JavaScript'] },
  { id: '2', name: 'Team Alpha', role: 'editor', participants: 4, lastModified: '12분 전', languages: ['Python'] },
  { id: '3', name: 'Web IDE Steam', role: 'owner', participants: 8, lastModified: '2시간 전', languages: ['Java', 'Python'] },
  { id: '4', name: 'metrics-dashboard', role: 'viewer', participants: 3, lastModified: '1일 전', languages: ['Python'] },
  { id: '5', name: 'api-gateway', role: 'editor', participants: 5, lastModified: '3일 전', languages: ['Java'] },
  { id: '6', name: 'mobile-client', role: 'viewer', participants: 2, lastModified: '1주 전', languages: ['JavaScript'] },
  { id: '7', name: 'data-pipeline', role: 'owner', participants: 7, lastModified: '2주 전', languages: ['Python'] },
  { id: '8', name: 'auth-service', role: 'editor', participants: 4, lastModified: '3주 전', languages: ['Java'] },
  { id: '9', name: 'legacy-migration', role: 'viewer', participants: 1, lastModified: '1개월 전', languages: ['Java'] },
];

export const mockMembers: ProjectMember[] = [
  { name: '김의제 (나)', email: 'lee1111@example.com', role: 'owner', inviteStatus: '-', accountStatus: 'active', isMe: true },
  { name: '김정아', email: 'kimja@example.com', role: 'viewer', inviteStatus: '초대 중', accountStatus: 'active' },
  { name: '최하린', email: 'choihr@example.com', role: 'viewer', inviteStatus: '초대 중', accountStatus: 'active' },
  { name: '정유진', email: 'jungyj@example.com', role: 'editor', inviteStatus: '참여 중', accountStatus: 'active' },
  { name: '홍서진', email: 'hongsj@example.com', role: 'editor', inviteStatus: '참여 중', accountStatus: 'active' },
];

export const mockFileTree: FileNode[] = [
  {
    id: 'root',
    name: 'Web IDE Steam',
    type: 'folder',
    children: [
      {
        id: 'src',
        name: 'src',
        type: 'folder',
        children: [
          {
            id: 'main',
            name: 'main',
            type: 'folder',
            children: [
              {
                id: 'java',
                name: 'java',
                type: 'folder',
                children: [
                  {
                    id: 'com',
                    name: 'com',
                    type: 'folder',
                    children: [
                      {
                        id: 'example',
                        name: 'example',
                        type: 'folder',
                        children: [
                          {
                            id: 'app',
                            name: 'app',
                            type: 'folder',
                            children: [{ id: 'main-java', name: 'Main.java', type: 'file' }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { id: 'web-ide-py', name: 'web_ide.py', type: 'file' },
        ],
      },
      {
        id: 'resources',
        name: 'resources',
        type: 'folder',
        children: [{ id: 'yml', name: 'application.yml', type: 'file' }],
      },
    ],
  },
];

export const mockCode = `from pathlib import Path
from typing import Optional
from dataclasses import dataclass

@dataclass
class ProjectConfig:
    name: str
    language: str
    root: Path

def load_config(path: Path) -> Optional[ProjectConfig]:
    if not path.exists():
        return None
    return ProjectConfig(
        name="Web IDE Steam",
        language="python",
        root=path.parent,
    )`;

export const mockChatMessages: ChatMessage[] = [
  { id: '1', user: 'devDaeun', avatar: 'DE', message: 'main.tsx 리뷰 부탁드려요!', time: '2분 전' },
  { id: '2', user: '홍서진', avatar: 'HS', message: '네, 곧 확인할게요.', time: '5분 전', isMe: true },
  { id: '3', user: 'junho_dev', avatar: 'JH', message: '빌드 성공했습니다 🎉', time: '12분 전' },
  { id: '4', user: 'jisu_code', avatar: 'JS', message: '컨테이너 시작했어요', time: '1시간 전' },
];

export const mockComments: CodeComment[] = [
  { id: '1', file: 'web_ide.py', line: 9, user: 'devDaeun', avatar: 'DE', time: '10분 전', content: 'Optional 타입 대신 Union을 쓰는 게 어떨까요?' },
  { id: '2', file: 'web_ide.py', line: 14, user: 'junho_dev', avatar: 'JH', time: '25분 전', content: 'dataclass 필드에 default_factory 추가 필요해 보입니다.', resolved: true },
  { id: '3', file: 'web_ide.py', line: 22, user: '최하린', avatar: 'CH', time: '1시간 전', content: 'path.exists() 체크 후 예외 처리도 추가해 주세요.' },
  { id: '4', file: 'Main.java', line: 5, user: 'jisu_code', avatar: 'JS', time: '2시간 전', content: 'public class 네이밍 컨벤션 확인 부탁드립니다.' },
  { id: '5', file: 'web_ide.py', line: 3, user: '정유진', avatar: 'JY', time: '3시간 전', content: 'import 순서 정리해 주시면 좋겠습니다.' },
];

export const mockParticipants: Participant[] = [
  { id: '1', name: '홍서진 (나)', avatar: 'HS', role: 'owner', status: 'online', activity: 'main.py 편집 중' },
  { id: '2', name: '최하린', avatar: 'CH', role: 'editor', status: 'online', activity: 'metrics.py 보는 중' },
  { id: '3', name: '정유진', avatar: 'JY', role: 'viewer', status: 'offline', activity: '3일 전' },
  { id: '4', name: 'devDaeun', avatar: 'DE', role: 'editor', status: 'offline', activity: '1주 전' },
  { id: '5', name: 'junho_dev', avatar: 'JH', role: 'viewer', status: 'offline', activity: '2주 전' },
];

export const mockAdminUsers: AdminUser[] = [
  { id: 'user_0001', nickname: 'sif', email: 'sifheu@google.com', status: 'active', joinDate: '2026.04.02' },
  { id: 'user_0002', nickname: 'as12', email: 'as12@google.com', status: 'active', joinDate: '2026.04.02' },
  { id: 'user_0003', nickname: 'devjun', email: 'devjun@google.com', status: 'active', joinDate: '2026.03.15' },
  { id: 'user_0004', nickname: 'codekim', email: 'codekim@google.com', status: 'active', joinDate: '2026.02.28' },
  { id: 'user_0005', nickname: 'webdev', email: 'webdev@google.com', status: 'active', joinDate: '2026.01.10' },
  { id: 'user_0006', nickname: 'wakih12', email: 'wakih12@google.com', status: 'suspended', joinDate: '2026.04.02' },
  { id: 'user_0007', nickname: 'ideuser', email: 'ideuser@google.com', status: 'active', joinDate: '2025.12.01' },
  { id: 'user_0008', nickname: 'studio', email: 'studio@google.com', status: 'suspended', joinDate: '2025.11.20' },
];

export const mockSecurityEvents: SecurityEvent[] = [
  { id: '1', type: '로그인 실패', user: 'unknown@test.com', ip: '192.168.1.45', time: '2분 전', severity: 'high' },
  { id: '2', type: '권한 변경', user: 'admin@efide.com', ip: '10.0.0.12', time: '15분 전', severity: 'medium' },
  { id: '3', type: '비정상 접근 시도', user: 'wakih12@google.com', ip: '203.0.113.8', time: '1시간 전', severity: 'high' },
  { id: '4', type: '계정 정지', user: 'admin@efide.com', ip: '10.0.0.12', time: '2시간 전', severity: 'medium' },
  { id: '5', type: '로그인 성공', user: 'sifheu@google.com', ip: '172.16.0.5', time: '3시간 전', severity: 'low' },
];

export const mockProjectHistory: HistoryItem[] = [
  { id: '1', text: 'devDaeun님이 hong_gd를 초대했습니다', time: '2분 전' },
  { id: '2', text: 'junho_dev님이 components/ 폴더를 생성했습니다', time: '14분 전' },
  { id: '3', text: 'jisu_code님이 컨테이너를 시작했습니다', time: '1시간 전' },
  { id: '4', text: 'devDaeun님이 main.tsx를 수정했습니다', time: '2시간 전' },
];

export const mockDashboardHistory: HistoryItem[] = [
  { id: '1', text: 'devDaeun님이 hong_gd를 Team Alpha에 초대', time: '2분 전' },
  { id: '2', text: 'junho_dev님이 components/ 폴더 생성 (Web IDE Steam)', time: '14분 전' },
  { id: '3', text: 'jisu_code님이 컨테이너 시작 (api-gateway)', time: '1시간 전' },
  { id: '4', text: 'devDaeun님이 main.tsx 수정 (e-commerce-frontend)', time: '2시간 전' },
];

export const mockChatFeed = [
  { user: 'DE', text: 'devDaeun님이 e-commerce-frontend에 댓글을 남겼습니다', time: '2분 전' },
  { user: 'JH', text: 'junho_dev님이 Web IDE Steam에 메시지를 보냈습니다', time: '5분 전' },
  { user: 'JS', text: 'jisu_code님이 api-gateway에 멘션했습니다', time: '8분 전' },
  { user: 'MS', text: 'minsoo님이 metrics-dashboard에 댓글을 남겼습니다', time: '12분 전' },
  { user: 'HG', text: 'hong_gd님이 Team Alpha에 초대되었습니다', time: '15분 전' },
];

export const profileColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B',
];

export const authFeatures = [
  { title: '실시간 협업', desc: '코드 댓글과 프로젝트 채팅으로 한 화면에서 피드백을 주고받습니다.' },
  { title: '역할 기반 권한 관리', desc: 'Owner, Editor, Viewer, Admin 역할로 접근·편집 권한을 분리합니다.' },
  { title: '보안', desc: '비인가 접근, 로그인 실패, 권한 변경 이력을 기록·추적합니다.' },
];
