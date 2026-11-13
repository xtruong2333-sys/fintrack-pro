import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/formatters';

interface BudgetProgressProps {
  spent: number;
  budget: number;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({ spent, budget }) => {
  const percent = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
  const remaining = budget - spent;
  const isOverBudget = remaining < 0;

  const getProgressColor = () => {
    if (percent >= 90) return '#EF4444';
    if (percent >= 70) return '#F59E0B';
    return '#10B981';
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="pie-chart" size={16} color="#64748B" />
          <Text style={styles.title}>Hạn Mức Tháng Này</Text>
        </View>
        <Text style={[styles.percentBadge, { color: getProgressColor() }]}>
          {percent}%
        </Text>
      </View>

      <View style={styles.progressBarBackground}>
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
        <Text style={styles.spentText}>
          Đã tiêu: <Text style={styles.boldText}>{formatCurrency(spent)}</Text>
        </Text>
        <Text style={[styles.remainingText, isOverBudget && styles.overBudgetText]}>
          {isOverBudget ? `Vượt: ${formatCurrency(Math.abs(remaining))}` : `Còn: ${formatCurrency(remaining)}`}
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
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
    fontWeight: '600',
    color: '#475569',
  },
  percentBadge: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spentText: {
    fontSize: 12,
    color: '#64748B',
  },
  boldText: {
    fontWeight: '600',
    color: '#1E293B',
  },
  remainingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  overBudgetText: {
    color: '#EF4444',
  },
});
