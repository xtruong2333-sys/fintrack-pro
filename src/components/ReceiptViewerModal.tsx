import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { formatCurrency, formatFullDate } from '../utils/formatters';

interface ReceiptViewerModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({
  visible,
  transaction,
  onClose,
}) => {
  if (!transaction || !transaction.receiptImage) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safeContainer}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.topTitle}>Hóa Đơn / Bill Giao Dịch</Text>
              <Text style={styles.topSubtitle}>{formatFullDate(transaction.date)}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Photo Display */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: transaction.receiptImage }}
              style={styles.receiptImage}
              resizeMode="contain"
            />
          </View>

          {/* Bottom Card Summary */}
          <View style={styles.bottomCard}>
            <View style={styles.categoryBadgeRow}>
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: transaction.categoryColor || '#38BDF8' },
                ]}
              />
              <Text style={styles.categoryNameText}>{transaction.categoryName}</Text>
              <Text style={styles.walletText}>• {transaction.walletName || 'Chung'}</Text>
            </View>

            <View style={styles.amountRow}>
              <Text style={styles.noteText} numberOfLines={2}>
                {transaction.note || 'Không có ghi chú'}
              </Text>
              <Text style={styles.amountText}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.95)',
  },
  safeContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  topSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  bottomCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#151D2F',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#23304A',
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  walletText: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '600',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteText: {
    fontSize: 13,
    color: '#94A3B8',
    flex: 1,
    marginRight: 10,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    flexShrink: 0,
  },
});
