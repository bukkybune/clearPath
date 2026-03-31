export interface Transaction {
  id: string;
  category: string;
  amount: number;
  description?: string;
  type: 'expense' | 'income';
  createdAt?: string;
  uid?: string;
}
