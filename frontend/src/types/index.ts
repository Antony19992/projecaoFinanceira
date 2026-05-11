export type TransactionType = 'EXPENSE' | 'INCOME';

export type TransactionSource = 'manual' | 'email' | 'webhook';

export type RadarStatus = 'GREEN' | 'YELLOW' | 'RED';

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  source: TransactionSource;
  createdAt: string;
}

export interface MonthlyLimit {
  id: string;
  category: string;
  limitValue: number;
  month: number;
  year: number;
}

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

export interface DashboardData {
  radar: RadarResult;
  recentTransactions: Transaction[];
  month: number;
  year: number;
}

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

export interface RecurringTransaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  source: TransactionSource;
  dayOfMonth: number;
  active: boolean;
  createdAt: string;
}

export interface CreateRecurringDTO {
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  source?: TransactionSource;
  dayOfMonth: number;
  startMonth?: number;
  startYear?: number;
}

export interface CaixinhaCheckIn {
  id: string;
  caixinhaId: string;
  month: number;
  year: number;
  createdAt: string;
}

export interface Caixinha {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  monthlyContribution: number;
  checkIns: CaixinhaCheckIn[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaixinhaDTO {
  name: string;
  description: string;
  targetValue: number;
  monthlyContribution: number;
}
