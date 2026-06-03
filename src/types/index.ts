export type DesignStyle = 'minimal' | 'saas' | 'dark';

export type ColorMode = 'light' | 'dark';

export type UserRole = 'owner' | 'editor' | 'viewer';

export type AccountStatus = 'active' | 'suspended';

export interface Project {
  id: string;
  name: string;
  role: UserRole;
  participants: number;
  lastModified: string;
  languages: string[];
}

export interface ProjectMember {
  name: string;
  email: string;
  role: UserRole;
  inviteStatus: string;
  accountStatus: AccountStatus;
  isMe?: boolean;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  path: string
  children?: FileNode[];
}

export interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  time: string;
  isMe?: boolean;
}

export interface CodeComment {
  id: string;
  file: string;
  line: number;
  user: string;
  avatar: string;
  time: string;
  content: string;
  resolved?: boolean;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  status: 'online' | 'offline';
  activity?: string;
}

export interface AdminUser {
  id: string;
  nickname: string;
  email: string;
  status: AccountStatus;
  joinDate: string;
}

export interface SecurityEvent {
  id: string;
  type: string;
  user: string;
  ip: string;
  time: string;
  severity: 'low' | 'medium' | 'high';
}

export interface HistoryItem {
  id: string;
  text: string;
  time: string;
}
