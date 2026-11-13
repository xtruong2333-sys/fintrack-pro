import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction, ThemeMode } from '../types';
import { Header } from '../components/Header';
import { CategoryPieChart } from '../components/CategoryPieChart';

interface AnalyticsScreenProps {
  transactions: Transaction[];
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  transactions,
  theme,
  onToggleTheme,
}) => {
  const [filterType, setFilterType] = useState<'expense' | 'income'>('expense');
  const isDark = theme === 'dark';

  const filtered = transactions.filter((t) => t.type === filterType);
  const totalAmount = filtered.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap = new Map<string, { id: string; name: string; amount: number; color: string; icon: string }>();

  filtered.forEach((tx) => {
    const existing = categoryMap.get(tx.categoryId);
    if (existing) {
      existing.amount += tx.amount;
    } else {
      categoryMap.set(tx.categoryId, {
        id: tx.categoryId,
        name: tx.categoryName,
        amount: tx.amount,
        color: tx.categoryColor,
        icon: tx.categoryIcon,
      });
    }
  });

  const categoryList = Array.from(categoryMap.values())
    .map((item) => ({
      ...item,
      percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categoryList.length > 0 ? categoryList[0] : null;

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0B0F19' : '#F8FAFC' }]}>
      <Header
        title="Thống Kê"
        subtitle="Báo cáo phân tích"
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Type Toggle */}
        <View
          style={[
            styles.tabContainer,
            {
              backgroundColor: isDark ? '#151D2F' : '#FFFFFF',
              borderColor: isDark ? '#23304A' : '#E2E8F0',
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.tabButton, filterType === 'expense' && styles.tabExpenseActive]}
            onPress={() => setFilterType('expense')}
          >
            <Ionicons name="arrow-up-circle" size={16} color={filterType === 'expense' ? '#FFFFFF' : '#EF4444'} />
            <Text style={[styles.tabText, filterType === 'expense' && styles.tabTextActive]}>
              Phân Tích Chi Tiêu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, filterType === 'income' && styles.tabIncomeActive]}
            onPress={() => setFilterType('income')}
          >
            <Ionicons name="arrow-down-circle" size={16} color={filterType === 'income' ? '#FFFFFF' : '#10B981'} />
            <Text style={[styles.tabText, filterType === 'income' && styles.tabTextActive]}>
              Phân Tích Thu Nhập
            </Text>
          </TouchableOpacity>
        </View>

        {/* Insight Quick Cards */}
        <View style={styles.statsGrid}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: isDark ? '#151D2F' : '#FFFFFF',
                borderColor: isDark ? '#23304A' : '#E2E8F0',
              },
            ]}
          >
            <Text style={[styles.statLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Tỷ Lệ Tiết Kiệm
            </Text>
            <Text style={[styles.statValue, { color: savingsRate >= 20 ? '#34D399' : '#F59E0B' }]}>
              {savingsRate}%
            </Text>
            <Text style={[styles.statDesc, { color: isDark ? '#64748B' : '#94A3B8' }]}>
              {savingsRate >= 20 ? 'Tài chính khỏe mạnh' : 'Cần thắt chặt chi tiêu'}
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: isDark ? '#151D2F' : '#FFFFFF',
                borderColor: isDark ? '#23304A' : '#E2E8F0',
              },
            ]}
          >
            <Text style={[styles.statLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {filterType === 'expense' ? 'Khoản Chi Lớn Nhất' : 'Nguồn Thu Lớn Nhất'}
            </Text>
            <Text
              style={[styles.statValue, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
              numberOfLines={1}
            >
              {topCategory ? topCategory.name : '—'}
            </Text>
            <Text style={[styles.statDesc, { color: isDark ? '#64748B' : '#94A3B8' }]}>
              {topCategory ? `${topCategory.percentage.toFixed(0)}% tổng số` : 'Chưa có dữ liệu'}
            </Text>
          </View>
        </View>

        {/* Donut Chart & Breakdown */}
        <CategoryPieChart
          data={categoryList}
          totalAmount={totalAmount}
          title={filterType === 'expense' ? 'Tỷ Lệ Chi Tiêu Theo Danh Mục' : 'Tỷ Lệ Nguồn Thu'}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 11,
    gap: 6,
  },
  tabExpenseActive: {
    backgroundColor: '#EF4444',
  },
  tabIncomeActive: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statDesc: {
    fontSize: 11,
  },
});
