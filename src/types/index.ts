export type TransactionType = 'expense' | 'income';

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
  note: string;
  date: string; // ISO string YYYY-MM-DD
  createdAt: number; // timestamp
}

export interface BudgetConfig {
  monthlyLimit: number; // Hạn mức chi tiêu hàng tháng (VND)
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
}
