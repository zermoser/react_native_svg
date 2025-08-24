export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  icon: string;
  color: string;
  date: Date;
  description?: string;
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
  icon: string;
  color: string;
}

export interface Goal {
  id: number;
  title: string;
  currentAmount: number;
  targetAmount: number;
  icon: string;
  color: string;
}

export interface FinancialTip {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const colors = {
  primary: '#667eea',
  primaryLight: '#a3b4f0',
  secondary: '#764ba2',
  income: '#4CAF50',
  expense: '#F44336',
  background: '#F8F9FA',
  text: '#2C3E50',
  textLight: '#7F8C8D',
  headerGradient: ['#667eea', '#764ba2'] as [string, string],
  incomeGradient: ['#56CCF2', '#2F80ED'] as [string, string],
  expenseGradient: ['#FF6B6B', '#EE5A52'] as [string, string],
};

export const formatCurrency = (amount: number): string => {
  return `฿${amount.toLocaleString()}`;
};