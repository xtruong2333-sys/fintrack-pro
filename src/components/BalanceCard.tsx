import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCounter } from './AnimatedCounter';

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
  isDark?: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, income, expense, isDark = true }) => {
  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={isDark ? ['#1E293B', '#0A0F1D'] : ['#1E293B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* Subtle decorative circles */}
        <View style={styles.decorCircle} />
        <View style={styles.decorCircleSmall} />

        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.balanceLabel}>Tổng Tài Sản Khả Dụng</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={13} color="#38BDF8" />
            <Text style={styles.badgeText}>FinTrack Pro</Text>
          </View>
        </View>

        {/* Animated Counter for Balance */}
        <AnimatedCounter
          value={balance}
          style={[styles.balanceAmount, balance < 0 ? styles.negativeBalance : {}]}
        />

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(52, 211, 153, 0.18)' }]}>
              <Ionicons name="arrow-down" size={16} color="#34D399" />
            </View>
            <View style={styles.summaryTextGroup}>
              <Text style={styles.summaryLabel}>Tổng Thu</Text>
              <AnimatedCounter
                value={income}
                prefix="+"
                style={styles.incomeAmount}
              />
            </View>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.summaryItem}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(248, 113, 113, 0.18)' }]}>
              <Ionicons name="arrow-up" size={16} color="#F87171" />
            </View>
            <View style={styles.summaryTextGroup}>
              <Text style={styles.summaryLabel}>Tổng Chi</Text>
              <AnimatedCounter
                value={expense}
                prefix="-"
                style={styles.expenseAmount}
              />
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  gradientContainer: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorCircle: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(56, 189, 248, 0.06)',
  },
  decorCircleSmall: {
    position: 'absolute',
    left: -20,
    bottom: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94A3B8',
    letterSpacing: 0.3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
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
