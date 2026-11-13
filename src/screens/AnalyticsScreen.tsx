import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { Header } from '../components/Header';
import { CategoryPieChart } from '../components/CategoryPieChart';
import { formatCurrency } from '../utils/formatters';

interface AnalyticsScreenProps {
  transactions: Transaction[];
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<'expense' | 'income'>('expense');

  // Lọc theo loại (Chi tiêu hoặc Thu nhập)
  const filtered = transactions.filter((t) => t.type === filterType);
  const totalAmount = filtered.reduce((sum, t) => sum + t.amount, 0);

  // Nhóm theo danh mục
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

  // Tính tỷ lệ tiết kiệm tổng quan
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

  return (
    <View style={styles.container}>
      <Header title="Thống Kê" subtitle="Phân tích chi tiêu" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Type Toggle */}
        <View style={styles.tabContainer}>
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
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Tỷ Lệ Tiết Kiệm</Text>
            <Text style={[styles.statValue, { color: savingsRate >= 20 ? '#10B981' : '#F59E0B' }]}>
              {savingsRate}%
            </Text>
            <Text style={styles.statDesc}>
              {savingsRate >= 20 ? 'Tài chính khỏe mạnh' : 'Cần thắt chặt chi tiêu'}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>
              {filterType === 'expense' ? 'Khoản Chi Lớn Nhất' : 'Nguồn Thu Lớn Nhất'}
            </Text>
            <Text style={styles.statValue} numberOfLines={1}>
              {topCategory ? topCategory.name : '—'}
            </Text>
            <Text style={styles.statDesc}>
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
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  statDesc: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
