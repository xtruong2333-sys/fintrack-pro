import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SavingsGoal } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SavingsGoalsSectionProps {
  goals: SavingsGoal[];
  onDeposit: (goalId: string, amount: number) => void;
  onOpenAddModal: () => void;
  onDeleteGoal: (goalId: string) => void;
  isDark?: boolean;
}

export const SavingsGoalsSection: React.FC<SavingsGoalsSectionProps> = ({
  goals,
  onDeposit,
  onOpenAddModal,
  onDeleteGoal,
  isDark = true,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('');

  const handleConfirmDeposit = () => {
    if (!selectedGoal) return;
    const val = parseInt(depositAmount, 10);
    if (!val || val <= 0) {
      Alert.alert('Chưa nhập số tiền', 'Vui lòng nhập số tiền lớn hơn 0.');
      return;
    }

    onDeposit(selectedGoal.id, val);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Nạp tiền thành công! 🎉',
      `Đã nạp ${formatCurrency(val)} vào hũ "${selectedGoal.name}".`
    );
    setSelectedGoal(null);
    setDepositAmount('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Hũ Tiết Kiệm & Mục Tiêu
          </Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={onOpenAddModal} activeOpacity={0.7}>
          <Ionicons name="add-circle" size={20} color="#38BDF8" />
          <Text style={styles.addBtnText}>Thêm hũ</Text>
        </TouchableOpacity>
      </View>

      {/* Goals Cards List */}
      <View style={styles.goalsList}>
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isDone = percent >= 100;

          return (
            <View
              key={goal.id}
              style={[
                styles.goalCard,
                {
                  backgroundColor: isDark ? '#151D2F' : '#FFFFFF',
                  borderColor: isDone
                    ? '#10B981'
                    : isDark ? '#23304A' : '#E2E8F0',
                },
              ]}
            >
              <View style={styles.topRow}>
                <View style={styles.leftInfo}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: `${goal.color || '#38BDF8'}20` },
                    ]}
                  >
                    <Ionicons
                      name={(goal.icon as any) || 'sparkles'}
                      size={20}
                      color={goal.color || '#38BDF8'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.goalName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                      numberOfLines={1}
                    >
                      {goal.name}
                    </Text>
                    <Text style={styles.targetText}>
                      Mục tiêu: {formatCurrency(goal.targetAmount)}
                    </Text>
                  </View>
                </View>

                {isDone ? (
                  <View style={styles.doneBadge}>
                    <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                    <Text style={styles.doneBadgeText}>Hoàn thành!</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.depositBtn}
                    onPress={() => setSelectedGoal(goal)}
                    activeOpacity={0.75}
                  >
                    <Ionicons name="add" size={14} color="#FFFFFF" />
                    <Text style={styles.depositBtnText}>Nạp tiền</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Progress Bar */}
              <View
                style={[
                  styles.progressBackground,
                  { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${percent}%`,
                      backgroundColor: isDone ? '#10B981' : goal.color || '#38BDF8',
                    },
                  ]}
                />
              </View>

              {/* Bottom Row */}
              <View style={styles.bottomRow}>
                <Text style={[styles.currentAmountText, { color: isDark ? '#CBD5E1' : '#334155' }]}>
                  Đã tích lũy: <Text style={{ fontWeight: '800' }}>{formatCurrency(goal.currentAmount)}</Text>
                </Text>
                <Text
                  style={[
                    styles.percentText,
                    { color: isDone ? '#10B981' : '#38BDF8' },
                  ]}
                >
                  {percent}%
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Deposit Modal */}
      {selectedGoal && (
        <Modal visible={!!selectedGoal} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalCard,
                { backgroundColor: isDark ? '#151D2F' : '#FFFFFF' },
              ]}
            >
              <Text style={[styles.modalTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Nạp tiền vào "{selectedGoal.name}"
              </Text>

              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                    borderColor: isDark ? '#23304A' : '#CBD5E1',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                  },
                ]}
                keyboardType="numeric"
                placeholder="Nhập số tiền VND..."
                placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                value={depositAmount ? formatCurrency(parseInt(depositAmount, 10)) : ''}
                onChangeText={(t) => setDepositAmount(t.replace(/[^0-9]/g, ''))}
              />

              {/* Quick Add Buttons */}
              <View style={styles.quickDepositRow}>
                {[500000, 1000000, 2000000, 5000000].map((val) => (
                  <TouchableOpacity
                    key={val}
                    style={[
                      styles.quickChip,
                      {
                        backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                        borderColor: isDark ? '#334155' : '#E2E8F0',
                      },
                    ]}
                    onPress={() => setDepositAmount(val.toString())}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#38BDF8' }}>
                      +{val >= 1000000 ? `${val / 1000000}tr` : `${val / 1000}k`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalCancelBtn, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}
                  onPress={() => setSelectedGoal(null)}
                >
                  <Text style={{ color: isDark ? '#94A3B8' : '#475569', fontWeight: '700' }}>
                    Hủy
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleConfirmDeposit}>
                  <Text style={styles.modalSubmitBtnText}>Xác nhận nạp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
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
  goalsList: {
    gap: 12,
  },
  goalCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  goalName: {
    fontSize: 14,
    fontWeight: '700',
  },
  targetText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  depositBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  depositBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  doneBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981',
  },
  progressBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentAmountText: {
    fontSize: 12,
  },
  percentText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#23304A',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
  },
  quickDepositRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  quickChip: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSubmitBtn: {
    flex: 2,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
