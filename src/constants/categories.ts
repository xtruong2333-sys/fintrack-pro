import { Category, Wallet } from '../types';

export const WALLETS: Wallet[] = [
  { id: 'cash', name: 'Tiền mặt', icon: 'cash-outline', color: '#10B981', description: 'Chi tiêu hằng ngày' },
  { id: 'bank', name: 'Ngân hàng', icon: 'card-outline', color: '#3B82F6', description: 'Tài khoản chính / Thẻ' },
  { id: 'ewallet', name: 'Ví điện tử', icon: 'phone-portrait-outline', color: '#EC4899', description: 'MoMo, ZaloPay, ViettelMoney' },
  { id: 'savings', name: 'Sổ tiết kiệm', icon: 'vault-outline', color: '#F59E0B', description: 'Khoản tích lũy lâu dài' },
];

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Ăn uống', icon: 'fast-food', color: '#FF6B6B', type: 'expense' },
  { id: 'shopping', name: 'Mua sắm', icon: 'cart', color: '#4ECDC4', type: 'expense' },
  { id: 'transport', name: 'Di chuyển', icon: 'car', color: '#45B7D1', type: 'expense' },
  { id: 'bills', name: 'Hóa đơn & Nhà', icon: 'home', color: '#F7B731', type: 'expense' },
  { id: 'entertainment', name: 'Giải trí', icon: 'game-controller', color: '#A55EEA', type: 'expense' },
  { id: 'health', name: 'Sức khỏe & Y tế', icon: 'medkit', color: '#FC5C65', type: 'expense' },
  { id: 'education', name: 'Học tập', icon: 'school', color: '#26DE81', type: 'expense' },
  { id: 'beauty', name: 'Làm đẹp', icon: 'sparkles', color: '#FD79A8', type: 'expense' },
  { id: 'gift', name: 'Hiếu hỉ & Quà', icon: 'gift', color: '#E17055', type: 'expense' },
  { id: 'other_expense', name: 'Chi phí khác', icon: 'ellipsis-horizontal-circle', color: '#778CA3', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Tiền lương', icon: 'wallet', color: '#2ED573', type: 'income' },
  { id: 'bonus', name: 'Thưởng & Tip', icon: 'trophy', color: '#FFA502', type: 'income' },
  { id: 'investment', name: 'Đầu tư & Lãi', icon: 'trending-up', color: '#1E90FF', type: 'income' },
  { id: 'freelance', name: 'Làm thêm / Phụ', icon: 'briefcase', color: '#9B59B6', type: 'income' },
  { id: 'allowance', name: 'Trợ cấp & Quà', icon: 'heart', color: '#FF4757', type: 'income' },
  { id: 'other_income', name: 'Thu nhập khác', icon: 'cash', color: '#20BF6B', type: 'income' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const DEFAULT_BUDGET: number = 10000000; // 10,000,000 VND
