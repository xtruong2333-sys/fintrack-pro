import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, AppSettings, RecurringBill, SavingsGoal } from '../types';
import { DEFAULT_BUDGET } from '../constants/categories';
import { getTodayString } from '../utils/formatters';

const TRANSACTIONS_KEY = '@transactions_v2';
const BUDGET_KEY = '@budget_v2';
const SETTINGS_KEY = '@app_settings_v2';
const RECURRING_BILLS_KEY = '@recurring_bills_v2';
const SAVINGS_GOALS_KEY = '@savings_goals_v2';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  pinEnabled: false,
  pinCode: '1234',
  hasSeenOnboarding: false,
};

const getInitialBills = (): RecurringBill[] => [
  {
    id: 'bill_1',
    name: 'Tiền thuê căn hộ',
    amount: 4500000,
    dueDay: 5,
    categoryId: 'bills',
    categoryName: 'Hóa đơn & Nhà',
    categoryIcon: 'home',
    categoryColor: '#F7B731',
    walletId: 'bank',
    walletName: 'Ngân hàng',
    isPaidThisMonth: false,
    note: 'Chuyển khoản cho chủ nhà',
  },
  {
    id: 'bill_2',
    name: 'Internet FPT Telecom',
    amount: 250000,
    dueDay: 15,
    categoryId: 'bills',
    categoryName: 'Hóa đơn & Nhà',
    categoryIcon: 'wifi',
    categoryColor: '#45B7D1',
    walletId: 'ewallet',
    walletName: 'Ví điện tử',
    isPaidThisMonth: false,
    note: 'Gói cáp quang tốc độ cao',
  },
  {
    id: 'bill_3',
    name: 'Gói Netflix Premium 4K',
    amount: 260000,
    dueDay: 20,
    categoryId: 'entertainment',
    categoryName: 'Giải trí',
    categoryIcon: 'film',
    categoryColor: '#E17055',
    walletId: 'bank',
    walletName: 'Ngân hàng',
    isPaidThisMonth: true,
    lastPaidDate: '2026-11-01',
    note: 'Gia hạn tự động qua thẻ Visa',
  },
  {
    id: 'bill_4',
    name: 'Gói tập Gym / Fitness',
    amount: 500000,
    dueDay: 28,
    categoryId: 'health',
    categoryName: 'Sức khỏe & Y tế',
    categoryIcon: 'fitness',
    categoryColor: '#FC5C65',
    walletId: 'ewallet',
    walletName: 'Ví điện tử',
    isPaidThisMonth: false,
    note: 'Gói hội viên California Fitness',
  },
];

