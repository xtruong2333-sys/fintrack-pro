import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Path,
  Circle,
  G,
} from 'react-native-svg';

interface AppLogoProps {
  size?: number;
  glow?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 64, glow = true }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          {/* Main Gold-Blue Gradient */}
          <LinearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#38BDF8" />
            <Stop offset="50%" stopColor="#2563EB" />
            <Stop offset="100%" stopColor="#1E1B4B" />
          </LinearGradient>

          {/* Accent Gold Gradient */}
          <LinearGradient id="goldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#F59E0B" />
            <Stop offset="100%" stopColor="#FBBF24" />
          </LinearGradient>

          {/* Emerald Growth Gradient */}
          <LinearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#34D399" />
            <Stop offset="100%" stopColor="#059669" />
          </LinearGradient>
        </Defs>

        {/* Outer Glow Shield Frame */}
        <Rect
          x="10"
          y="10"
          width="80"
          height="80"
          rx="24"
          fill="url(#logoGrad)"
        />

        {/* Decorative Internal Border */}
        <Rect
          x="12"
          y="12"
          width="76"
          height="76"
          rx="22"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Wallet / Safe Body */}
        <G transform="translate(24, 28)">
          {/* Main Wallet Shape */}
          <Path
            d="M4 8C4 5.79086 5.79086 4 8 4H44C46.2091 4 48 5.79086 48 8V36C48 38.2091 46.2091 40 44 40H8C5.79086 40 4 38.2091 4 36V8Z"
            fill="rgba(15, 23, 42, 0.45)"
          />

          {/* Wallet Flap */}
          <Path
            d="M4 14C4 11.7909 5.79086 10 8 10H44C46.2091 10 48 11.7909 48 14V17H4V14Z"
            fill="rgba(255, 255, 255, 0.15)"
          />

          {/* Golden Growth Arrow */}
          <Path
            d="M12 30L22 20L28 26L38 15"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M31 15H38V22"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gem / Lock Center Dot */}
          <Circle cx="40" cy="25" r="4" fill="url(#emeraldGrad)" />
          <Circle cx="40" cy="25" r="1.5" fill="#FFFFFF" />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
