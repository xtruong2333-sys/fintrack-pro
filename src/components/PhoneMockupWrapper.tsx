import React from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';

interface PhoneMockupWrapperProps {
  children: React.ReactNode;
  isDark?: boolean;
}

export const PhoneMockupWrapper: React.FC<PhoneMockupWrapperProps> = ({
  children,
  isDark = true,
}) => {
  const { width } = useWindowDimensions();

  const isDesktopWeb = Platform.OS === 'web' && width > 500;

  if (!isDesktopWeb) {
    return <>{children}</>;
  }

  return (
    <View
      style={[
        styles.desktopContainer,
        { backgroundColor: isDark ? '#070B14' : '#E2E8F0' },
      ]}
    >
      {/* Vỏ khung iPhone 16 Pro kim loại Titanium */}
      <View
        style={[
          styles.phoneChassis,
          {
            backgroundColor: isDark ? '#111827' : '#1E293B',
            borderColor: isDark ? '#1F2937' : '#475569',
          },
        ]}
      >
        {/* Nút bấm vật lý bên cạnh máy */}
        <View style={styles.volumeUpButton} />
        <View style={styles.volumeDownButton} />
        <View style={styles.powerButton} />

        {/* Viền màn hình & Kính cường lực */}
        <View
          style={[
            styles.screenBezel,
            { backgroundColor: isDark ? '#0B0F19' : '#F8FAFC' },
          ]}
        >
          {/* Dynamic Island (Cụm tai thỏ viên thuốc của iPhone) */}
          <View style={styles.dynamicIslandContainer} pointerEvents="none">
            <View style={styles.dynamicIsland}>
              <View style={styles.cameraLens} />
            </View>
          </View>

          {/* Màn hình hiển thị nội dung app */}
          <View style={styles.appScreenArea}>
            {children}
          </View>

          {/* Thanh gạt Home Indicator của iOS */}
          <View style={styles.homeIndicatorContainer} pointerEvents="none">
            <View
              style={[
                styles.homeIndicatorBar,
                { backgroundColor: isDark ? '#F8FAFC' : '#0F172A' },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%' as any,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  phoneChassis: {
    width: 390,
    height: 800,
    maxHeight: '95%' as any,
    borderRadius: 50,
    padding: 10,
    borderWidth: 3.5,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.6,
    shadowRadius: 35,
    elevation: 25,
  },
  volumeUpButton: {
    position: 'absolute',
    left: -7,
    top: 140,
    width: 4,
    height: 44,
    backgroundColor: '#64748B',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  volumeDownButton: {
    position: 'absolute',
    left: -7,
    top: 196,
    width: 4,
    height: 44,
    backgroundColor: '#64748B',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
  },
  powerButton: {
    position: 'absolute',
    right: -7,
    top: 160,
    width: 4,
    height: 64,
    backgroundColor: '#64748B',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  screenBezel: {
    flex: 1,
    borderRadius: 40,
    overflow: 'hidden',
    position: 'relative',
  },
  dynamicIslandContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  dynamicIsland: {
    width: 100,
    height: 28,
    borderRadius: 16,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  cameraLens: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#1E293B',
  },
  appScreenArea: {
    flex: 1,
    paddingTop: 36,
  },
  homeIndicatorContainer: {
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  homeIndicatorBar: {
    width: 130,
    height: 4,
    borderRadius: 2,
  },
});
