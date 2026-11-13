import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
  isDark?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onDelete,
  isDark = true,
}) => {
  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    if (!onDelete) return;
    Alert.alert(
      'Xóa giao dịch',
      `Bạn có chắc chắn muốn xóa "${transaction.categoryName}" (${formatCurrency(transaction.amount)}) không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => onDelete(transaction.id) },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#151D2F' : '#FFFFFF',
          borderColor: isDark ? '#23304A' : '#F1F5F9',
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: transaction.categoryColor ? `${transaction.categoryColor}25` : '#E2E8F0' },
        ]}
      >
        <Ionicons
          name={(transaction.categoryIcon as any) || 'pricetag'}
          size={20}
          color={transaction.categoryColor || '#64748B'}
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.topLine}>
          <Text
            style={[styles.categoryName, { color: isDark ? '#F8FAFC' : '#1E293B' }]}
            numberOfLines={1}
          >
            {transaction.categoryName}
          </Text>
          <Text style={[styles.amountText, isIncome ? styles.incomeText : styles.expenseText]}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
        </View>

        <View style={styles.bottomLine}>
          <View style={styles.noteGroup}>
            <Text
              style={[styles.noteText, { color: isDark ? '#94A3B8' : '#64748B' }]}
              numberOfLines={1}
            >
              {transaction.note || 'Không có ghi chú'}
            </Text>
            {transaction.walletName && (
              <View
                style={[
                  styles.walletBadge,
                  { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
                ]}
              >
                <Text style={styles.walletBadgeText}>{transaction.walletName}</Text>
              </View>
            )}
          </View>
          <Text style={styles.dateText}>{formatDateDisplay(transaction.date)}</Text>
        </View>
      </View>

      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="trash-outline" size={16} color="#64748B" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
  },
  incomeText: {
    color: '#34D399',
  },
  expenseText: {
    color: '#F87171',
  },
  bottomLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    gap: 6,
  },
  noteText: {
    fontSize: 12.5,
    maxWidth: 130,
  },
  walletBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  walletBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  dateText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 6,
    marginLeft: 2,
  },
});