const getInitialGoals = (): SavingsGoal[] => [
  {
    id: 'goal_1',
    name: 'Mua iPhone 16 Pro Max',
    targetAmount: 34990000,
    currentAmount: 24500000,
    icon: 'phone-portrait',
    color: '#38BDF8',
    deadline: '2026-12-31',
  },
  {
    id: 'goal_2',
    name: 'Du lịch Nhật Bản mùa xuân',
    targetAmount: 45000000,
    currentAmount: 18000000,
    icon: 'airplane',
    color: '#FD79A8',
    deadline: '2027-04-15',
  },
  {
    id: 'goal_3',
    name: 'Quỹ Dự Phòng Khẩn Cấp',
    targetAmount: 60000000,
    currentAmount: 42000000,
    icon: 'shield-checkmark',
    color: '#10B981',
  },
];

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
      note: 'Buffet lẩu Haidilao cùng team',
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
      note: 'Mua giày & áo chạy bộ',
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
  // --- TRANSACTIONS ---
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

  // --- RECURRING BILLS (MỤC 2) ---
  async getRecurringBills(): Promise<RecurringBill[]> {
    try {
      const data = await AsyncStorage.getItem(RECURRING_BILLS_KEY);
      if (!data) {
        const initial = getInitialBills();
        await AsyncStorage.setItem(RECURRING_BILLS_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  },

  async addRecurringBill(bill: Omit<RecurringBill, 'id'>): Promise<RecurringBill> {
    const current = await this.getRecurringBills();
    const newBill: RecurringBill = {
      ...bill,
      id: 'bill_' + Date.now(),
    };
    const updated = [...current, newBill];
    await AsyncStorage.setItem(RECURRING_BILLS_KEY, JSON.stringify(updated));
    return newBill;
  },

  async payRecurringBill(billId: string): Promise<{ bill: RecurringBill; tx: Transaction } | null> {
    const bills = await this.getRecurringBills();
    const index = bills.findIndex((b) => b.id === billId);
    if (index === -1) return null;

    const targetBill = bills[index];
    const today = getTodayString();

    // 1. Đánh dấu hóa đơn đã thanh toán
    targetBill.isPaidThisMonth = true;
    targetBill.lastPaidDate = today;
    bills[index] = targetBill;
    await AsyncStorage.setItem(RECURRING_BILLS_KEY, JSON.stringify(bills));

    // 2. Tạo một giao dịch chi tiêu thực tế tương ứng
    const newTx = await this.addTransaction({
      type: 'expense',
      amount: targetBill.amount,
      categoryId: targetBill.categoryId,
      categoryName: targetBill.categoryName,
      categoryIcon: targetBill.categoryIcon,
      categoryColor: targetBill.categoryColor,
      walletId: targetBill.walletId,
      walletName: targetBill.walletName,
      note: `Thanh toán định kỳ: ${targetBill.name}`,
      date: today,
    });

    return { bill: targetBill, tx: newTx };
  },

  async deleteRecurringBill(billId: string): Promise<void> {
    const current = await this.getRecurringBills();
    const filtered = current.filter((b) => b.id !== billId);
    await AsyncStorage.setItem(RECURRING_BILLS_KEY, JSON.stringify(filtered));
  },

  // --- SAVINGS GOALS (MỤC 1) ---
  async getSavingsGoals(): Promise<SavingsGoal[]> {
    try {
      const data = await AsyncStorage.getItem(SAVINGS_GOALS_KEY);
      if (!data) {
        const initial = getInitialGoals();
        await AsyncStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  },

  async addSavingsGoal(goal: Omit<SavingsGoal, 'id'>): Promise<SavingsGoal> {
    const current = await this.getSavingsGoals();
    const newGoal: SavingsGoal = {
      ...goal,
      id: 'goal_' + Date.now(),
    };
    const updated = [...current, newGoal];
    await AsyncStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(updated));
    return newGoal;
  },

  async depositSavingsGoal(goalId: string, amount: number): Promise<SavingsGoal | null> {
    const goals = await this.getSavingsGoals();
    const index = goals.findIndex((g) => g.id === goalId);
    if (index === -1) return null;

    goals[index].currentAmount = Math.min(
      goals[index].targetAmount,
      goals[index].currentAmount + amount
    );
    await AsyncStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(goals));
    return goals[index];
  },

  async deleteSavingsGoal(goalId: string): Promise<void> {
    const current = await this.getSavingsGoals();
    const filtered = current.filter((g) => g.id !== goalId);
    await AsyncStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(filtered));
  },

  // --- BUDGET & SETTINGS ---
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
    await AsyncStorage.multiRemove([
      TRANSACTIONS_KEY,
      BUDGET_KEY,
      RECURRING_BILLS_KEY,
      SAVINGS_GOALS_KEY,
    ]);
  },

  async resetToSampleData(): Promise<{
    transactions: Transaction[];
    bills: RecurringBill[];
    goals: SavingsGoal[];
  }> {
    const sampleTxs = getInitialSampleData();
    const sampleBills = getInitialBills();
    const sampleGoals = getInitialGoals();

    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(sampleTxs));
    await AsyncStorage.setItem(RECURRING_BILLS_KEY, JSON.stringify(sampleBills));
    await AsyncStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(sampleGoals));
    await AsyncStorage.setItem(BUDGET_KEY, DEFAULT_BUDGET.toString());

    return { transactions: sampleTxs, bills: sampleBills, goals: sampleGoals };
  },

  // --- BACKUP & RESTORE (MỤC 5) ---
  async createFullBackupJSON(): Promise<string> {
    const [transactions, budget, settings, bills, goals] = await Promise.all([
      this.getTransactions(),
      this.getBudget(),
      this.getSettings(),
      this.getRecurringBills(),
      this.getSavingsGoals(),
    ]);

    const backupObject = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      app: 'FinTrack Pro',
      data: {
        transactions,
        budget,
        settings,
        recurringBills: bills,
        savingsGoals: goals,
      },
    };

    return JSON.stringify(backupObject, null, 2);
  },

  async restoreFromBackupJSON(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.data) return false;

      const { transactions, budget, settings, recurringBills, savingsGoals } = parsed.data;

      if (transactions) {
        await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
      }
      if (budget) {
        await AsyncStorage.setItem(BUDGET_KEY, budget.toString());
      }
      if (settings) {
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      }
      if (recurringBills) {
        await AsyncStorage.setItem(RECURRING_BILLS_KEY, JSON.stringify(recurringBills));
      }
      if (savingsGoals) {
        await AsyncStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(savingsGoals));
      }

      return true;
    } catch (e) {
      console.error('Failed to restore backup:', e);
      return false;
    }
  },
};
