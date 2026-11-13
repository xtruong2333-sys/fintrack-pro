import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { Header } from '../components/Header';
import { BalanceCard } from '../components/BalanceCard';
import { BudgetProgress } from '../components/BudgetProgress';
import { TransactionItem } from '../components/TransactionItem';

interface HomeScreenProps {
  transactions: Transaction[];
  budget: number;
  onOpenAddModal: () => void;
  onDeleteTransaction: (id: string) => void;
  onNavigateToHistory: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  transactions,
  budget,
  onOpenAddModal,
  onDeleteTransaction,
  onNavigateToHistory,
  onRefresh,
  refreshing,
}) => {
  // Tính tổng thu, tổng chi, số dư
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <View style={styles.container}>
      <Header
        title="Sổ Thu Chi"
        rightIcon="add"
        rightAction={onOpenAddModal}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />}
      >
        {/* Balance Card */}
        <BalanceCard balance={balance} income={income} expense={expense} />

        {/* Budget Progress Bar */}
        <BudgetProgress spent={expense} budget={budget} />

        {/* Quick Add Floating Banner */}
        <TouchableOpacity style={styles.quickAddBanner} onPress={onOpenAddModal} activeOpacity={0.8}>
          <View style={styles.bannerLeft}>
            <View style={styles.bannerIcon}>
              <Ionicons name="receipt" size={20} color="#3B82F6" />
            </View>
            <View>
              <Text style={styles.bannerTitle}>Ghi chép giao dịch mới</Text>
              <Text style={styles.bannerSubtitle}>Thêm khoản chi tiêu hoặc thu nhập ngay</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* Recent Transactions Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Giao Dịch Gần Đây</Text>
          {transactions.length > 0 && (
            <TouchableOpacity onPress={onNavigateToHistory}>
              <Text style={styles.seeAllText}>Xem tất cả ({transactions.length})</Text>
            </TouchableOpacity>
          )}
        </View>

        {recentTransactions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="file-tray-outline" size={40} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Chưa có giao dịch nào</Text>
            <Text style={styles.emptyDesc}>Bấm dấu (+) phía trên hoặc nút bên dưới để thêm giao dịch đầu tiên.</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={onOpenAddModal}>
              <Text style={styles.emptyButtonText}>+ Thêm giao dịch</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.transactionsList}>
            {recentTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onDelete={onDeleteTransaction}
              />
            ))}
          </View>
        )}
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
  quickAddBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  bannerSubtitle: {
    fontSize: 11,
    color: '#3B82F6',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  transactionsList: {
    paddingHorizontal: 20,
  },
  emptyCard: {
    marginHorizontal: 20,
    padding: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  emptyButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
