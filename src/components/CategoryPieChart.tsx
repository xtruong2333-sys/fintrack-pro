import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { formatCurrency } from '../utils/formatters';

interface CategoryBreakdown {
  id: string;
  name: string;
  amount: number;
  color: string;
  icon: string;
  percentage: number;
}

interface CategoryPieChartProps {
  data: CategoryBreakdown[];
  totalAmount: number;
  title?: string;
  isDark?: boolean;
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  totalAmount,
  title = 'Chi tiêu theo danh mục',
  isDark = true,
}) => {
  if (data.length === 0 || totalAmount === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            backgroundColor: isDark ? '#151D2F' : '#FFFFFF',
            borderColor: isDark ? '#23304A' : '#E2E8F0',
          },
        ]}
      >
        <Text style={[styles.emptyText, { color: isDark ? '#64748B' : '#94A3B8' }]}>
          Chưa có dữ liệu chi tiêu trong kỳ này
        </Text>
      </View>
    );
  }

  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#151D2F' : '#FFFFFF',
          borderColor: isDark ? '#23304A' : '#E2E8F0',
        },
      ]}
    >
      <Text style={[styles.chartTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
        {title}
      </Text>

      <View style={styles.chartAndCenterWrapper}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isDark ? '#1E293B' : '#F1F5F9'}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Slices */}
            {data.map((item, index) => {
              const strokeDashoffset = circumference - (circumference * item.percentage) / 100;
              const rotation = (accumulatedPercent / 100) * 360;
              accumulatedPercent += item.percentage;

              return (
                <Circle
                  key={item.id + index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  transform={`rotate(${rotation}, ${size / 2}, ${size / 2})`}
                />
              );
            })}
          </G>
        </Svg>

        <View style={styles.centerLabel}>
          <Text style={[styles.centerSmallText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Tổng cộng
          </Text>
          <Text
            style={[styles.centerAmountText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatCurrency(totalAmount)}
          </Text>
        </View>
      </View>

      {/* Legend list */}
      <View style={styles.legendContainer}>
        {data.map((item) => (
          <View key={item.id} style={styles.legendRow}>
            <View style={styles.legendLeft}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <Text
                style={[styles.categoryName, { color: isDark ? '#CBD5E1' : '#334155' }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
            </View>
            <View style={styles.legendRight}>
              <Text
                style={[styles.categoryAmount, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
                numberOfLines={1}
              >
                {formatCurrency(item.amount)}
              </Text>
              <Text style={[styles.percentageText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                {item.percentage.toFixed(1)}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    marginBottom: 16,
  },
  chartAndCenterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 8,
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
  },
  centerSmallText: {
    fontSize: 11,
    fontWeight: '500',
  },
  centerAmountText: {
    fontSize: 13.5,
    fontWeight: '800',
    marginTop: 2,
  },
  legendContainer: {
    marginTop: 20,
    gap: 10,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  colorDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginRight: 8,
    flexShrink: 0,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  categoryAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    width: 44,
    textAlign: 'right',
  },
  emptyContainer: {
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    marginVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 13.5,
  },
});
