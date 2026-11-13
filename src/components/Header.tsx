import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatFullDate, getTodayString } from '../utils/formatters';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightAction,
  rightIcon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.dateText}>{subtitle || formatFullDate(getTodayString())}</Text>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      {rightAction && rightIcon && (
        <TouchableOpacity style={styles.iconButton} onPress={rightAction} activeOpacity={0.7}>
          <Ionicons name={rightIcon} size={22} color="#1E293B" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  textContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});
