import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { AppLogo } from './AppLogo';

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onFinish }) => {
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;
  const containerOpacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Phóng to Logo & Hiện dần
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // 2. Chữ hiện lên
      Animated.timing(textOpacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // 3. Giữ lại 700ms cho người dùng ngắm nhìn
      Animated.delay(700),
      // 4. Mờ dần để vào App
      Animated.timing(containerOpacityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, [containerOpacityAnim, onFinish, opacityAnim, scaleAnim, textOpacityAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacityAnim }]}>
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={styles.glowCircle} />
        <AppLogo size={90} />
      </Animated.View>

      <Animated.View style={[styles.textGroup, { opacity: textOpacityAnim }]}>
        <Text style={styles.appTitle}>FinTrack Pro</Text>
        <Text style={styles.appSubtitle}>LÀM CHỦ TÀI CHÍNH CÁ NHÂN</Text>

        <View style={styles.loadingBarWrapper}>
          <View style={styles.loadingBar} />
        </View>
      </Animated.View>

      <Text style={styles.footerText}>Secure Banking Grade Encryption</Text>
    </Animated.View>
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
    justifyContent: 'center',
    zIndex: 99999,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 24,
  },
  glowCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  textGroup: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 2.5,
    marginBottom: 28,
  },
  loadingBarWrapper: {
    width: 120,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    width: '60%',
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
});
