import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/formatters';

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, income, expense }) => {
  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={['#1E293B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* Decorative background circle */}
        <View style={styles.decorCircle} />

        <View style={styles.headerRow}>
          <Text style={styles.balanceLabel}>Số Dư Tài Chính</Text>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={13} color="#10B981" />
            <Text style={styles.badgeText}>Bảo mật</Text>
          </View>
        </View>

        <Text style={[styles.balanceAmount, balance < 0 && styles.negativeBalance]}>
          {formatCurrency(balance)}
        </Text>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.18)' }]}>
              <Ionicons name="arrow-down" size={16} color="#10B981" />
            </View>
            <View style={styles.summaryTextGroup}>
              <Text style={styles.summaryLabel}>Tổng Thu</Text>
              <Text style={styles.incomeAmount}>+{formatCurrency(income)}</Text>
            </View>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.summaryItem}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.18)' }]}>
              <Ionicons name="arrow-up" size={16} color="#EF4444" />
            </View>
            <View style={styles.summaryTextGroup}>
              <Text style={styles.summaryLabel}>Tổng Chi</Text>
              <Text style={styles.expenseAmount}>-{formatCurrency(expense)}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  gradientContainer: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircle: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    marginVertical: 6,
  },
  negativeBalance: {
    color: '#F87171',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  verticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTextGroup: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 2,
  },
  incomeAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#34D399',
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F87171',
  },
});
