import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppLogo } from './AppLogo';
import { ThemeMode } from '../types';
import { formatFullDate, getTodayString } from '../utils/formatters';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  showLogo?: boolean;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightAction,
  rightIcon,
  showLogo = false,
  theme = 'dark',
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showLogo && (
          <View style={styles.logoMargin}>
            <AppLogo size={36} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text
            style={[styles.dateText, { color: isDark ? '#38BDF8' : '#2563EB' }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {subtitle || formatFullDate(getTodayString())}
          </Text>
          <Text
            style={[styles.titleText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        {onToggleTheme && (
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                backgroundColor: isDark ? '#151D2F' : '#F1F5F9',
                borderColor: isDark ? '#23304A' : '#E2E8F0',
              },
            ]}
            onPress={onToggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={isDark ? '#F59E0B' : '#0F172A'}
            />
          </TouchableOpacity>
        )}

        {rightAction && rightIcon && (
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                backgroundColor: isDark ? '#151D2F' : '#F1F5F9',
                borderColor: isDark ? '#23304A' : '#E2E8F0',
              },
            ]}
            onPress={rightAction}
            activeOpacity={0.7}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={isDark ? '#F8FAFC' : '#0F172A'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    minHeight: 64,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  logoMargin: {
    marginRight: 10,
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
