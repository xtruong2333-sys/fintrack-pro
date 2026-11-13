import { ThemeMode } from '../types';

export interface ThemeColors {
  background: string;
  card: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  income: string;
  incomeBg: string;
  expense: string;
  expenseBg: string;
  tabBar: string;
  tabBorder: string;
  inputBg: string;
  divider: string;
  phoneChassis: string;
  phoneBorder: string;
}

export const LIGHT_THEME: ThemeColors = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#2563EB',
  primaryLight: '#EFF6FF',
  income: '#10B981',
  incomeBg: 'rgba(16, 185, 129, 0.12)',
  expense: '#EF4444',
  expenseBg: 'rgba(239, 68, 68, 0.12)',
  tabBar: '#FFFFFF',
  tabBorder: '#F1F5F9',
  inputBg: '#F8FAFC',
  divider: '#F1F5F9',
  phoneChassis: '#1E293B',
  phoneBorder: '#475569',
};

export const DARK_THEME: ThemeColors = {
  background: '#0B0F19',
  card: '#151D2F',
  cardBorder: '#23304A',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  primary: '#3B82F6',
  primaryLight: 'rgba(59, 130, 246, 0.16)',
  income: '#34D399',
  incomeBg: 'rgba(52, 211, 153, 0.15)',
  expense: '#F87171',
  expenseBg: 'rgba(248, 113, 113, 0.15)',
  tabBar: '#111827',
  tabBorder: '#1F2937',
  inputBg: '#1E293B',
  divider: '#1F2937',
  phoneChassis: '#030712',
  phoneBorder: '#1E293B',
};

export const getTheme = (mode: ThemeMode): ThemeColors => {
  return mode === 'dark' ? DARK_THEME : LIGHT_THEME;
};
