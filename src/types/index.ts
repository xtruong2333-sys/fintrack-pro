export type TransactionType = 'expense' | 'income';

export type WalletType = 'cash' | 'bank' | 'ewallet' | 'savings';

export interface Wallet {
  id: WalletType;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  walletId: WalletType;
  walletName: string;
  note: string;
  date: string; // ISO string YYYY-MM-DD
  createdAt: number; // timestamp
}

export interface BudgetConfig {
  monthlyLimit: number;
}

export type ThemeMode = 'dark' | 'light';

export interface AppSettings {
  theme: ThemeMode;
  pinEnabled: boolean;
  pinCode: string;
  hasSeenOnboarding: boolean;
}
