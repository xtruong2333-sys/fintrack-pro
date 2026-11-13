import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/formatters';

interface BudgetProgressProps {
  spent: number;
  budget: number;
  isDark?: boolean;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({ spent, budget, isDark = true }) => {
  const percent = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
  const remaining = budget - spent;
  const isOverBudget = remaining < 0;

  const getProgressColor = () => {
    if (percent >= 90) return '#EF4444';
    if (percent >= 70) return '#F59E0B';
    return '#10B981';
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#151D2F' : '#FFFFFF',
          borderColor: isDark ? '#23304A' : '#E2E8F0',
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="pie-chart" size={15} color={isDark ? '#38BDF8' : '#2563EB'} />
          <Text style={[styles.title, { color: isDark ? '#F8FAFC' : '#475569' }]}>
            Hạn Mức Tháng Này
          </Text>
        </View>
        <Text style={[styles.percentBadge, { color: getProgressColor() }]}>
          {percent}%
        </Text>
      </View>

      <View
        style={[
          styles.progressBarBackground,
          { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
        ]}
      >
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${percent}%`,
              backgroundColor: getProgressColor(),
            },
          ]}
        />
      </View>

      <View style={styles.bottomRow}>
        <Text style={[styles.spentText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
          Đã tiêu: <Text style={{ color: isDark ? '#F8FAFC' : '#1E293B', fontWeight: '700' }}>{formatCurrency(spent)}</Text>
        </Text>
        <Text style={[styles.remainingText, isOverBudget && styles.overBudgetText]}>
          {isOverBudget ? `Vượt: ${formatCurrency(Math.abs(remaining))}` : `Còn lại: ${formatCurrency(remaining)}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  percentBadge: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressBarBackground: {
    height: 9,
    borderRadius: 4.5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4.5,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spentText: {
    fontSize: 12,
  },
  remainingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34D399',
  },
  overBudgetText: {
    color: '#F87171',
  },
});
