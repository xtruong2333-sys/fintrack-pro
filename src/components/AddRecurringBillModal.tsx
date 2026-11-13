import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Category, Wallet, WalletType } from '../types';
import { EXPENSE_CATEGORIES, WALLETS } from '../constants/categories';
import { formatCurrency } from '../utils/formatters';

interface AddRecurringBillModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (bill: {
    name: string;
    amount: number;
    dueDay: number;
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    walletId: WalletType;
    walletName: string;
    note?: string;
  }) => void;
  isDark?: boolean;
}

export const AddRecurringBillModal: React.FC<AddRecurringBillModalProps> = ({
  visible,
  onClose,
  onAdd,
  isDark = true,
}) => {
  const [name, setName] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [dueDay, setDueDay] = useState('5');
  const [selectedCategory, setSelectedCategory] = useState<Category>(EXPENSE_CATEGORIES[3]); // Hóa đơn & Nhà
  const [selectedWallet, setSelectedWallet] = useState<Wallet>(WALLETS[1]); // Ngân hàng
  const [note, setNote] = useState('');

  const handleSave = () => {
    const numAmount = parseInt(rawAmount, 10);
    const day = parseInt(dueDay, 10);

    if (!name.trim()) {
      Alert.alert('Chưa nhập tên', 'Vui lòng nhập tên hóa đơn định kỳ.');
      return;
    }
    if (!numAmount || numAmount <= 0) {
      Alert.alert('Số tiền không hợp lệ', 'Vui lòng nhập số tiền lớn hơn 0.');
      return;
    }
    if (!day || day < 1 || day > 31) {
      Alert.alert('Ngày không hợp lệ', 'Ngày thanh toán hàng tháng phải từ 1 đến 31.');
      return;
    }

    onAdd({
      name: name.trim(),
      amount: numAmount,
      dueDay: day,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      categoryIcon: selectedCategory.icon,
      categoryColor: selectedCategory.color,
      walletId: selectedWallet.id,
      walletName: selectedWallet.name,
      note: note.trim(),
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setName('');
    setRawAmount('');
    setNote('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View
          style={[
            styles.sheetContainer,
            { backgroundColor: isDark ? '#151D2F' : '#FFFFFF' },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: isDark ? '#23304A' : '#F1F5F9' }]}>
            <Text style={[styles.headerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Thêm Hóa Đơn Định Kỳ
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeBtn,
                { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
              ]}
            >
              <Ionicons name="close" size={20} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Tên hóa đơn */}
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
              Tên hóa đơn / Khoản phí
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                  borderColor: isDark ? '#23304A' : '#E2E8F0',
                  color: isDark ? '#F8FAFC' : '#0F172A',
                },
              ]}
              placeholder="VD: Tiền nhà, Internet, Netflix, Trả góp..."
              placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
              value={name}
              onChangeText={setName}
            />

            {/* Số tiền & Ngày trong tháng */}
            <View style={styles.twoColRow}>
              <View style={{ flex: 2 }}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
                  Số tiền (VND)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                      borderColor: isDark ? '#23304A' : '#E2E8F0',
                      color: isDark ? '#F8FAFC' : '#0F172A',
                    },
                  ]}
                  keyboardType="numeric"
                  placeholder="0 đ"
                  placeholderTextColor={isDark ? '#475569' : '#CBD5E1'}
                  value={rawAmount ? formatCurrency(parseInt(rawAmount, 10)) : ''}
                  onChangeText={(t) => setRawAmount(t.replace(/[^0-9]/g, ''))}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
                  Ngày trả
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                      borderColor: isDark ? '#23304A' : '#E2E8F0',
                      color: isDark ? '#F8FAFC' : '#0F172A',
                      textAlign: 'center',
                    },
                  ]}
                  keyboardType="numeric"
                  placeholder="Ngày"
                  placeholderTextColor={isDark ? '#475569' : '#CBD5E1'}
                  value={dueDay}
                  onChangeText={setDueDay}
                  maxLength={2}
                />
              </View>
            </View>

            {/* Chọn nguồn ví thanh toán */}
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
              Nguồn tiền thanh toán
            </Text>
            <View style={styles.walletRow}>
              {WALLETS.map((w) => {
                const isSelected = selectedWallet.id === w.id;
                return (
                  <TouchableOpacity
                    key={w.id}
                    style={[
                      styles.walletChip,
                      {
                        backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                        borderColor: isSelected ? w.color : isDark ? '#23304A' : '#E2E8F0',
                      },
                      isSelected && { backgroundColor: `${w.color}20`, borderWidth: 1.5 },
                    ]}
                    onPress={() => setSelectedWallet(w)}
                  >
                    <Ionicons name={w.icon as any} size={15} color={w.color} />
                    <Text
                      style={[
                        styles.walletChipText,
                        { color: isSelected ? (isDark ? '#F8FAFC' : '#0F172A') : isDark ? '#94A3B8' : '#64748B' },
                        isSelected && { fontWeight: '700' },
                      ]}
                      numberOfLines={1}
                    >
                      {w.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Chọn Danh mục */}
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
              Danh Mục
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
              {EXPENSE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory.id === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.catCard,
                      {
                        backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                        borderColor: isSelected ? cat.color : isDark ? '#23304A' : '#E2E8F0',
                      },
                      isSelected && { backgroundColor: `${cat.color}20`, borderWidth: 1.5 },
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Ionicons name={cat.icon as any} size={18} color={cat.color} />
                    <Text
                      style={[
                        styles.catCardText,
                        { color: isDark ? '#CBD5E1' : '#64748B' },
                        isSelected && { color: isDark ? '#F8FAFC' : '#0F172A', fontWeight: '700' },
                      ]}
                      numberOfLines={1}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Ghi chú */}
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
              Ghi chú thêm
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                  borderColor: isDark ? '#23304A' : '#E2E8F0',
                  color: isDark ? '#F8FAFC' : '#0F172A',
                  marginBottom: 24,
                },
              ]}
              placeholder="VD: Nhớ kiểm tra chỉ số công tơ điện..."
              placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
              value={note}
              onChangeText={setNote}
            />

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>Lưu Hóa Đơn Định Kỳ</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 11, 20, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 14,
    marginBottom: 16,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
  },
  walletRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  walletChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  walletChipText: {
    fontSize: 12,
  },
  catScroll: {
    gap: 8,
    marginBottom: 16,
    paddingBottom: 4,
  },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  catCardText: {
    fontSize: 12,
  },
  saveBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
