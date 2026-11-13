import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction, WalletType, ThemeMode, RecurringBill, SavingsGoal } from '../types';
import { Header } from '../components/Header';
import { BalanceCard } from '../components/BalanceCard';
import { BudgetProgress } from '../components/BudgetProgress';
import { WalletSelector } from '../components/WalletSelector';
import { FinancialInsightCard } from '../components/FinancialInsightCard';
import { RecurringBillsSection } from '../components/RecurringBillsSection';
import { SavingsGoalsSection } from '../components/SavingsGoalsSection';
import { TransactionItem } from '../components/TransactionItem';

interface HomeScreenProps {
  transactions: Transaction[];
  recurringBills: RecurringBill[];
  savingsGoals: SavingsGoal[];
  budget: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenAddModal: () => void;
  onOpenAddBillModal: () => void;
  onOpenAddGoalModal: () => void;
  onPayBill: (billId: string) => void;
  onDeleteBill: (billId: string) => void;
  onDepositGoal: (goalId: string, amount: number) => void;
  onDeleteGoal: (goalId: string) => void;
  onDeleteTransaction: (id: string) => void;
  onViewReceipt: (transaction: Transaction) => void;
  onNavigateToHistory: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  transactions,
  recurringBills,
  savingsGoals,
  budget,
  theme,
  onToggleTheme,
  onOpenAddModal,
  onOpenAddBillModal,
  onOpenAddGoalModal,
  onPayBill,
  onDeleteBill,
  onDepositGoal,
  onDeleteGoal,
  onDeleteTransaction,
  onViewReceipt,
  onNavigateToHistory,
  onRefresh,
  refreshing,
}) => {
  const [selectedWallet, setSelectedWallet] = useState<WalletType | 'all'>('all');
  const isDark = theme === 'dark';

  const displayTransactions =
    selectedWallet === 'all'
      ? transactions
      : transactions.filter((t) => t.walletId === selectedWallet);

  const income = displayTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = displayTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;
  const recentTransactions = displayTransactions.slice(0, 5);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0B0F19' : '#F8FAFC' }]}>
      <Header
        title="FinTrack Pro"
        subtitle="Tổng quan tài sản"
        showLogo
        theme={theme}
        onToggleTheme={onToggleTheme}
        rightIcon="add"
        rightAction={onOpenAddModal}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38BDF8" />}
      >
        {/* Balance Card */}
        <BalanceCard balance={balance} income={income} expense={expense} isDark={isDark} />

        {/* AI Financial Insight Banner */}
        <FinancialInsightCard transactions={transactions} budget={budget} />

        {/* Multi-Wallet Selector */}
        <WalletSelector
          transactions={transactions}
          selectedWallet={selectedWallet}
          onSelectWallet={setSelectedWallet}
          isDark={isDark}
        />

        {/* Budget Progress Bar */}
        <BudgetProgress spent={expense} budget={budget} isDark={isDark} />

        {/* MỤC 2: Hóa Đơn & Đăng Ký Định Kỳ */}
        <RecurringBillsSection
          bills={recurringBills}
          onPayBill={onPayBill}
          onOpenAddModal={onOpenAddBillModal}
          onDeleteBill={onDeleteBill}
          isDark={isDark}
        />

        {/* MỤC 1: Hũ Tiết Kiệm & Mục Tiêu */}
        <SavingsGoalsSection
          goals={savingsGoals}
          onDeposit={onDepositGoal}
          onOpenAddModal={onOpenAddGoalModal}
          onDeleteGoal={onDeleteGoal}
          isDark={isDark}
        />

        {/* Quick Add Action Banner */}
        <TouchableOpacity
          style={[
            styles.quickAddBanner,
            {
              backgroundColor: isDark ? '#151D2F' : '#EFF6FF',
              borderColor: isDark ? '#23304A' : '#DBEAFE',
            },
          ]}
          onPress={onOpenAddModal}
          activeOpacity={0.8}
        >
          <View style={styles.bannerLeft}>
            <View
              style={[
                styles.bannerIcon,
                { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
              ]}
            >
              <Ionicons name="receipt" size={20} color="#38BDF8" />
            </View>
            <View>
              <Text style={[styles.bannerTitle, { color: isDark ? '#F8FAFC' : '#1E40AF' }]}>
                Ghi chép giao dịch mới
              </Text>
              <Text style={[styles.bannerSubtitle, { color: isDark ? '#94A3B8' : '#3B82F6' }]}>
                Kèm ảnh bill & chọn nguồn ví tức thì
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#64748B" />
        </TouchableOpacity>

        {/* Recent Transactions Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Giao Dịch Gần Đây
          </Text>
          {displayTransactions.length > 0 && (
            <TouchableOpacity onPress={onNavigateToHistory}>
              <Text style={styles.seeAllText}>Xem tất cả ({displayTransactions.length})</Text>
            </TouchableOpacity>
          )}
        </View>

        {recentTransactions.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: isDark ? '#151D2F' : '#FFFFFF',
                borderColor: isDark ? '#23304A' : '#E2E8F0',
              },
            ]}
          >
            <Ionicons name="file-tray-outline" size={40} color={isDark ? '#334155' : '#CBD5E1'} />
            <Text style={[styles.emptyTitle, { color: isDark ? '#F8FAFC' : '#475569' }]}>
              Chưa có giao dịch trong ví này
            </Text>
            <Text style={[styles.emptyDesc, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Bấm dấu (+) hoặc nút bên dưới để ghi nhận giao dịch đầu tiên.
            </Text>
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
                onViewReceipt={onViewReceipt}
                isDark={isDark}
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
  },
  scrollContent: {
    paddingBottom: 110,
  },
  quickAddBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  bannerSubtitle: {
    fontSize: 11,
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
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
  },
  transactionsList: {
    paddingHorizontal: 20,
  },
  emptyCard: {
    marginHorizontal: 20,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 12.5,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
