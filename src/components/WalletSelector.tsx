import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WALLETS } from '../constants/categories';
import { Transaction, WalletType } from '../types';
import { formatCurrency } from '../utils/formatters';

interface WalletSelectorProps {
  transactions: Transaction[];
  selectedWallet: WalletType | 'all';
  onSelectWallet: (wallet: WalletType | 'all') => void;
  isDark?: boolean;
}

export const WalletSelector: React.FC<WalletSelectorProps> = ({
  transactions,
  selectedWallet,
  onSelectWallet,
  isDark = true,
}) => {
  // Tính số dư cho từng ví
  const getWalletBalance = (wId: WalletType) => {
    const txs = transactions.filter((t) => t.walletId === wId);
    const inc = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return inc - exp;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
          Nguồn Tiền (Ví)
        </Text>
        <TouchableOpacity onPress={() => onSelectWallet('all')}>
          <Text style={[styles.allText, selectedWallet === 'all' && styles.allTextActive]}>
            Tất cả ví
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
        {WALLETS.map((w) => {
          const isSelected = selectedWallet === w.id;
          const balance = getWalletBalance(w.id);

          return (
            <TouchableOpacity
              key={w.id}
              style={[
                styles.walletCard,
                { backgroundColor: isDark ? '#151D2F' : '#FFFFFF' },
                isSelected && { borderColor: w.color, borderWidth: 1.5 },
                !isSelected && { borderColor: isDark ? '#23304A' : '#E2E8F0' },
              ]}
              onPress={() => onSelectWallet(isSelected ? 'all' : w.id)}
              activeOpacity={0.75}
            >
              <View style={styles.cardTop}>
                <View style={[styles.iconCircle, { backgroundColor: `${w.color}20` }]}>
                  <Ionicons name={w.icon as any} size={18} color={w.color} />
                </View>
                {isSelected && (
                  <View style={[styles.activeDot, { backgroundColor: w.color }]} />
                )}
              </View>

              <Text style={[styles.walletName, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                {w.name}
              </Text>
              <Text style={[styles.walletBalance, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {formatCurrency(balance)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  allText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  allTextActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  scrollList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  walletCard: {
    width: 140,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  walletName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  walletBalance: {
    fontSize: 13,
    fontWeight: '800',
  },
});
