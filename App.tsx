import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Transaction } from './src/types';
import { StorageService } from './src/services/storage';
import { HomeScreen } from './src/screens/HomeScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AddTransactionModal } from './src/components/AddTransactionModal';
import { DEFAULT_BUDGET } from './src/constants/categories';

type TabType = 'home' | 'analytics' | 'history' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<number>(DEFAULT_BUDGET);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load data from local storage
  const loadData = useCallback(async () => {
    try {
      const [storedTransactions, storedBudget] = await Promise.all([
        StorageService.getTransactions(),
        StorageService.getBudget(),
      ]);
      setTransactions(storedTransactions);
      setBudget(storedBudget);
    } catch (e) {
      console.error('Error loading data:', e);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Add new transaction
  const handleAddTransaction = async (data: any) => {
    const newTx = await StorageService.addTransaction(data);
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Delete transaction
  const handleDeleteTransaction = async (id: string) => {
    await StorageService.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Update Budget
  const handleUpdateBudget = async (newBudget: number) => {
    await StorageService.setBudget(newBudget);
    setBudget(newBudget);
  };

  // Clear all data
  const handleClearData = async () => {
    await StorageService.clearAllData();
    setTransactions([]);
    setBudget(DEFAULT_BUDGET);
  };

  // Reset sample data
  const handleResetSampleData = async () => {
    await StorageService.clearAllData();
    await loadData();
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Main Screen Content */}
      <View style={styles.content}>
        {activeTab === 'home' && (
          <HomeScreen
            transactions={transactions}
            budget={budget}
            onOpenAddModal={() => setIsAddModalVisible(true)}
            onDeleteTransaction={handleDeleteTransaction}
            onNavigateToHistory={() => setActiveTab('history')}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsScreen transactions={transactions} />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            onOpenAddModal={() => setIsAddModalVisible(true)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            budget={budget}
            transactionCount={transactions.length}
            onUpdateBudget={handleUpdateBudget}
            onClearData={handleClearData}
            onResetSampleData={handleResetSampleData}
          />
        )}
      </View>

      {/* Floating Add Button for Center Tab */}
      <View style={styles.bottomNavWrapper}>
        <View style={styles.bottomTabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => handleTabPress('home')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'home' ? 'wallet' : 'wallet-outline'}
              size={24}
              color={activeTab === 'home' ? '#0F172A' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
              Tổng quan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => handleTabPress('analytics')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'analytics' ? 'bar-chart' : 'bar-chart-outline'}
              size={24}
              color={activeTab === 'analytics' ? '#0F172A' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, activeTab === 'analytics' && styles.tabLabelActive]}>
              Thống kê
            </Text>
          </TouchableOpacity>

          {/* Quick Center Add Button */}
          <View style={styles.centerButtonPlaceholder}>
            <TouchableOpacity
              style={styles.centerAddButton}
              onPress={() => {
                setIsAddModalVisible(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => handleTabPress('history')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'history' ? 'receipt' : 'receipt-outline'}
              size={24}
              color={activeTab === 'history' ? '#0F172A' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, activeTab === 'history' && styles.tabLabelActive]}>
              Lịch sử
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => handleTabPress('settings')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
              size={24}
              color={activeTab === 'settings' ? '#0F172A' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, activeTab === 'settings' && styles.tabLabelActive]}>
              Cài đặt
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={handleAddTransaction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? 28 : 0,
  },
  content: {
    flex: 1,
  },
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  bottomTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  centerButtonPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  centerAddButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
