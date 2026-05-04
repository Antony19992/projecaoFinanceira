export type TransactionType = 'EXPENSE' | 'INCOME';

export type TransactionSource = 'manual' | 'email' | 'webhook';

export interface CreateTransactionDTO {
  amount: number;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  source?: TransactionSource;
}

export interface CreateLimitDTO {
  category: string;
  limitValue: number;
  month: number;
  year: number;
}

export interface CreateRecurringDTO {
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  source?: TransactionSource;
  dayOfMonth: number;
}

export type RadarStatus = 'GREEN' | 'YELLOW' | 'RED';

export interface RadarResult {
  status: RadarStatus;
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  projection: number;
  percentageUsed: number;
  expectedByToday: number;
  totalLimit: number;
  dailyAllowance: number;
  message: string;
}
