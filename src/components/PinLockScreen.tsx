import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AppLogo } from './AppLogo';

interface PinLockScreenProps {
  correctPin?: string;
  onUnlock: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  correctPin = '1234',
  onUnlock,
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleKeyPress = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (newPin.length === 4) {
      if (newPin === correctPin) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onUnlock();
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        triggerShake();
        setErrorMsg('Mã PIN không đúng, vui lòng thử lại');
        setTimeout(() => {
          setPin('');
          setErrorMsg('');
        }, 800);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const handleBiometricSimulation = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onUnlock();
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topSection}>
        <AppLogo size={64} />
        <Text style={styles.appTitle}>FinTrack Pro</Text>
        <Text style={styles.promptText}>Nhập mã PIN để mở khóa</Text>

        {/* 4 PIN Dots */}
        <Animated.View
          style={[
            styles.dotsRow,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < pin.length;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  isFilled ? styles.dotFilled : styles.dotEmpty,
                ]}
              />
            );
          })}
        </Animated.View>

        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <Text style={styles.hintText}>Mã mặc định: {correctPin}</Text>
        )}
      </View>

      {/* Numeric Keypad */}
      <View style={styles.keypad}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
        ].map((row, rIdx) => (
          <View key={rIdx} style={styles.keypadRow}>
            {row.map((digit) => (
              <TouchableOpacity
                key={digit}
                style={styles.keyBtn}
                onPress={() => handleKeyPress(digit)}
                activeOpacity={0.65}
              >
                <Text style={styles.keyDigit}>{digit}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Bottom row: FaceID / 0 / Delete */}
        <View style={styles.keypadRow}>
          <TouchableOpacity
            style={styles.keyActionBtn}
            onPress={handleBiometricSimulation}
            activeOpacity={0.7}
          >
            <Ionicons name="scan-outline" size={26} color="#38BDF8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.keyBtn}
            onPress={() => handleKeyPress('0')}
            activeOpacity={0.65}
          >
            <Text style={styles.keyDigit}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.keyActionBtn}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Ionicons name="backspace-outline" size={24} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#070B14',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
    zIndex: 99998,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 12,
  },
  promptText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 6,
    marginBottom: 26,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 12,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  dotEmpty: {
    borderColor: '#334155',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    borderColor: '#38BDF8',
    backgroundColor: '#38BDF8',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 6,
  },
  hintText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
  },
  keypad: {
    width: '85%',
    maxWidth: 320,
    gap: 16,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  keyBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#151D2F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#23304A',
  },
  keyDigit: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  keyActionBtn: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
