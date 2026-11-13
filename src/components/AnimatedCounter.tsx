import React, { useEffect, useState, useRef } from 'react';
import { Text, TextStyle } from 'react-native';
import { formatCurrency } from '../utils/formatters';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  style?: TextStyle | TextStyle[];
  prefix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 900,
  style,
  prefix = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const startValueRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startVal = startValueRef.current;
    const endVal = value;
    const startTime = Date.now();
    startTimeRef.current = startTime;

    const tick = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        // @ts-ignore
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        startValueRef.current = endVal;
      }
    };

    // @ts-ignore
    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  return (
    <Text style={style}>
      {prefix}
      {formatCurrency(displayValue)}
    </Text>
  );
};
