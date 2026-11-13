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
import { Transaction } from '../types';
import { Header } from '../components/Header';
import { TransactionItem } from '../components/TransactionItem';
import { formatCurrency } from '../utils/formatters';

interface HistoryScreenProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onOpenAddModal: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  transactions,
  onDeleteTransaction,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch =
      t.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalFilteredExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const totalFilteredIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <View style={styles.container}>
      <Header
        title="Lịch Sử"
        subtitle="Danh sách giao dịch"
        rightIcon="add"
        rightAction={onOpenAddModal}
      />

      {/* Search Input Bar */}
      <View style={styles.searchBoxContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo ghi chú hoặc danh mục..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'expense', 'income'] as const).map((type) => {
          const labels = { all: 'Tất cả', expense: 'Khoản chi', income: 'Khoản thu' };
          const isSelected = filterType === type;
          return (
            <TouchableOpacity
              key={type}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => setFilterType(type)}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                {labels[type]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Summary Badge */}
      <View style={styles.summaryBar}>
        <Text style={styles.summaryCountText}>{filteredTransactions.length} giao dịch</Text>
        <View style={styles.summaryAmounts}>
          {filterType !== 'income' && (
            <Text style={styles.expenseSummary}>-{formatCurrency(totalFilteredExpense)}</Text>
          )}
          {filterType !== 'expense' && (
            <Text style={styles.incomeSummary}>+{formatCurrency(totalFilteredIncome)}</Text>
          )}
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={44} color="#CBD5E1" />
            <Text style={styles.emptyText}>Không tìm thấy giao dịch nào phù hợp</Text>
          </View>
        ) : (
          filteredTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onDelete={onDeleteTransaction}
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
    backgroundColor: '#F8FAFC',
  },
  searchBoxContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
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
    color: '#64748B',
  },
  summaryAmounts: {
    flexDirection: 'row',
    gap: 8,
  },
  expenseSummary: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  incomeSummary: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 12,
  },
});
