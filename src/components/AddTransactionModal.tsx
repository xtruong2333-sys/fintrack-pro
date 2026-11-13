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
import { TransactionType, Category } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
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
    note: string;
    date: string;
  }) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [rawAmount, setRawAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(EXPENSE_CATEGORIES[0]);
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
      note: note.trim(),
      date,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Reset form
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
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Giao Dịch Mới</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Segmented Type Controller */}
            <View style={styles.segmentedContainer}>
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
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Số tiền (VND)</Text>
              <View style={styles.amountRow}>
                <TextInput
                  style={[
                    styles.amountInput,
                    { color: type === 'expense' ? '#EF4444' : '#10B981' },
                  ]}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#CBD5E1"
                  value={rawAmount ? formatCurrency(parseInt(rawAmount, 10)) : ''}
                  onChangeText={(text) => {
                    const clean = text.replace(/[^0-9]/g, '');
                    setRawAmount(clean);
                  }}
                />
              </View>
            </View>

            {/* Quick Add Chips */}
            <View style={styles.quickChipsRow}>
              {[50000, 100000, 200000, 500000].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={styles.chip}
                  onPress={() => handleQuickAdd(val)}
                >
                  <Text style={styles.chipText}>+{val / 1000}k</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.chip, styles.chipClear]}
                onPress={() => setRawAmount('')}
              >
                <Text style={styles.chipClearText}>Xóa</Text>
              </TouchableOpacity>
            </View>

            {/* Category Selector */}
            <Text style={styles.sectionTitle}>Chọn Danh Mục</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((cat) => {
                const isSelected = selectedCategory.id === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryCard,
                      isSelected && { borderColor: cat.color, backgroundColor: `${cat.color}15` },
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
                        isSelected && { color: '#0F172A', fontWeight: '700' },
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
            <Text style={styles.sectionTitle}>Ghi Chú</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="VD: Mua trà sữa, xăng xe, tiền cơm..."
              placeholderTextColor="#94A3B8"
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  amountBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
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
  quickChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  chipClear: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  chipClearText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryCard: {
    width: '31%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  catIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  noteInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 24,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
