import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface FinancialInsightCardProps {
  transactions: Transaction[];
  budget: number;
}

export const FinancialInsightCard: React.FC<FinancialInsightCardProps> = ({
  transactions,
  budget,
}) => {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenseTransactions.reduce((s, t) => s + t.amount, 0);
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  // Group by category to find top expense
  const catMap: Record<string, { name: string; amount: number }> = {};
  expenseTransactions.forEach((t) => {
    if (!catMap[t.categoryId]) {
      catMap[t.categoryId] = { name: t.categoryName, amount: 0 };
    }
    catMap[t.categoryId].amount += t.amount;
  });

  const sorted = Object.values(catMap).sort((a, b) => b.amount - a.amount);
  const topCategory = sorted[0];

  let insightTitle = 'Trợ Lý Tài Chính AI';
  let insightText = 'Chưa có đủ dữ liệu giao dịch để phân tích xu hướng.';
  let badgeText = 'Đang học hỏi';
  let badgeColor = '#38BDF8';

  if (totalExpense > 0) {
    const percentSpent = budget > 0 ? (totalExpense / budget) * 100 : 0;
    const topPercent = topCategory ? (topCategory.amount / totalExpense) * 100 : 0;

    if (percentSpent > 100) {
      badgeText = 'Cảnh báo đỏ';
      badgeColor = '#EF4444';
      insightText = `Bạn đã chi vượt ngân sách ${formatCurrency(totalExpense - budget)}. Hãy giảm các khoản chi không cấp bách!`;
    } else if (topCategory && topPercent >= 40) {
      badgeText = 'Chi tiêu tập trung';
      badgeColor = '#F59E0B';
      insightText = `Khoản "${topCategory.name}" đang chiếm tới ${topPercent.toFixed(0)}% tổng chi. Cân đối lại danh mục này sẽ giúp bạn tiết kiệm thêm đáng kể.`;
    } else if (totalIncome > totalExpense) {
      badgeText = 'Tài chính khỏe mạnh';
      badgeColor = '#10B981';
      const savingsRate = Math.round(((totalIncome - totalExpense) / totalIncome) * 100);
      insightText = `Xuất sắc! Tỷ lệ tiết kiệm của bạn đạt ${savingsRate}%. Bạn đang có kỷ luật tài chính rất tốt trong tháng này.`;
    } else {
      badgeText = 'Ổn định';
      badgeColor = '#38BDF8';
      insightText = `Hạn mức còn lại là ${formatCurrency(Math.max(0, budget - totalExpense))}. Hãy duy trì kế hoạch chi tiêu hiện tại.`;
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E293B', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.topRow}>
          <View style={styles.titleGroup}>
            <View style={styles.sparkleIcon}>
              <Ionicons name="sparkles" size={14} color="#38BDF8" />
            </View>
            <Text style={styles.title}>{insightTitle}</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: `${badgeColor}20` }]}>
            <View style={[styles.badgeDot, { backgroundColor: badgeColor }]} />
            <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
          </View>
        </View>

        <Text style={styles.contentText}>{insightText}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  gradient: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sparkleIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  contentText: {
    fontSize: 12.5,
    color: '#CBD5E1',
    lineHeight: 18,
  },
});
