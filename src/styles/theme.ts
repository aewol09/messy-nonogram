import { colors } from './colors';

export const getTheme = (isDark: boolean) => ({
  primary: colors.primary,
  secondary: colors.secondary,
  background: isDark ? '#0F172A' : '#F8FAFC',
  card: isDark ? '#1E293B' : '#FFFFFF',
  text: isDark ? '#F8FAFC' : '#1E293B',
  subText: isDark ? '#94A3B8' : '#64748B',
  border: isDark ? '#334155' : '#E2E8F0',
  white: '#FFFFFF',
  
  indigo: colors.indigo,
  purple: colors.purple,
  slate: colors.slate,
  amber: colors.amber,
  rose: colors.rose,
  emerald: colors.emerald,
  orange: colors.orange,
  green: colors.green,
  blue: colors.blue,
});
