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
import { Transaction, AppSettings, ThemeMode } from './src/types';
import { StorageService } from './src/services/storage';
import { HomeScreen } from './src/screens/HomeScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AddTransactionModal } from './src/components/AddTransactionModal';
import { PhoneMockupWrapper } from './src/components/PhoneMockupWrapper';
import { AnimatedSplashScreen } from './src/components/AnimatedSplashScreen';
import { OnboardingModal } from './src/components/OnboardingModal';
import { PinLockScreen } from './src/components/PinLockScreen';
import { DEFAULT_BUDGET } from './src/constants/categories';

type TabType = 'home' | 'analytics' | 'history' | 'settings';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<number>(DEFAULT_BUDGET);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    pinEnabled: false,
    pinCode: '1234',
    hasSeenOnboarding: false,
  });
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load data from local storage
  const loadData = useCallback(async () => {
    try {
      const [storedTransactions, storedBudget, storedSettings] = await Promise.all([
        StorageService.getTransactions(),
        StorageService.getBudget(),
        StorageService.getSettings(),
      ]);
      setTransactions(storedTransactions);
      setBudget(storedBudget);
      setSettings(storedSettings);

      // Check security & onboarding
      if (storedSettings.pinEnabled) {
        setIsLocked(true);
      }
      if (!storedSettings.hasSeenOnboarding) {
        setShowOnboarding(true);
      }
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

  const handleAddTransaction = async (data: any) => {
    const newTx = await StorageService.addTransaction(data);
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = async (id: string) => {
    await StorageService.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateBudget = async (newBudget: number) => {
    await StorageService.setBudget(newBudget);
    setBudget(newBudget);
  };

  const handleUpdateSettings = async (partial: Partial<AppSettings>) => {
    const updated = await StorageService.updateSettings(partial);
    setSettings(updated);
  };

  const handleToggleTheme = () => {
    const newTheme: ThemeMode = settings.theme === 'dark' ? 'light' : 'dark';
    handleUpdateSettings({ theme: newTheme });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleClearData = async () => {
    await StorageService.clearAllData();
    setTransactions([]);
    setBudget(DEFAULT_BUDGET);
  };

  const handleResetSampleData = async () => {
    const samples = await StorageService.resetToSampleData();
    setTransactions(samples);
    setBudget(DEFAULT_BUDGET);
  };

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const isDark = settings.theme === 'dark';

  return (
    <PhoneMockupWrapper isDark={isDark}>
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: isDark ? '#0B0F19' : '#F8FAFC' },
        ]}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />

        {/* 1. Animated Splash Screen */}
        {showSplash && (
          <AnimatedSplashScreen onFinish={() => setShowSplash(false)} />
        )}

        {/* 2. Security PIN Lock Screen */}
        {!showSplash && isLocked && (
          <PinLockScreen
            correctPin={settings.pinCode || '1234'}
            onUnlock={() => setIsLocked(false)}
          />
        )}

        {/* 3. Onboarding Intro Modal */}
        {!showSplash && !isLocked && showOnboarding && (
          <OnboardingModal
            visible={showOnboarding}
            onFinish={() => {
              setShowOnboarding(false);
              handleUpdateSettings({ hasSeenOnboarding: true });
            }}
          />
        )}

        {/* 4. Main App Content */}
        <View style={styles.content}>
          {activeTab === 'home' && (
            <HomeScreen
              transactions={transactions}
              budget={budget}
              theme={settings.theme}
              onToggleTheme={handleToggleTheme}
              onOpenAddModal={() => setIsAddModalVisible(true)}
              onDeleteTransaction={handleDeleteTransaction}
              onNavigateToHistory={() => setActiveTab('history')}
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsScreen
              transactions={transactions}
              theme={settings.theme}
              onToggleTheme={handleToggleTheme}
            />
          )}

          {activeTab === 'history' && (
            <HistoryScreen
              transactions={transactions}
              theme={settings.theme}
              onToggleTheme={handleToggleTheme}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAddModal={() => setIsAddModalVisible(true)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              budget={budget}
              transactions={transactions}
              settings={settings}
              theme={settings.theme}
              onToggleTheme={handleToggleTheme}
              onUpdateBudget={handleUpdateBudget}
              onUpdateSettings={handleUpdateSettings}
              onClearData={handleClearData}
              onResetSampleData={handleResetSampleData}
              onShowOnboarding={() => setShowOnboarding(true)}
            />
          )}
        </View>

        {/* Bottom Tab Bar */}
        <View style={styles.bottomNavWrapper}>
          <View
            style={[
              styles.bottomTabBar,
              {
                backgroundColor: isDark ? '#111827' : '#FFFFFF',
                borderTopColor: isDark ? '#1F2937' : '#F1F5F9',
              },
            ]}
          >
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => handleTabPress('home')}
              activeOpacity={0.7}
            >
              <Ionicons
                name={activeTab === 'home' ? 'wallet' : 'wallet-outline'}
                size={23}
                color={activeTab === 'home' ? '#38BDF8' : isDark ? '#64748B' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isDark ? '#64748B' : '#94A3B8' },
                  activeTab === 'home' && { color: '#38BDF8', fontWeight: '800' },
                ]}
                numberOfLines={1}
              >
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
                size={23}
                color={activeTab === 'analytics' ? '#38BDF8' : isDark ? '#64748B' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isDark ? '#64748B' : '#94A3B8' },
                  activeTab === 'analytics' && { color: '#38BDF8', fontWeight: '800' },
                ]}
                numberOfLines={1}
              >
                Thống kê
              </Text>
            </TouchableOpacity>

            {/* Quick Center Add Button with Pulse Glow */}
            <View style={styles.centerButtonPlaceholder}>
              <TouchableOpacity
                style={[
                  styles.centerAddButton,
                  { backgroundColor: isDark ? '#2563EB' : '#0F172A' },
                ]}
                onPress={() => {
                  setIsAddModalVisible(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => handleTabPress('history')}
              activeOpacity={0.7}
            >
              <Ionicons
                name={activeTab === 'history' ? 'receipt' : 'receipt-outline'}
                size={23}
                color={activeTab === 'history' ? '#38BDF8' : isDark ? '#64748B' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isDark ? '#64748B' : '#94A3B8' },
                  activeTab === 'history' && { color: '#38BDF8', fontWeight: '800' },
                ]}
                numberOfLines={1}
              >
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
                size={23}
                color={activeTab === 'settings' ? '#38BDF8' : isDark ? '#64748B' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isDark ? '#64748B' : '#94A3B8' },
                  activeTab === 'settings' && { color: '#38BDF8', fontWeight: '800' },
                ]}
                numberOfLines={1}
              >
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
          isDark={isDark}
        />
      </SafeAreaView>
    </PhoneMockupWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    marginTop: 3,
  },
  centerButtonPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  centerAddButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
