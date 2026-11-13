import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Header } from '../components/Header';
import { formatCurrency } from '../utils/formatters';

interface SettingsScreenProps {
  budget: number;
  transactionCount: number;
  onUpdateBudget: (newBudget: number) => void;
  onClearData: () => void;
  onResetSampleData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  budget,
  transactionCount,
  onUpdateBudget,
  onClearData,
  onResetSampleData,
}) => {
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget.toString());

  const handleSaveBudget = () => {
    const val = parseInt(budgetInput.replace(/[^0-9]/g, ''), 10);
    if (!val || val <= 0) {
      Alert.alert('Giá trị không hợp lệ', 'Vui lòng nhập số tiền hạn mức lớn hơn 0.');
      return;
    }
    onUpdateBudget(val);
    setEditingBudget(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Thành công', `Đã cập nhật hạn mức ngân sách tháng: ${formatCurrency(val)}`);
  };

  const handleConfirmClear = () => {
    Alert.alert(
      'Xóa toàn bộ dữ liệu?',
      'Hành động này sẽ xóa tất cả giao dịch và thiết lập. Không thể hoàn tác!',
      [
        { text: 'Hủy bỏ', style: 'cancel' },
        {
          text: 'Xóa sạch',
          style: 'destructive',
          onPress: () => {
            onClearData();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  const handleConfirmResetSample = () => {
    Alert.alert(
      'Khôi phục dữ liệu mẫu?',
      'Hệ thống sẽ nạp lại các giao dịch mẫu giúp bạn trải nghiệm ứng dụng trực quan.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi phục',
          onPress: () => {
            onResetSampleData();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Cài Đặt" subtitle="Quản lý & Hệ thống" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Budget Setting Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="wallet-outline" size={20} color="#3B82F6" />
            </View>
            <View style={styles.cardHeaderTextGroup}>
              <Text style={styles.cardTitle}>Hạn Mức Chi Tiêu Tháng</Text>
              <Text style={styles.cardSubtitle}>Cảnh báo khi chi tiêu vượt ngân sách</Text>
            </View>
          </View>

          {editingBudget ? (
            <View style={styles.editBudgetRow}>
              <TextInput
                style={styles.budgetInput}
                keyboardType="numeric"
                value={budgetInput}
                onChangeText={setBudgetInput}
                placeholder="Nhập số tiền VND..."
              />
              <TouchableOpacity style={styles.saveBudgetBtn} onPress={handleSaveBudget}>
                <Text style={styles.saveBudgetBtnText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBudgetBtn}
                onPress={() => {
                  setEditingBudget(false);
                  setBudgetInput(budget.toString());
                }}
              >
                <Text style={styles.cancelBudgetBtnText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.budgetDisplayRow}>
              <Text style={styles.budgetAmountText}>{formatCurrency(budget)}</Text>
              <TouchableOpacity
                style={styles.changeBtn}
                onPress={() => setEditingBudget(true)}
              >
                <Text style={styles.changeBtnText}>Thay đổi</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Data Management Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTitle}>Quản Lý Dữ Liệu</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="server-outline" size={20} color="#64748B" />
              <Text style={styles.settingLabel}>Tổng số bản ghi</Text>
            </View>
            <Text style={styles.settingValue}>{transactionCount} giao dịch</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow} onPress={handleConfirmResetSample}>
            <View style={styles.settingLeft}>
              <Ionicons name="refresh-outline" size={20} color="#3B82F6" />
              <Text style={[styles.settingLabel, { color: '#3B82F6' }]}>
                Khôi phục dữ liệu mẫu
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow} onPress={handleConfirmClear}>
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={[styles.settingLabel, { color: '#EF4444' }]}>
                Xóa toàn bộ dữ liệu
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* App Info Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTitle}>Thông Tin Ứng Dụng</Text>

          <View style={styles.settingRow}>
            <Text style={styles.infoLabel}>Tên ứng dụng</Text>
            <Text style={styles.infoValue}>Sổ Thu Chi (Expense Tracker)</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <Text style={styles.infoLabel}>Phiên bản</Text>
            <Text style={styles.infoValue}>1.0.0 (Build iOS .IPA)</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <Text style={styles.infoLabel}>Môi trường</Text>
            <Text style={styles.infoValue}>React Native / Expo EAS</Text>
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTextGroup: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  budgetDisplayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  budgetAmountText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  changeBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  changeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editBudgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  saveBudgetBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveBudgetBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  cancelBudgetBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelBudgetBtnText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
});
