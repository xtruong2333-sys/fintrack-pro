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
import { TransactionType, Category, WalletType, Wallet } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, WALLETS } from '../constants/categories';
import { formatCurrency, getTodayString } from '../utils/formatters';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (data: {
    type: TransactionType;
    amount: number;
    categoryId: string;
    categoryName: string;
    categoryIcon: string;
    categoryColor: string;
    walletId: WalletType;
    walletName: string;
    note: string;
    date: string;
  }) => void;
  isDark?: boolean;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  onAdd,
  isDark = true,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [rawAmount, setRawAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(EXPENSE_CATEGORIES[0]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet>(WALLETS[1]); // Mặc định: Ngân hàng
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayString());

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setSelectedCategory(newType === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleQuickAdd = (value: number) => {
    const current = parseInt(rawAmount || '0', 10);
    const updated = current + value;
    setRawAmount(updated.toString());
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = () => {
    const numericAmount = parseInt(rawAmount, 10);
    if (!numericAmount || numericAmount <= 0) {
      Alert.alert('Chưa nhập số tiền', 'Vui lòng nhập số tiền lớn hơn 0 để lưu giao dịch.');
      return;
    }

    onAdd({
      type,
      amount: numericAmount,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      categoryIcon: selectedCategory.icon,
      categoryColor: selectedCategory.color,
      walletId: selectedWallet.id,
      walletName: selectedWallet.name,
      note: note.trim(),
      date,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

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
              Thêm Giao Dịch Mới
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeBtn,
                { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={20} color={isDark ? '#94A3B8' : '#64748B'} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Segmented Type Controller */}
            <View
              style={[
                styles.segmentedContainer,
                { backgroundColor: isDark ? '#0B0F19' : '#F1F5F9' },
              ]}
            >
              <TouchableOpacity
                style={[styles.segmentBtn, type === 'expense' && styles.segmentExpenseActive]}
                onPress={() => handleTypeChange('expense')}
              >
                <Ionicons
                  name="arrow-up-circle"
                  size={18}
                  color={type === 'expense' ? '#FFFFFF' : '#EF4444'}
                />
                <Text style={[styles.segmentText, type === 'expense' && styles.segmentTextActive]}>
                  Khoản Chi
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.segmentBtn, type === 'income' && styles.segmentIncomeActive]}
                onPress={() => handleTypeChange('income')}
              >
                <Ionicons
                  name="arrow-down-circle"
                  size={18}
                  color={type === 'income' ? '#FFFFFF' : '#10B981'}
                />
                <Text style={[styles.segmentText, type === 'income' && styles.segmentTextActive]}>
                  Khoản Thu
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount Display & Input */}
            <View
              style={[
                styles.amountBox,
                {
                  backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                  borderColor: isDark ? '#23304A' : '#E2E8F0',
                },
              ]}
            >
              <Text style={[styles.amountLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                Số tiền (VND)
              </Text>
              <View style={styles.amountRow}>
                <TextInput
                  style={[
                    styles.amountInput,
                    { color: type === 'expense' ? '#F87171' : '#34D399' },
                  ]}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={isDark ? '#475569' : '#CBD5E1'}
                  value={rawAmount ? formatCurrency(parseInt(rawAmount, 10)) : ''}
                  onChangeText={(text) => {
                    const clean = text.replace(/[^0-9]/g, '');
                    setRawAmount(clean);
                  }}
                />
              </View>
            </View>

            {/* Quick Add Chips (Horizontal scrollable to prevent any screen crowding) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickChipsScroll}
            >
              {[50000, 100000, 200000, 500000, 1000000, 2000000].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                  onPress={() => handleQuickAdd(val)}
                >
                  <Text style={[styles.chipText, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                    +{val >= 1000000 ? `${val / 1000000}tr` : `${val / 1000}k`}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.chip, styles.chipClear]}
                onPress={() => setRawAmount('')}
              >
                <Text style={styles.chipClearText}>Xóa số</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Wallet Picker */}
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
              Chọn Nguồn Tiền (Ví)
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
                    onPress={() => {
                      setSelectedWallet(w);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
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

            {/* Category Selector */}
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
              Chọn Danh Mục
            </Text>
            <View style={styles.categoriesGrid}>
              {categories.map((cat) => {
                const isSelected = selectedCategory.id === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryCard,
                      {
                        backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                        borderColor: isSelected ? cat.color : isDark ? '#23304A' : '#E2E8F0',
                      },
                      isSelected && { backgroundColor: `${cat.color}20`, borderWidth: 1.5 },
                    ]}
                    onPress={() => {
                      setSelectedCategory(cat);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <View style={[styles.catIconCircle, { backgroundColor: `${cat.color}25` }]}>
                      <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                    </View>
                    <Text
                      style={[
                        styles.catName,
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
            </View>

            {/* Note Input */}
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
              Ghi Chú
            </Text>
            <TextInput
              style={[
                styles.noteInput,
                {
                  backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                  borderColor: isDark ? '#23304A' : '#E2E8F0',
                  color: isDark ? '#F8FAFC' : '#0F172A',
                },
              ]}
              placeholder="VD: Cà phê sáng, tiền chợ, sinh nhật..."
              placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
              value={note}
              onChangeText={setNote}
              maxLength={100}
            />

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: type === 'expense' ? '#EF4444' : '#10B981' },
              ]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Lưu Giao Dịch</Text>
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
    maxHeight: '92%',
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
  segmentedContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 11,
    gap: 6,
  },
  segmentExpenseActive: {
    backgroundColor: '#EF4444',
  },
  segmentIncomeActive: {
    backgroundColor: '#10B981',
  },
  segmentText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  amountBox: {
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  amountRow: {
    width: '100%',
    alignItems: 'center',
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    width: '100%',
  },
  quickChipsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipClear: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  chipClearText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 10,
  },
  walletRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryCard: {
    width: '31%',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
  },
  catIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catName: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  noteInput: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 14,
    marginBottom: 24,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
