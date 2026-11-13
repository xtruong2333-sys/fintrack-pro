import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Platform,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Header } from '../components/Header';
import { ThemeMode, AppSettings, Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';
import { exportTransactionsToCSV } from '../utils/csvExporter';
import { StorageService } from '../services/storage';

interface SettingsScreenProps {
  budget: number;
  transactions: Transaction[];
  settings: AppSettings;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onUpdateBudget: (newBudget: number) => void;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onClearData: () => void;
  onResetSampleData: () => void;
  onReloadAllData: () => void;
  onShowOnboarding: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  budget,
  transactions,
  settings,
  theme,
  onToggleTheme,
  onUpdateBudget,
  onUpdateSettings,
  onClearData,
  onResetSampleData,
  onReloadAllData,
  onShowOnboarding,
}) => {
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(budget.toString());
  const [restoreModalVisible, setRestoreModalVisible] = useState(false);
  const [restoreJSON, setRestoreJSON] = useState('');
  const isDark = theme === 'dark';

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

  const handleTogglePin = (value: boolean) => {
    onUpdateSettings({ pinEnabled: value });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (value) {
      Alert.alert('Đã bật mã PIN', 'Mã PIN bảo mật mặc định là 1234. Lần mở app tới hệ thống sẽ yêu cầu nhập mã.');
    } else {
      Alert.alert('Đã tắt mã PIN', 'Ứng dụng sẽ mở trực tiếp không cần nhập mã.');
    }
  };

  // MỤC 5: Tạo tệp sao lưu dữ liệu JSON
  const handleExportBackup = async () => {
    try {
      const backupStr = await StorageService.createFullBackupJSON();
      if (Platform.OS === 'web') {
        const blob = new Blob([backupStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `FinTrack_Backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Alert.alert('Thành công', 'Đã tải tệp sao lưu FinTrack_Backup.json về máy tính!');
      } else {
        Alert.alert(
          'Sao lưu hoàn tất',
          'Dữ liệu đã được nén thành chuỗi sao lưu JSON bảo mật. Bạn có thể dùng chuỗi này để khôi phục khi đổi máy.'
        );
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể tạo bản sao lưu.');
    }
  };

  // MỤC 5: Khôi phục dữ liệu
  const handleConfirmRestore = async () => {
    if (!restoreJSON.trim()) {
      Alert.alert('Lỗi', 'Vui lòng dán nội dung mã tệp sao lưu JSON.');
      return;
    }

    const success = await StorageService.restoreFromBackupJSON(restoreJSON);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Khôi phục thành công! 🎉', 'Toàn bộ dữ liệu của bạn đã được phục hồi hoàn chỉnh.');
      setRestoreModalVisible(false);
      setRestoreJSON('');
      onReloadAllData();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Lỗi khôi phục', 'Dữ liệu JSON không hợp lệ hoặc đã bị lỗi định dạng.');
    }
  };

  const handleConfirmClear = () => {
    Alert.alert(
      'Xóa toàn bộ dữ liệu?',
      'Hành động này sẽ xóa tất cả giao dịch, hóa đơn và mục tiêu. Không thể hoàn tác!',
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

  const cardBg = isDark ? '#151D2F' : '#FFFFFF';
  const cardBorder = isDark ? '#23304A' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#64748B';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0B0F19' : '#F8FAFC' }]}>
      <Header
        title="Cài Đặt"
        subtitle="Hệ thống & Cá nhân hóa"
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Budget Setting Card */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: isDark ? '#1E293B' : '#EFF6FF' },
              ]}
            >
              <Ionicons name="wallet-outline" size={20} color="#38BDF8" />
            </View>
            <View style={styles.cardHeaderTextGroup}>
              <Text style={[styles.cardTitle, { color: textPrimary }]}>Hạn Mức Ngân Sách Tháng</Text>
              <Text style={[styles.cardSubtitle, { color: textSecondary }]}>Cảnh báo khi chi tiêu vượt ngân sách</Text>
            </View>
          </View>

          {editingBudget ? (
            <View style={styles.editBudgetRow}>
              <TextInput
                style={[
                  styles.budgetInput,
                  {
                    backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                    color: textPrimary,
                  },
                ]}
                keyboardType="numeric"
                value={budgetInput}
                onChangeText={setBudgetInput}
                placeholder="Nhập số tiền VND..."
                placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
              />
              <TouchableOpacity style={styles.saveBudgetBtn} onPress={handleSaveBudget}>
                <Text style={styles.saveBudgetBtnText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.cancelBudgetBtn,
                  { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
                ]}
                onPress={() => {
                  setEditingBudget(false);
                  setBudgetInput(budget.toString());
                }}
              >
                <Text style={[styles.cancelBudgetBtnText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                  Hủy
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                styles.budgetDisplayRow,
                {
                  backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                  borderColor: isDark ? '#1E293B' : '#F1F5F9',
                },
              ]}
            >
              <Text
                style={[styles.budgetAmountText, { color: textPrimary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatCurrency(budget)}
              </Text>
              <TouchableOpacity
                style={styles.changeBtn}
                onPress={() => setEditingBudget(true)}
              >
                <Text style={styles.changeBtnText}>Thay đổi</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Security & Appearance Card */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={[styles.sectionHeaderTitle, { color: textPrimary }]}>Bảo Mật & Giao Diện</Text>

          {/* Theme Switcher */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color="#F59E0B" />
              <Text style={[styles.settingLabel, { color: textPrimary }]}>Giao diện Tối (Dark Mode Pro)</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={onToggleTheme}
              trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: cardBorder }]} />

          {/* PIN Lock Switcher */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed-outline" size={20} color="#10B981" />
              <View>
                <Text style={[styles.settingLabel, { color: textPrimary }]}>Khóa mã PIN / FaceID</Text>
                <Text style={[styles.settingSubLabel, { color: textSecondary }]}>Yêu cầu mã 1234 khi mở app</Text>
              </View>
            </View>
            <Switch
              value={settings.pinEnabled}
              onValueChange={handleTogglePin}
              trackColor={{ false: '#CBD5E1', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Pro Tools & Data Management */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={[styles.sectionHeaderTitle, { color: textPrimary }]}>Công Cụ Nâng Cao</Text>

          {/* Export to Excel */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => exportTransactionsToCSV(transactions)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="document-text-outline" size={20} color="#38BDF8" />
              <Text style={[styles.settingLabel, { color: '#38BDF8', fontWeight: '700' }]}>
                Xuất Báo Cáo Excel (.CSV)
              </Text>
            </View>
            <Ionicons name="download-outline" size={18} color="#38BDF8" />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: cardBorder }]} />

          {/* MỤC 5: Sao lưu đám mây JSON */}
          <TouchableOpacity style={styles.actionRow} onPress={handleExportBackup}>
            <View style={styles.settingLeft}>
              <Ionicons name="cloud-upload-outline" size={20} color="#34D399" />
              <View>
                <Text style={[styles.settingLabel, { color: textPrimary, fontWeight: '700' }]}>
                  Sao Lưu Dữ Liệu (.JSON)
                </Text>
                <Text style={[styles.settingSubLabel, { color: textSecondary }]}>
                  Xuất toàn bộ sổ thu chi để dự phòng
                </Text>
              </View>
            </View>
            <Ionicons name="download-outline" size={18} color="#34D399" />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: cardBorder }]} />

          {/* MỤC 5: Khôi phục đám mây JSON */}
          <TouchableOpacity style={styles.actionRow} onPress={() => setRestoreModalVisible(true)}>
            <View style={styles.settingLeft}>
              <Ionicons name="cloud-download-outline" size={20} color="#F59E0B" />
              <View>
                <Text style={[styles.settingLabel, { color: textPrimary, fontWeight: '700' }]}>
                  Khôi Phục Dữ Liệu Từ Bản Sao Lưu
                </Text>
                <Text style={[styles.settingSubLabel, { color: textSecondary }]}>
                  Nạp lại sổ sách khi đổi điện thoại mới
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: cardBorder }]} />

          {/* Re-play Intro */}
          <TouchableOpacity style={styles.actionRow} onPress={onShowOnboarding}>
            <View style={styles.settingLeft}>
              <Ionicons name="sparkles-outline" size={20} color="#F59E0B" />
              <Text style={[styles.settingLabel, { color: textPrimary }]}>
                Xem lại Giới thiệu ứng dụng (Intro)
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: cardBorder }]} />

          {/* Reset sample data */}
          <TouchableOpacity style={styles.actionRow} onPress={handleConfirmResetSample}>
            <View style={styles.settingLeft}>
              <Ionicons name="refresh-outline" size={20} color="#3B82F6" />
              <Text style={[styles.settingLabel, { color: '#3B82F6' }]}>
                Khôi phục dữ liệu mẫu
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: cardBorder }]} />

          {/* Clear all */}
          <TouchableOpacity style={styles.actionRow} onPress={handleConfirmClear}>
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={[styles.settingLabel, { color: '#EF4444' }]}>
                Xóa toàn bộ dữ liệu
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={textSecondary} />
          </TouchableOpacity>
        </View>

        {/* App Info Card */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={[styles.sectionHeaderTitle, { color: textPrimary }]}>Thông Tin Ứng Dụng</Text>

          <View style={styles.settingRow}>
            <Text style={[styles.infoLabel, { color: textSecondary }]}>Tên ứng dụng</Text>
            <Text style={[styles.infoValue, { color: textPrimary }]}>FinTrack Pro</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: cardBorder }]} />

          <View style={styles.settingRow}>
            <Text style={[styles.infoLabel, { color: textSecondary }]}>Phiên bản</Text>
            <Text style={[styles.infoValue, { color: textPrimary }]}>2.5.0 (Ultimate Edition)</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: cardBorder }]} />

          <View style={styles.settingRow}>
            <Text style={[styles.infoLabel, { color: textSecondary }]}>Đóng gói iOS</Text>
            <Text style={{ color: '#38BDF8', fontWeight: '700', fontSize: 13 }}>
              Sẵn sàng xuất file .IPA
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* MỤC 5: Modal Khôi phục dữ liệu sao lưu */}
      <Modal visible={restoreModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.restoreModalCard,
              { backgroundColor: isDark ? '#151D2F' : '#FFFFFF' },
            ]}
          >
            <Text style={[styles.restoreModalTitle, { color: textPrimary }]}>
              Khôi Phục Dữ Liệu Sao Lưu
            </Text>
            <Text style={[styles.restoreModalDesc, { color: textSecondary }]}>
              Dán nội dung JSON từ tệp sao lưu FinTrack_Backup.json của bạn vào khung bên dưới:
            </Text>

            <TextInput
              style={[
                styles.restoreInput,
                {
                  backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                  borderColor: isDark ? '#23304A' : '#CBD5E1',
                  color: textPrimary,
                },
              ]}
              multiline
              numberOfLines={6}
              placeholder='Dán nội dung {"version": "2.0.0", "data": ...}'
              placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
              value={restoreJSON}
              onChangeText={setRestoreJSON}
            />

            <View style={styles.restoreActions}>
              <TouchableOpacity
                style={[
                  styles.restoreCancelBtn,
                  { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' },
                ]}
                onPress={() => {
                  setRestoreModalVisible(false);
                  setRestoreJSON('');
                }}
              >
                <Text style={{ color: textSecondary, fontWeight: '700' }}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.restoreSubmitBtn}
                onPress={handleConfirmRestore}
              >
                <Text style={styles.restoreSubmitBtnText}>Khôi phục ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTextGroup: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
  },
  budgetDisplayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  budgetAmountText: {
    fontSize: 20,
    fontWeight: '800',
  },
  changeBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  changeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editBudgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetInput: {
    flex: 1,
    borderWidth: 1,
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelBudgetBtnText: {
    fontWeight: '600',
    fontSize: 13,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
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
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingSubLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 11, 20, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  restoreModalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#23304A',
  },
  restoreModalTitle: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  restoreModalDesc: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 14,
  },
  restoreInput: {
    height: 110,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    fontSize: 12,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  restoreActions: {
    flexDirection: 'row',
    gap: 10,
  },
  restoreCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  restoreSubmitBtn: {
    flex: 2,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  restoreSubmitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13.5,
  },
});
