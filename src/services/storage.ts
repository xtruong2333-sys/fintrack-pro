import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, AppSettings, ThemeMode } from '../types';
import { DEFAULT_BUDGET } from '../constants/categories';
import { getTodayString } from '../utils/formatters';

const TRANSACTIONS_KEY = '@transactions_v2';
const BUDGET_KEY = '@budget_v2';
const SETTINGS_KEY = '@app_settings_v2';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark', // Mặc định Dark Mode Pro sang trọng
  pinEnabled: false,
  pinCode: '1234',
  hasSeenOnboarding: false,
};

const getInitialSampleData = (): Transaction[] => {
  const today = getTodayString();
  const d = new Date();
  
  const getPastDate = (daysAgo: number) => {
    const past = new Date(d);
    past.setDate(past.getDate() - daysAgo);
    const year = past.getFullYear();
    const month = String(past.getMonth() + 1).padStart(2, '0');
    const day = String(past.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return [
    {
      id: 'tx_sample_1',
      type: 'income',
      amount: 22000000,
      categoryId: 'salary',
      categoryName: 'Tiền lương',
      categoryIcon: 'wallet',
      categoryColor: '#2ED573',
      walletId: 'bank',
      walletName: 'Ngân hàng',
      note: 'Lương tháng nhận qua Techcombank',
      date: getPastDate(5),
      createdAt: Date.now() - 5 * 86400000,
    },
    {
      id: 'tx_sample_2',
      type: 'expense',
      amount: 4500000,
      categoryId: 'bills',
      categoryName: 'Hóa đơn & Nhà',
      categoryIcon: 'home',
      categoryColor: '#F7B731',
      walletId: 'bank',
      walletName: 'Ngân hàng',
      note: 'Tiền thuê căn hộ tháng này',
      date: getPastDate(4),
      createdAt: Date.now() - 4 * 86400000,
    },
    {
      id: 'tx_sample_3',
      type: 'expense',
      amount: 320000,
      categoryId: 'food',
      categoryName: 'Ăn uống',
      categoryIcon: 'fast-food',
      categoryColor: '#FF6B6B',
      walletId: 'ewallet',
      walletName: 'Ví điện tử',
      note: 'Buffet lẩu cùng đồng nghiệp',
      date: getPastDate(2),
      createdAt: Date.now() - 2 * 86400000,
    },
    {
      id: 'tx_sample_4',
      type: 'expense',
      amount: 580000,
      categoryId: 'shopping',
      categoryName: 'Mua sắm',
      categoryIcon: 'cart',
      categoryColor: '#4ECDC4',
      walletId: 'cash',
      walletName: 'Tiền mặt',
      note: 'Mua giày & phụ kiện thể thao',
      date: getPastDate(1),
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'tx_sample_5',
      type: 'income',
      amount: 3500000,
      categoryId: 'investment',
      categoryName: 'Đầu tư & Lãi',
      categoryIcon: 'trending-up',
      categoryColor: '#1E90FF',
      walletId: 'savings',
      walletName: 'Sổ tiết kiệm',
      note: 'Cổ tức & lợi nhuận tài chính',
      date: today,
      createdAt: Date.now() - 20000,
    },
    {
      id: 'tx_sample_6',
      type: 'expense',
      amount: 65000,
      categoryId: 'food',
      categoryName: 'Ăn uống',
      categoryIcon: 'fast-food',
      categoryColor: '#FF6B6B',
      walletId: 'cash',
      walletName: 'Tiền mặt',
      note: 'Cà phê sáng Highlands Coffee',
      date: today,
      createdAt: Date.now(),
    },
  ];
};

export const StorageService = {
  async getTransactions(): Promise<Transaction[]> {
    try {
      const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      if (!data) {
        const sample = getInitialSampleData();
        await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(sample));
        return sample;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error fetching transactions:', e);
      return [];
    }
  },

  async addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const current = await this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: Date.now(),
    };
    const updated = [newTx, ...current];
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
    return newTx;
  },

  async deleteTransaction(id: string): Promise<void> {
    const current = await this.getTransactions();
    const filtered = current.filter((item) => item.id !== id);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filtered));
  },

  async getBudget(): Promise<number> {
    try {
      const val = await AsyncStorage.getItem(BUDGET_KEY);
      return val ? Number(val) : DEFAULT_BUDGET;
    } catch (e) {
      return DEFAULT_BUDGET;
    }
  },

  async setBudget(budget: number): Promise<void> {
    await AsyncStorage.setItem(BUDGET_KEY, budget.toString());
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const val = await AsyncStorage.getItem(SETTINGS_KEY);
      return val ? { ...DEFAULT_SETTINGS, ...JSON.parse(val) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  async updateSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...partial };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  },

  async clearAllData(): Promise<void> {
    await AsyncStorage.removeItem(TRANSACTIONS_KEY);
    await AsyncStorage.removeItem(BUDGET_KEY);
  },

  async resetToSampleData(): Promise<Transaction[]> {
    const sample = getInitialSampleData();
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(sample));
    await AsyncStorage.setItem(BUDGET_KEY, DEFAULT_BUDGET.toString());
    return sample;
  },
};
