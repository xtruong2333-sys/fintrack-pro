import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AppLogo } from './AppLogo';

interface OnboardingModalProps {
  visible: boolean;
  onFinish: () => void;
}

const SLIDES = [
  {
    icon: 'wallet',
    iconColor: '#38BDF8',
    title: 'Quản Lý Đa Nguồn Tiền',
    description:
      'Theo dõi chính xác tiền mặt, tài khoản ngân hàng, ví MoMo/ZaloPay và sổ tiết kiệm trên cùng một ứng dụng.',
  },
  {
    icon: 'pie-chart',
    iconColor: '#F59E0B',
    title: 'Biểu Đồ & Trợ Lý Tài Chính',
    description:
      'Biểu đồ chi tiêu trực quan, tự động cảnh báo hạn mức ngân sách và phân tích sức khỏe tài chính thông minh.',
  },
  {
    icon: 'shield-checkmark',
    iconColor: '#10B981',
    title: 'Bảo Mật & Riêng Tư Tuyệt Đối',
    description:
      'Dữ liệu lưu an toàn 100% trên điện thoại của bạn, hỗ trợ khóa mã PIN bảo mật và xuất báo cáo Excel tiện lợi.',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ visible, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onFinish();
    }
  };

  const currentSlide = SLIDES[currentIndex];
  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Top Logo */}
          <View style={styles.topLogo}>
            <AppLogo size={52} />
          </View>

          {/* Icon Circle */}
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${currentSlide.iconColor}18` },
            ]}
          >
            <Ionicons
              name={currentSlide.icon as any}
              size={48}
              color={currentSlide.iconColor}
            />
          </View>

          {/* Texts */}
          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.description}>{currentSlide.description}</Text>

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentIndex ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>
              {isLast ? 'Bắt Đầu Ngay' : 'Tiếp Tục'}
            </Text>
            <Ionicons
              name={isLast ? 'rocket' : 'arrow-forward'}
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {!isLast && (
            <TouchableOpacity style={styles.skipButton} onPress={onFinish}>
              <Text style={styles.skipText}>Bỏ qua giới thiệu</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 11, 20, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#151D2F',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#23304A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  topLogo: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 26,
    paddingHorizontal: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 26,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#38BDF8',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: '#334155',
  },
  primaryButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skipButton: {
    marginTop: 14,
    padding: 6,
  },
  skipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});
