import { create } from 'zustand';
import { db } from '../db';
import { Transaction, TransactionItem, TopSellingItem, DailySales } from '../types';
import { startOfDay, endOfDay, subDays, formatISO } from '../utils/dateUtils';

interface TransactionState {
  transactions: Transaction[];
  currentTransaction: TransactionItem[];
  isLoading: boolean;
  error: string | null;
  
  // Transaction operations
  fetchTransactions: () => Promise<void>;
  getRecentTransactions: (limit?: number) => Transaction[];
  addTransaction: (items: TransactionItem[]) => Promise<void>;
  
  // Current transaction operations
  addToCurrentTransaction: (item: TransactionItem) => void;
  updateCurrentTransactionItem: (id: string, quantity: number) => void;
  removeFromCurrentTransaction: (id: string) => void;
  getCurrentTotal: () => number;
  clearCurrentTransaction: () => void;
  
  // Analytics
  getTodaySales: () => Promise<number>;
  getTodayTransactionCount: () => Promise<number>;
  getTopSellingItems: (days?: number, limit?: number) => Promise<TopSellingItem[]>;
  getSalesChart: (days?: number) => Promise<DailySales[]>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  currentTransaction: [],
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await db.transactions
        .orderBy('createdAt')
        .reverse()
        .toArray();
      
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getRecentTransactions: (limit = 5) => {
    return get().transactions.slice(0, limit);
  },

  addTransaction: async (items) => {
    set({ isLoading: true, error: null });
    try {
      const now = new Date();
      
      const total = items.reduce((sum, item) => sum + item.total, 0);
      
      const transaction: Transaction = {
        id: crypto.randomUUID(),
        items,
        total,
        date: now,
        createdAt: now,
      };
      
      // Add transaction to database
      await db.transactions.add(transaction);
      
      // Update items stock
      for (const item of items) {
        const menuItem = await db.menuItems.get(item.menuItemId);
        if (menuItem) {
          await db.menuItems.update(menuItem.id, {
            stock: menuItem.stock - item.quantity,
            updatedAt: now,
          });
        }
      }
      
      // Update state with new transaction and fetch fresh menu items
      const transactions = [transaction, ...get().transactions];
      set({ transactions, currentTransaction: [], isLoading: false });
      
      // Trigger a menu items refresh
      const { fetchMenuItems } = await import('../stores/menuStore');
      await fetchMenuItems();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addToCurrentTransaction: (item) => {
    const currentTransaction = [...get().currentTransaction];
    const existingItemIndex = currentTransaction.findIndex(i => i.menuItemId === item.menuItemId);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity and total
      const existingItem = currentTransaction[existingItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + item.quantity,
        total: (existingItem.quantity + item.quantity) * existingItem.price,
      };
      
      currentTransaction[existingItemIndex] = updatedItem;
    } else {
      // Add new item
      currentTransaction.push(item);
    }
    
    set({ currentTransaction });
  },

  updateCurrentTransactionItem: (id, quantity) => {
    const currentTransaction = get().currentTransaction.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity,
          total: quantity * item.price,
        };
      }
      return item;
    });
    
    set({ currentTransaction });
  },

  removeFromCurrentTransaction: (id) => {
    const currentTransaction = get().currentTransaction.filter(item => item.id !== id);
    set({ currentTransaction });
  },

  getCurrentTotal: () => {
    return get().currentTransaction.reduce((sum, item) => sum + item.total, 0);
  },

  clearCurrentTransaction: () => {
    set({ currentTransaction: [] });
  },

  getTodaySales: async () => {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);
    
    const transactions = await db.transactions
      .where('date')
      .between(start, end)
      .toArray();
    
    return transactions.reduce((sum, tx) => sum + tx.total, 0);
  },

  getTodayTransactionCount: async () => {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);
    
    return await db.transactions
      .where('date')
      .between(start, end)
      .count();
  },

  getTopSellingItems: async (days = 7, limit = 5) => {
    const startDate = subDays(new Date(), days);
    
    const transactions = await db.transactions
      .where('date')
      .aboveOrEqual(startDate)
      .toArray();
    
    // Aggregate items sold
    const itemsMap = new Map<string, { id: string, name: string, count: number, total: number }>();
    
    transactions.forEach(transaction => {
      transaction.items.forEach(item => {
        const existing = itemsMap.get(item.menuItemId);
        
        if (existing) {
          itemsMap.set(item.menuItemId, {
            ...existing,
            count: existing.count + item.quantity,
            total: existing.total + item.total,
          });
        } else {
          itemsMap.set(item.menuItemId, {
            id: item.menuItemId,
            name: item.menuItemName,
            count: item.quantity,
            total: item.total,
          });
        }
      });
    });
    
    // Convert to array and sort by count
    const topItems = Array.from(itemsMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return topItems;
  },

  getSalesChart: async (days = 7) => {
    const result: DailySales[] = [];
    const today = new Date();
    
    // Create a map for all days in the range
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = formatISO(date, { representation: 'date' });
      result.push({ date: dateStr, total: 0 });
    }
    
    // Get transactions for the period
    const startDate = subDays(today, days - 1);
    startDate.setHours(0, 0, 0, 0);
    
    const transactions = await db.transactions
      .where('date')
      .aboveOrEqual(startDate)
      .toArray();
    
    // Aggregate sales by day
    const salesByDay = new Map<string, number>();
    
    transactions.forEach(transaction => {
      const dateStr = formatISO(transaction.date, { representation: 'date' });
      const currentTotal = salesByDay.get(dateStr) || 0;
      salesByDay.set(dateStr, currentTotal + transaction.total);
    });
    
    // Merge with result array
    return result.map(day => ({
      ...day,
      total: salesByDay.get(day.date) || 0,
    }));
  },
}));