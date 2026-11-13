import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
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
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: transaction.categoryColor ? `${transaction.categoryColor}20` : '#E2E8F0' },
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
          <Text style={styles.categoryName} numberOfLines={1}>
            {transaction.categoryName}
          </Text>
          <Text style={[styles.amountText, isIncome ? styles.incomeText : styles.expenseText]}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
        </View>

        <View style={styles.bottomLine}>
          <Text style={styles.noteText} numberOfLines={1}>
            {transaction.note || 'Không có ghi chú'}
          </Text>
          <Text style={styles.dateText}>{formatDateDisplay(transaction.date)}</Text>
        </View>
      </View>

      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="trash-outline" size={17} color="#94A3B8" />
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
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
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
  },
  incomeText: {
    color: '#10B981',
  },
  expenseText: {
    color: '#EF4444',
  },
  bottomLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
    marginRight: 8,
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 6,
    marginLeft: 2,
  },
});
