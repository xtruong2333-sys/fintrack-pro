import React, { useState, useRef } from 'react';
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
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { TransactionType, Category, WalletType, Wallet } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, WALLETS } from '../constants/categories';
import { formatCurrency, getTodayString } from '../utils/formatters';
import { OCRService, CandidateAmount } from '../services/ocrService';

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
    receiptImage?: string;
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
  const [selectedWallet, setSelectedWallet] = useState<Wallet>(WALLETS[1]);
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayString());
  const [receiptImage, setReceiptImage] = useState<string | undefined>(undefined);

  // Trạng thái quét hóa đơn OCR bằng AI
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [candidateList, setCandidateList] = useState<CandidateAmount[]>([]);
  const [detectedAmounts, setDetectedAmounts] = useState<number[]>([]);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

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

  // Kích hoạt hoạt họa tia Laser Quét OCR
  const startScanAnimation = () => {
    scanLineAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 }
    ).start();
  };

  // Xử lý ảnh hóa đơn thực tế qua bộ nhận diện OCR
  const processReceiptImage = async (imageUri: string, base64?: string | null) => {
    setReceiptImage(imageUri);
    setIsScanning(true);
    startScanAnimation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const ocrResult = await OCRService.scanReceipt(imageUri, base64 || undefined);
      setIsScanning(false);

      if (ocrResult.success && ocrResult.totalAmount > 0) {
        setRawAmount(ocrResult.totalAmount.toString());
        setCandidateList(ocrResult.candidates);
        setDetectedAmounts(ocrResult.detectedAmounts);

        // Tự động điền ghi chú nhận diện từ hóa đơn
        if (ocrResult.suggestedNote && (!note || note.startsWith('Hóa đơn'))) {
          setNote(ocrResult.suggestedNote);
        }

        // Tự động chọn danh mục phù hợp
        if (ocrResult.suggestedCategoryId) {
          const matchedCat = categories.find((c) => c.id === ocrResult.suggestedCategoryId);
          if (matchedCat) {
            setSelectedCategory(matchedCat);
          }
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setCandidateList([]);
        setDetectedAmounts([]);
        Alert.alert(
          'Không tìm thấy số tiền rõ ràng',
          'Ảnh hóa đơn có thể bị mờ hoặc không có số tiền rõ ràng. Bạn vui lòng tự nhập số tiền hoặc chụp lại góc thẳng hơn nhé.'
        );
      }
    } catch (err) {
      console.warn('OCR Scan error:', err);
      setIsScanning(false);
      Alert.alert(
        'Lỗi quét hóa đơn',
        'Không thể kết nối đến máy chủ phân tích hóa đơn. Bạn vui lòng tự nhập số tiền.'
      );
    }
  };

  // Chụp ảnh mới từ camera
  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Quyền truy cập Camera',
          'Vui lòng cấp quyền Camera trong Cài đặt thiết bị để chụp ảnh hóa đơn.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.6,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await processReceiptImage(result.assets[0].uri, result.assets[0].base64);
      }
    } catch (e) {
      console.warn('Camera launch error:', e);
      Alert.alert('Thông báo', 'Không thể khởi động camera.');
      setIsScanning(false);
    }
  };

  // Chọn ảnh có sẵn từ thư viện
  const handlePickFromLibrary = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Quyền truy cập Thư viện',
          'Vui lòng cấp quyền truy cập Thư viện ảnh để chọn hóa đơn.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.6,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await processReceiptImage(result.assets[0].uri, result.assets[0].base64);
      }
    } catch (e) {
      console.warn('Library launch error:', e);
      Alert.alert('Thông báo', 'Không thể mở thư viện ảnh.');
      setIsScanning(false);
    }
  };

  // Hộp thoại lựa chọn nguồn ảnh
  const handleSelectReceiptSource = () => {
    Alert.alert(
      'Quét Hóa Đơn Bằng AI',
      'Bạn muốn chụp ảnh trực tiếp hay chọn ảnh hóa đơn từ thư viện?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Chụp ảnh mới', onPress: handleTakePhoto },
        { text: 'Thư viện ảnh', onPress: handlePickFromLibrary },
      ]
    );
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
      receiptImage,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setRawAmount('');
    setNote('');
    setReceiptImage(undefined);
    setDetectedAmounts([]);
    setCandidateList([]);
    onClose();
  };

  const scanTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140],
  });

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
            <View style={styles.headerTitleGroup}>
              <Text style={[styles.headerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Thêm Giao Dịch
              </Text>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={11} color="#38BDF8" />
                <Text style={styles.aiBadgeText}>AI Quét Bill</Text>
              </View>
            </View>
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
            {/* PHẦN CHỤP & QUÉT HÓA ĐƠN AI */}
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
              Hóa Đơn & Quét Số Tiền AI
            </Text>

            {receiptImage ? (
              <View style={styles.imageScanContainer}>
                <Image source={{ uri: receiptImage }} style={styles.imagePreview} />

                {/* Laser Scanning Animation Overlay */}
                {isScanning && (
                  <View style={styles.scanningOverlay}>
                    <Animated.View
                      style={[
                        styles.laserLine,
                        { transform: [{ translateY: scanTranslateY }] },
                      ]}
                    />
                    <View style={styles.scanningBadge}>
                      <Ionicons name="scan-outline" size={16} color="#38BDF8" />
                      <Text style={styles.scanningText}>AI đang phân tích hóa đơn & đọc số tiền...</Text>
                    </View>
                  </View>
                )}

                {/* Detected success tag */}
                {!isScanning && parseInt(rawAmount || '0', 10) > 0 && (
                  <View style={styles.detectedSuccessTag}>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                    <Text style={styles.detectedSuccessText}>
                      Đã trích xuất số tiền: {formatCurrency(parseInt(rawAmount || '0', 10))}
                    </Text>
                  </View>
                )}

                {/* Remove Photo Button */}
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => {
                    setReceiptImage(undefined);
                    setDetectedAmounts([]);
                    setCandidateList([]);
                  }}
                >
                  <Ionicons name="trash" size={14} color="#FFFFFF" />
                  <Text style={styles.removeImageText}>Đổi ảnh</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={[
                  styles.uploadPhotoBtn,
                  {
                    backgroundColor: isDark ? '#0B0F19' : '#F8FAFC',
                    borderColor: isDark ? '#23304A' : '#CBD5E1',
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.uploadCardMain}
                  onPress={handleSelectReceiptSource}
                  activeOpacity={0.7}
                >
                  <View style={styles.uploadIconCircle}>
                    <Ionicons name="scan-outline" size={22} color="#38BDF8" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.uploadTitleRow}>
                      <Text style={[styles.uploadPhotoTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                        Quét Hóa Đơn Tự Động
                      </Text>
                      <View style={styles.ocrTag}>
                        <Text style={styles.ocrTagText}>AI OCR THẬT</Text>
                      </View>
                    </View>
                    <Text style={styles.uploadPhotoSubtitle}>
                      Tự động đọc số tiền thật từ hóa đơn, bạn chỉ cần chọn danh mục!
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* 2 Nút thao tác nhanh: Chụp ngay & Chọn từ thư viện */}
                <View
                  style={[
                    styles.uploadActionButtonsRow,
                    { borderTopColor: isDark ? '#1E293B' : '#E2E8F0' },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.uploadActionPill,
                      { backgroundColor: isDark ? '#1E293B' : '#EDF2F7' },
                    ]}
                    onPress={handleTakePhoto}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="camera" size={15} color="#38BDF8" />
                    <Text
                      style={[
                        styles.uploadActionPillText,
                        { color: isDark ? '#F8FAFC' : '#0F172A' },
                      ]}
                    >
                      Chụp camera
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.uploadActionPill,
                      { backgroundColor: isDark ? '#1E293B' : '#EDF2F7' },
                    ]}
                    onPress={handlePickFromLibrary}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="images" size={15} color="#10B981" />
                    <Text
                      style={[
                        styles.uploadActionPillText,
                        { color: isDark ? '#F8FAFC' : '#0F172A' },
                      ]}
                    >
                      Thư viện ảnh
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Các số tiền AI nhận diện được từ hóa đơn (bấm để đổi nhanh nếu cần) */}
            {candidateList.length > 0 ? (
              <View style={styles.detectedBox}>
                <View style={styles.detectedBoxHeader}>
                  <Ionicons name="sparkles" size={13} color="#38BDF8" />
                  <Text style={styles.detectedBoxLabel}>
                    Số tiền trích xuất từ hóa đơn (chạm để chọn lại nếu cần):
                  </Text>
                </View>
                <View style={styles.detectedChipsRow}>
                  {candidateList.map((cand, idx) => {
                    const isSelected = rawAmount === cand.amount.toString();
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.detectedChip,
                          isSelected && styles.detectedChipActive,
                        ]}
                        onPress={() => {
                          setRawAmount(cand.amount.toString());
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                      >
                        <Ionicons
                          name={isSelected ? 'checkmark-circle' : 'cash-outline'}
                          size={13}
                          color={isSelected ? '#FFFFFF' : '#38BDF8'}
                        />
                        <Text
                          style={[
                            styles.detectedChipText,
                            isSelected && styles.detectedChipTextActive,
                          ]}
                        >
                          {cand.label}: {formatCurrency(cand.amount)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : detectedAmounts.length > 0 ? (
              <View style={styles.detectedBox}>
                <View style={styles.detectedBoxHeader}>
                  <Ionicons name="sparkles" size={13} color="#38BDF8" />
                  <Text style={styles.detectedBoxLabel}>
                    Số tiền trích xuất từ hóa đơn (chạm để chọn lại nếu cần):
                  </Text>
                </View>
                <View style={styles.detectedChipsRow}>
                  {detectedAmounts.map((amt, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.detectedChip,
                        rawAmount === amt.toString() && styles.detectedChipActive,
                      ]}
                      onPress={() => {
                        setRawAmount(amt.toString());
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    >
                      <Ionicons
                        name="cash-outline"
                        size={13}
                        color={rawAmount === amt.toString() ? '#FFFFFF' : '#38BDF8'}
                      />
                      <Text
                        style={[
                          styles.detectedChipText,
                          rawAmount === amt.toString() && styles.detectedChipTextActive,
                        ]}
                      >
                        {formatCurrency(amt)} {idx === 0 ? '(Tổng)' : ''}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}

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
                Số tiền giao dịch (VND)
              </Text>
              <View style={styles.amountRow}>
                <TextInput
                  style={[
                    styles.amountInput,
                    { color: type === 'expense' ? '#F87171' : '#34D399' },
                  ]}
                  keyboardType="numeric"
                  placeholder="0 đ"
                  placeholderTextColor={isDark ? '#475569' : '#CBD5E1'}
                  value={rawAmount ? formatCurrency(parseInt(rawAmount, 10)) : ''}
                  onChangeText={(text) => {
                    const clean = text.replace(/[^0-9]/g, '');
                    setRawAmount(clean);
                  }}
                />
              </View>
            </View>

            {/* Quick Add Chips */}
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

            {/* Category Selector (PHẦN DUY NHẤT NGƯỜI DÙNG CẦN CHỌN) */}
            <View style={styles.categoryTitleRow}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
                Chọn Danh Mục
              </Text>
              <Text style={styles.mustSelectTag}>* Bắt buộc chọn</Text>
            </View>
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
                      isSelected && { backgroundColor: `${cat.color}25`, borderWidth: 2 },
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
                        isSelected && { color: isDark ? '#F8FAFC' : '#0F172A', fontWeight: '800' },
                      ]}
                      numberOfLines={1}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Wallet Picker */}
            <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#334155' }]}>
              Nguồn Tiền (Ví)
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
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  aiBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#38BDF8',
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
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 10,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mustSelectTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#38BDF8',
  },
  uploadPhotoBtn: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  uploadCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  uploadActionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  uploadActionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  uploadActionPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  detectedBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  uploadIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  uploadPhotoTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  ocrTag: {
    backgroundColor: '#10B981',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  ocrTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  uploadPhotoSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  imageScanContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    height: 160,
    backgroundColor: '#0F172A',
    marginBottom: 14,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 7, 18, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  laserLine: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  scanningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  scanningText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  detectedSuccessTag: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  detectedSuccessText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  detectedBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    marginBottom: 14,
  },
  detectedBoxLabel: {
    fontSize: 11.5,
    color: '#38BDF8',
    fontWeight: '600',
    marginBottom: 6,
  },
  detectedChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#151D2F',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#23304A',
  },
  detectedChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#38BDF8',
  },
  detectedChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#38BDF8',
  },
  detectedChipTextActive: {
    color: '#FFFFFF',
  },
  segmentedContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
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
    padding: 14,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
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
