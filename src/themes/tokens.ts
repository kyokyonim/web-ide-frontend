import type { DesignStyle } from '../types';

export interface ThemeTokens {
  pageBg: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  primary: string;
  primaryHover: string;
  danger: string;
  dangerBg: string;
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  sidebar: string;
  topbar: string;
  card: string;
  cardHover: string;
  input: string;
  modal: string;
  overlay: string;
  badgeOwner: string;
  badgeEditor: string;
  badgeViewer: string;
  editorBg: string;
  editorGutter: string;
  activityBar: string;
  radius: string;
  radiusLg: string;
  shadow: string;
  shadowLg: string;
  fontMono: string;
}

const minimal: ThemeTokens = {
  pageBg: 'bg-white',
  surface: 'bg-white',
  surfaceMuted: 'bg-[#F6F8FA]',
  border: 'border-[#D0D7DE]',
  borderStrong: 'border-[#AFBAC4]',
  text: 'text-[#1F2328]',
  textMuted: 'text-[#656D76]',
  textSubtle: 'text-[#8C959F]',
  primary: 'bg-[#0969DA] text-white',
  primaryHover: 'hover:bg-[#0860CA]',
  danger: 'text-red-600 border-red-300',
  dangerBg: 'bg-red-50 border-red-200',
  success: 'text-green-700',
  successBg: 'bg-green-50 text-green-700 border-green-200',
  warning: 'text-amber-700',
  warningBg: 'bg-amber-50 text-amber-800 border-amber-200',
  sidebar: 'bg-slate-50 border-slate-200',
  topbar: 'bg-white border-slate-200',
  card: 'bg-white border border-slate-200 rounded-sm',
  cardHover: 'hover:border-slate-300',
  input: 'bg-white border-slate-300 rounded-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
  modal: 'bg-white border border-slate-200 rounded-sm shadow-lg',
  overlay: 'bg-black/40',
  badgeOwner: 'bg-blue-100 text-blue-800 border-blue-200',
  badgeEditor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  badgeViewer: 'bg-slate-100 text-slate-700 border-slate-200',
  editorBg: 'bg-white',
  editorGutter: 'bg-slate-50 text-slate-400 border-slate-200',
  activityBar: 'bg-slate-100 border-slate-200',
  radius: 'rounded-sm',
  radiusLg: 'rounded-sm',
  shadow: '',
  shadowLg: 'shadow-lg',
  fontMono: 'font-mono-editor',
};

const saas: ThemeTokens = {
  pageBg: 'bg-[#F8FAFC]',
  surface: 'bg-white',
  surfaceMuted: 'bg-slate-50/80',
  border: 'border-slate-200/80',
  borderStrong: 'border-slate-200',
  text: 'text-slate-900',
  textMuted: 'text-slate-600',
  textSubtle: 'text-slate-400',
  primary: 'bg-[#4F46E5] text-white shadow-sm',
  primaryHover: 'hover:bg-[#4338CA] hover:shadow-md',
  danger: 'text-red-600',
  dangerBg: 'bg-red-50 border-red-100',
  success: 'text-emerald-700',
  successBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'text-amber-700',
  warningBg: 'bg-amber-50 text-amber-800 border-amber-100',
  sidebar: 'bg-white border-slate-200 shadow-sm',
  topbar: 'bg-white/90 backdrop-blur border-slate-200 shadow-sm',
  card: 'bg-white border border-slate-100 rounded-xl shadow-sm',
  cardHover: 'hover:shadow-md hover:border-indigo-100',
  input: 'bg-white border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400',
  modal: 'bg-white rounded-2xl shadow-2xl border border-slate-100',
  overlay: 'bg-slate-900/30 backdrop-blur-sm',
  badgeOwner: 'bg-indigo-100 text-indigo-700',
  badgeEditor: 'bg-teal-100 text-teal-700',
  badgeViewer: 'bg-slate-100 text-slate-600',
  editorBg: 'bg-white',
  editorGutter: 'bg-slate-50 text-slate-400',
  activityBar: 'bg-white border-slate-200 rounded-xl shadow-sm m-2',
  radius: 'rounded-lg',
  radiusLg: 'rounded-xl',
  shadow: 'shadow-sm',
  shadowLg: 'shadow-xl',
  fontMono: 'font-mono-editor',
};

const dark: ThemeTokens = {
  pageBg: 'bg-[#1e1e1e]',
  surface: 'bg-[#252526]',
  surfaceMuted: 'bg-[#2d2d30]',
  border: 'border-[#3e3e42]',
  borderStrong: 'border-[#454545]',
  text: 'text-[#cccccc]',
  textMuted: 'text-[#9d9d9d]',
  textSubtle: 'text-[#6e6e6e]',
  primary: 'bg-[#0e639c] text-white',
  primaryHover: 'hover:bg-[#1177bb]',
  danger: 'text-[#f48771]',
  dangerBg: 'bg-[#3a1f1f] border-[#5a2a2a]',
  success: 'text-[#4ec9b0]',
  successBg: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'text-[#dcdcaa]',
  warningBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  sidebar: 'bg-[#252526] border-[#3e3e42]',
  topbar: 'bg-[#323233] border-[#3e3e42]',
  card: 'bg-[#252526] border border-[#3e3e42] rounded-md',
  cardHover: 'hover:bg-[#2a2d2e]',
  input: 'bg-[#3c3c3c] border-[#3e3e42] text-[#cccccc] rounded-sm focus:border-[#007acc] focus:ring-1 focus:ring-[#007acc]',
  modal: 'bg-[#252526] border border-[#3e3e42] rounded-md shadow-2xl',
  overlay: 'bg-black/60',
  badgeOwner: 'bg-blue-500/20 text-blue-300',
  badgeEditor: 'bg-green-500/20 text-green-400',
  badgeViewer: 'bg-slate-500/20 text-slate-300',
  editorBg: 'bg-[#1e1e1e]',
  editorGutter: 'bg-[#1e1e1e] text-[#858585] border-[#3e3e42]',
  activityBar: 'bg-[#333333] border-[#3e3e42]',
  radius: 'rounded-sm',
  radiusLg: 'rounded-md',
  shadow: '',
  shadowLg: 'shadow-2xl',
  fontMono: 'font-mono-editor',
};

export const themes: Record<DesignStyle, ThemeTokens> = { minimal, saas, dark };

export function getTheme(style: DesignStyle): ThemeTokens {
  return themes[style];
}

export function roleBadgeClass(style: DesignStyle, role: string): string {
  const t = themes[style];
  if (role === 'owner') return t.badgeOwner;
  if (role === 'editor') return t.badgeEditor;
  return t.badgeViewer;
}
