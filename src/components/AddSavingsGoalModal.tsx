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
import { formatCurrency } from '../utils/formatters';

interface AddSavingsGoalModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (goal: {
    name: string;
    targetAmount: number;
    currentAmount: number;
    icon: string;
    color: string;
  }) => void;
  isDark?: boolean;
}

const GOAL_ICONS = [
  { icon: 'phone-portrait', color: '#38BDF8' },
  { icon: 'airplane', color: '#FD79A8' },
  { icon: 'car', color: '#45B7D1' },
  { icon: 'home', color: '#F7B731' },
  { icon: 'shield-checkmark', color: '#10B981' },
  { icon: 'laptop', color: '#A55EEA' },
  { icon: 'gift', color: '#E17055' },
  { icon: 'sparkles', color: '#F59E0B' },
];

export const AddSavingsGoalModal: React.FC<AddSavingsGoalModalProps> = ({
  visible,
  onClose,
  onAdd,
  isDark = true,
}) => {
  const [name, setName] = useState('');
  const [rawAmount, setRawAmount] = useState('');
  const [selectedIconIndex, setSelectedIconIndex] = useState(0);

  const handleSave = () => {
    const numAmount = parseInt(rawAmount, 10);
    if (!name.trim()) {
      Alert.alert('Chưa nhập tên', 'Vui lòng nhập tên mục tiêu tiết kiệm.');
      return;
    }
    if (!numAmount || numAmount <= 0) {
      Alert.alert('Số tiền không hợp lệ', 'Vui lòng nhập số tiền mục tiêu lớn hơn 0.');
      return;
    }

    const chosen = GOAL_ICONS[selectedIconIndex];
    onAdd({
      name: name.trim(),
      targetAmount: numAmount,
      currentAmount: 0,
      icon: chosen.icon,
      color: chosen.color,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setName('');
    setRawAmount('');
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
              Tạo Hũ Tiết Kiệm Mới
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
            {/* Tên mục tiêu */}
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
              Tên mục tiêu tích lũy
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
              placeholder="VD: Mua xe máy, Quỹ du lịch, Khẩn cấp..."
              placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
              value={name}
              onChangeText={setName}
            />

            {/* Số tiền cần đạt */}
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
              Số tiền mục tiêu (VND)
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

            {/* Chọn biểu tượng */}
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
              Biểu tượng mục tiêu
            </Text>
            <View style={styles.iconsGrid}>
              {GOAL_ICONS.map((item, idx) => {
                const isSelected = idx === selectedIconIndex;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.iconBtn,
                      {
                        backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                        borderColor: isSelected ? item.color : isDark ? '#23304A' : '#E2E8F0',
                      },
                      isSelected && { backgroundColor: `${item.color}25`, borderWidth: 2 },
                    ]}
                    onPress={() => setSelectedIconIndex(idx)}
                  >
                    <Ionicons name={item.icon as any} size={22} color={item.color} />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveBtnText}>Tạo Mục Tiêu</Text>
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
    maxHeight: '85%',
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
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
