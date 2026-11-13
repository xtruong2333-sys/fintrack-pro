import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction, ThemeMode } from '../types';
import { Header } from '../components/Header';
import { TransactionItem } from '../components/TransactionItem';
import { formatCurrency } from '../utils/formatters';
import { exportTransactionsToCSV } from '../utils/csvExporter';

interface HistoryScreenProps {
  transactions: Transaction[];
  theme: ThemeMode;
  onToggleTheme: () => void;
  onDeleteTransaction: (id: string) => void;
  onOpenAddModal: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  transactions,
  theme,
  onToggleTheme,
  onDeleteTransaction,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const isDark = theme === 'dark';

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch =
      t.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.walletName && t.walletName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const totalFilteredExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const totalFilteredIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0B0F19' : '#F8FAFC' }]}>
      <Header
        title="Lịch Sử"
        subtitle="Quản lý giao dịch"
        theme={theme}
        onToggleTheme={onToggleTheme}
        rightIcon="download-outline"
        rightAction={() => exportTransactionsToCSV(transactions)}
      />

      {/* Search Input Bar */}
      <View style={styles.searchBoxContainer}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: isDark ? '#151D2F' : '#FFFFFF',
              borderColor: isDark ? '#23304A' : '#E2E8F0',
            },
          ]}
        >
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
            placeholder="Tìm theo ghi chú, danh mục, ví..."
            placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs & Export Button */}
      <View style={styles.filterRow}>
        <View style={styles.chipsGroup}>
          {(['all', 'expense', 'income'] as const).map((type) => {
            const labels = { all: 'Tất cả', expense: 'Khoản chi', income: 'Khoản thu' };
            const isSelected = filterType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected
                      ? isDark ? '#38BDF8' : '#0F172A'
                      : isDark ? '#151D2F' : '#FFFFFF',
                    borderColor: isSelected
                      ? isDark ? '#38BDF8' : '#0F172A'
                      : isDark ? '#23304A' : '#E2E8F0',
                  },
                ]}
                onPress={() => setFilterType(type)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isSelected
                        ? isDark ? '#0F172A' : '#FFFFFF'
                        : isDark ? '#94A3B8' : '#64748B',
                    },
                    isSelected && { fontWeight: '700' },
                  ]}
                >
                  {labels[type]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.exportBtn,
            {
              backgroundColor: isDark ? '#1E293B' : '#EFF6FF',
              borderColor: isDark ? '#334155' : '#BFDBFE',
            },
          ]}
          onPress={() => exportTransactionsToCSV(transactions)}
        >
          <Ionicons name="document-text-outline" size={14} color="#38BDF8" />
          <Text style={styles.exportBtnText}>Excel</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Badge */}
      <View style={styles.summaryBar}>
        <Text
          style={[styles.summaryCountText, { color: isDark ? '#94A3B8' : '#64748B' }]}
          numberOfLines={1}
        >
          {filteredTransactions.length} giao dịch
        </Text>
        <View style={styles.summaryAmounts}>
          {filterType !== 'income' && (
            <Text style={styles.expenseSummary} numberOfLines={1}>
              -{formatCurrency(totalFilteredExpense)}
            </Text>
          )}
          {filterType !== 'expense' && (
            <Text style={styles.incomeSummary} numberOfLines={1}>
              +{formatCurrency(totalFilteredIncome)}
            </Text>
          )}
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={44} color={isDark ? '#334155' : '#CBD5E1'} />
            <Text style={[styles.emptyText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
              Không tìm thấy giao dịch nào phù hợp
            </Text>
          </View>
        ) : (
          filteredTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onDelete={onDeleteTransaction}
              isDark={isDark}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBoxContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  chipsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  exportBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#38BDF8',
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  summaryCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryAmounts: {
    flexDirection: 'row',
    gap: 8,
  },
  expenseSummary: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F87171',
  },
  incomeSummary: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34D399',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
});
