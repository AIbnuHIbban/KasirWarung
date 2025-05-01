export interface MenuItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Transaction {
  id: string;
  items: TransactionItem[];
  total: number;
  date: Date;
  createdAt: Date;
}

export interface DailySales {
  date: string;
  total: number;
}

export interface TopSellingItem {
  id: string;
  name: string;
  count: number;
  total: number;
}

export interface SalesSummary {
  totalSales: number;
  transactionCount: number;
  averageTransaction: number;
  topSellingItems: TopSellingItem[];
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}