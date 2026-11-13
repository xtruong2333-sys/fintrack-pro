import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';
import { DEFAULT_BUDGET, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { getTodayString } from '../utils/formatters';

const TRANSACTIONS_KEY = '@transactions_v1';
const BUDGET_KEY = '@budget_v1';

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
      amount: 18500000,
      categoryId: 'salary',
      categoryName: 'Tiền lương',
      categoryIcon: 'wallet',
      categoryColor: '#2ED573',
      note: 'Lương tháng nhận qua tài khoản',
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
      note: 'Tiền thuê nhà + điện nước',
      date: getPastDate(4),
      createdAt: Date.now() - 4 * 86400000,
    },
    {
      id: 'tx_sample_3',
      type: 'expense',
      amount: 450000,
      categoryId: 'food',
      categoryName: 'Ăn uống',
      categoryIcon: 'fast-food',
      categoryColor: '#FF6B6B',
      note: 'Đi ăn tối cùng bạn bè',
      date: getPastDate(2),
      createdAt: Date.now() - 2 * 86400000,
    },
    {
      id: 'tx_sample_4',
      type: 'expense',
      amount: 650000,
      categoryId: 'shopping',
      categoryName: 'Mua sắm',
      categoryIcon: 'cart',
      categoryColor: '#4ECDC4',
      note: 'Mua sắm đồ dùng cá nhân',
      date: getPastDate(1),
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'tx_sample_5',
      type: 'income',
      amount: 1200000,
      categoryId: 'freelance',
      categoryName: 'Làm thêm / Phụ',
      categoryIcon: 'briefcase',
      categoryColor: '#9B59B6',
      note: 'Thu nhập làm thêm dự án',
      date: today,
      createdAt: Date.now() - 10000,
    },
    {
      id: 'tx_sample_6',
      type: 'expense',
      amount: 85000,
      categoryId: 'food',
      categoryName: 'Ăn uống',
      categoryIcon: 'fast-food',
      categoryColor: '#FF6B6B',
      note: 'Cà phê sáng và ăn trưa',
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
        // Khởi tạo dữ liệu mẫu lần đầu mở app
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

  async clearAllData(): Promise<void> {
    await AsyncStorage.removeItem(TRANSACTIONS_KEY);
    await AsyncStorage.removeItem(BUDGET_KEY);
  },

  async exportData(): Promise<string> {
    const transactions = await this.getTransactions();
    const budget = await this.getBudget();
    return JSON.stringify({ transactions, budget, exportedAt: new Date().toISOString() }, null, 2);
  },
};
