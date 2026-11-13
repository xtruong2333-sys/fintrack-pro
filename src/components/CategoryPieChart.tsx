import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';
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
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  totalAmount,
  title = 'Chi tiêu theo danh mục',
}) => {
  if (data.length === 0 || totalAmount === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có dữ liệu chi tiêu trong kỳ này</Text>
      </View>
    );
  }

  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>{title}</Text>

      <View style={styles.chartAndCenterWrapper}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#F1F5F9"
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
          <Text style={styles.centerSmallText}>Tổng cộng</Text>
          <Text style={styles.centerAmountText} numberOfLines={1}>
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
              <Text style={styles.categoryName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
            <View style={styles.legendRight}>
              <Text style={styles.categoryAmount}>{formatCurrency(item.amount)}</Text>
              <Text style={styles.percentageText}>{item.percentage.toFixed(1)}%</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
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
    color: '#64748B',
    fontWeight: '500',
  },
  centerAmountText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
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
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  percentageText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    width: 44,
    textAlign: 'right',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    marginVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
  },
});
