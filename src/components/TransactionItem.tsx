import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
  onViewReceipt?: (transaction: Transaction) => void;
  isDark?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onDelete,
  onViewReceipt,
  isDark = true,
}) => {
  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    if (!onDelete) return;
    Alert.alert(
      'Xóa giao dịch',
      `Bạn có chắc muốn xóa "${transaction.categoryName}" (${formatCurrency(transaction.amount)})?`,
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
      {/* Category Icon */}
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

      {/* Main Info Content */}
      <View style={styles.contentContainer}>
        {/* Top Line: Category Name & Amount */}
        <View style={styles.topLine}>
          <Text
            style={[styles.categoryName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {transaction.categoryName}
          </Text>
          <Text
            style={[styles.amountText, isIncome ? styles.incomeText : styles.expenseText]}
            numberOfLines={1}
          >
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </Text>
        </View>

        {/* Bottom Line: Note, Receipt Badge, Wallet Badge & Date */}
        <View style={styles.bottomLine}>
          <View style={styles.noteAndWalletGroup}>
            <Text
              style={[styles.noteText, { color: isDark ? '#94A3B8' : '#64748B' }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {transaction.note || 'Không có ghi chú'}
            </Text>

            {/* Receipt Image Badge (MỤC 4) */}
            {transaction.receiptImage && (
              <TouchableOpacity
                style={styles.receiptBadge}
                onPress={() => onViewReceipt && onViewReceipt(transaction)}
                activeOpacity={0.7}
              >
                <Ionicons name="image-outline" size={11} color="#38BDF8" />
                <Text style={styles.receiptBadgeText}>Bill</Text>
              </TouchableOpacity>
            )}

            {transaction.walletName && (
              <View
                style={[
                  styles.walletBadge,
                  { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
                ]}
              >
                <Text style={styles.walletBadgeText} numberOfLines={1}>
                  {transaction.walletName}
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.dateText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
            {formatDateDisplay(transaction.date)}
          </Text>
        </View>
      </View>

      {/* Delete button */}
      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={16} color={isDark ? '#64748B' : '#94A3B8'} />
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
    paddingHorizontal: 14,
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
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  contentContainer: {
    flex: 1,
    marginRight: 6,
    justifyContent: 'center',
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14.5,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  amountText: {
    fontSize: 14.5,
    fontWeight: '800',
    flexShrink: 0,
    textAlign: 'right',
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
    gap: 8,
  },
  noteAndWalletGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
    overflow: 'hidden',
  },
  noteText: {
    fontSize: 12,
    flex: 1,
  },
  receiptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    flexShrink: 0,
  },
  receiptBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  walletBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexShrink: 0,
  },
  walletBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
    flexShrink: 0,
  },
  deleteButton: {
    padding: 6,
    marginLeft: 2,
    flexShrink: 0,
  },
});
