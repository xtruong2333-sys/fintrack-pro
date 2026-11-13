import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { RecurringBill } from '../types';
import { formatCurrency } from '../utils/formatters';

interface RecurringBillsSectionProps {
  bills: RecurringBill[];
  onPayBill: (billId: string) => void;
  onOpenAddModal: () => void;
  onDeleteBill: (billId: string) => void;
  isDark?: boolean;
}

export const RecurringBillsSection: React.FC<RecurringBillsSectionProps> = ({
  bills,
  onPayBill,
  onOpenAddModal,
  onDeleteBill,
  isDark = true,
}) => {
  const currentDay = new Date().getDate();

  const totalCommitted = bills.reduce((s, b) => s + b.amount, 0);
  const paidCount = bills.filter((b) => b.isPaidThisMonth).length;

  const handlePayPress = (bill: RecurringBill) => {
    Alert.alert(
      'Thanh toán hóa đơn',
      `Xác nhận thanh toán "${bill.name}" (${formatCurrency(bill.amount)}) qua ví ${bill.walletName}? Khoản chi này sẽ được tự động ghi nhận vào sổ thu chi.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Thanh toán ngay',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onPayBill(bill.id);
          },
        },
      ]
    );
  };

  const handleDeletePress = (bill: RecurringBill) => {
    Alert.alert(
      'Xóa hóa đơn định kỳ',
      `Bạn có chắc chắn muốn xóa theo dõi hóa đơn "${bill.name}" không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            onDeleteBill(bill.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithBadge}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Hóa Đơn & Đăng Ký Định Kỳ
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' }]}>
            <Text style={styles.statusBadgeText}>
              {paidCount}/{bills.length} đã xong
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={onOpenAddModal} activeOpacity={0.7}>
          <Ionicons name="add-circle" size={20} color="#38BDF8" />
          <Text style={styles.addBtnText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Monthly Commitment Summary Banner */}
      <View
        style={[
          styles.summaryBanner,
          {
            backgroundColor: isDark ? '#151D2F' : '#FFFFFF',
            borderColor: isDark ? '#23304A' : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.bannerLeft}>
          <Ionicons name="calendar-outline" size={18} color="#38BDF8" />
          <Text style={[styles.summaryLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Tổng chi cố định tháng:
          </Text>
        </View>
        <Text style={[styles.summaryAmount, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
          {formatCurrency(totalCommitted)}
        </Text>
      </View>

      {/* Bills Cards List */}
      <View style={styles.billsList}>
        {bills.map((bill) => {
          const daysLeft = bill.dueDay - currentDay;

          let statusText = `Hạn: Ngày ${bill.dueDay}`;
          let statusColor = '#38BDF8';
          let statusBg = 'rgba(56, 189, 248, 0.12)';

          if (bill.isPaidThisMonth) {
            statusText = 'Đã thanh toán';
            statusColor = '#10B981';
            statusBg = 'rgba(16, 185, 129, 0.15)';
          } else if (daysLeft === 0) {
            statusText = 'Hôm nay đến hạn!';
            statusColor = '#EF4444';
            statusBg = 'rgba(239, 68, 68, 0.15)';
          } else if (daysLeft > 0 && daysLeft <= 3) {
            statusText = `Còn ${daysLeft} ngày`;
            statusColor = '#F59E0B';
            statusBg = 'rgba(245, 158, 11, 0.15)';
          }

          return (
            <View
              key={bill.id}
              style={[
                styles.billCard,
                {
                  backgroundColor: isDark ? '#151D2F' : '#FFFFFF',
                  borderColor: bill.isPaidThisMonth
                    ? isDark ? '#1E293B' : '#F1F5F9'
                    : isDark ? '#23304A' : '#E2E8F0',
                  opacity: bill.isPaidThisMonth ? 0.75 : 1,
                },
              ]}
            >
              <View style={styles.billLeft}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: `${bill.categoryColor || '#38BDF8'}20` },
                  ]}
                >
                  <Ionicons
                    name={(bill.categoryIcon as any) || 'receipt'}
                    size={20}
                    color={bill.categoryColor || '#38BDF8'}
                  />
                </View>

                <View style={styles.billDetails}>
                  <View style={styles.titleRow}>
                    <Text
                      style={[styles.billName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                      numberOfLines={1}
                    >
                      {bill.name}
                    </Text>
                  </View>

                  <View style={styles.metaRow}>
                    <View style={[styles.badgePill, { backgroundColor: statusBg }]}>
                      <Text style={[styles.badgePillText, { color: statusColor }]}>
                        {statusText}
                      </Text>
                    </View>
                    <Text style={[styles.walletNameText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                      {bill.walletName}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.billRight}>
                <Text style={[styles.billAmount, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {formatCurrency(bill.amount)}
                </Text>

                {bill.isPaidThisMonth ? (
                  <View style={styles.paidCheckBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.paidCheckText}>Xong</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.payNowBtn}
                    onPress={() => handlePayPress(bill)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.payNowBtnText}>Trả ngay</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Delete bill button */}
              <TouchableOpacity
                style={styles.deleteBillBtn}
                onPress={() => handleDeletePress(bill)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={14} color={isDark ? '#475569' : '#94A3B8'} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#38BDF8',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
  },
  summaryBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  billsList: {
    gap: 10,
  },
  billCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  billLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  billDetails: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  billName: {
    fontSize: 14,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  walletNameText: {
    fontSize: 11,
  },
  billRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  billAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  paidCheckBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  paidCheckText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  payNowBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  payNowBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deleteBillBtn: {
    padding: 4,
    marginLeft: 6,
  },
});
