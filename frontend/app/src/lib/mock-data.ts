export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  categoryIcon: string;
  transactionDate: string;
  paymentMethod: "credit" | "debit" | "cash";
  recurring: { isRecurring: boolean; frequency?: string };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
}

export const mockExpenses: Expense[] = [
  { id: "1", amount: 12.99, description: "Spotify Premium", category: "Entertainment", categoryIcon: "🎵", transactionDate: "2026-02-17", paymentMethod: "credit", recurring: { isRecurring: true, frequency: "monthly" } },
  { id: "2", amount: 54.30, description: "Whole Foods Groceries", category: "Food & Dining", categoryIcon: "🛒", transactionDate: "2026-02-16", paymentMethod: "debit", recurring: { isRecurring: false } },
  { id: "3", amount: 1200, description: "Monthly Rent", category: "Housing", categoryIcon: "🏠", transactionDate: "2026-02-01", paymentMethod: "debit", recurring: { isRecurring: true, frequency: "monthly" } },
  { id: "4", amount: 45.00, description: "Electric Bill", category: "Utilities", categoryIcon: "⚡", transactionDate: "2026-02-10", paymentMethod: "debit", recurring: { isRecurring: true, frequency: "monthly" } },
  { id: "5", amount: 38.50, description: "Uber rides", category: "Transportation", categoryIcon: "🚗", transactionDate: "2026-02-14", paymentMethod: "credit", recurring: { isRecurring: false } },
  { id: "6", amount: 89.99, description: "New running shoes", category: "Shopping", categoryIcon: "🛍️", transactionDate: "2026-02-12", paymentMethod: "credit", recurring: { isRecurring: false } },
  { id: "7", amount: 15.00, description: "Netflix", category: "Entertainment", categoryIcon: "🎵", transactionDate: "2026-02-15", paymentMethod: "credit", recurring: { isRecurring: true, frequency: "monthly" } },
  { id: "8", amount: 32.00, description: "Gas Station", category: "Transportation", categoryIcon: "🚗", transactionDate: "2026-02-13", paymentMethod: "debit", recurring: { isRecurring: false } },
];

export const mockCategories: Category[] = [
  { id: "1", name: "Housing", icon: "🏠", color: "hsl(160 84% 39%)", total: 1200 },
  { id: "2", name: "Food & Dining", icon: "🛒", color: "hsl(200 80% 50%)", total: 54.30 },
  { id: "3", name: "Entertainment", icon: "🎵", color: "hsl(38 92% 50%)", total: 27.99 },
  { id: "4", name: "Transportation", icon: "🚗", color: "hsl(280 65% 60%)", total: 70.50 },
  { id: "5", name: "Utilities", icon: "⚡", color: "hsl(340 75% 55%)", total: 45.00 },
  { id: "6", name: "Shopping", icon: "🛍️", color: "hsl(30 80% 55%)", total: 89.99 },
];

export const mockSavingsGoals: SavingsGoal[] = [
  { id: "1", name: "Emergency Fund", target: 10000, current: 6500 },
  { id: "2", name: "Vacation", target: 3000, current: 1200 },
  { id: "3", name: "New Laptop", target: 2000, current: 1800 },
];

export const monthlySpendingData = [
  { month: "Sep", amount: 2100 },
  { month: "Oct", amount: 1850 },
  { month: "Nov", amount: 2400 },
  { month: "Dec", amount: 2800 },
  { month: "Jan", amount: 1950 },
  { month: "Feb", amount: 1487.78 },
];

export const categoryBreakdown = [
  { name: "Housing", value: 1200, fill: "hsl(160, 84%, 39%)" },
  { name: "Shopping", value: 89.99, fill: "hsl(30, 80%, 55%)" },
  { name: "Transportation", value: 70.50, fill: "hsl(280, 65%, 60%)" },
  { name: "Food & Dining", value: 54.30, fill: "hsl(200, 80%, 50%)" },
  { name: "Utilities", value: 45.00, fill: "hsl(340, 75%, 55%)" },
  { name: "Entertainment", value: 27.99, fill: "hsl(38, 92%, 50%)" },
];
