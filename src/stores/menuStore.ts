import { create } from 'zustand';
import { db } from '../db';
import { MenuItem } from '../types';

interface MenuState {
  menuItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
  fetchMenuItems: () => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  getLowStockItems: () => MenuItem[];
}

export const useMenuStore = create<MenuState>((set, get) => ({
  menuItems: [],
  isLoading: false,
  error: null,

  fetchMenuItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const menuItems = await db.menuItems.toArray();
      set({ menuItems, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addMenuItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const id = crypto.randomUUID();
      const now = new Date();
      
      const newItem: MenuItem = {
        ...item,
        id,
        createdAt: now,
        updatedAt: now,
      };
      
      await db.menuItems.add(newItem);
      
      // Update state with the new item
      const menuItems = [...get().menuItems, newItem];
      set({ menuItems, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateMenuItem: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedItem = {
        ...updates,
        updatedAt: new Date(),
      };
      
      await db.menuItems.update(id, updatedItem);
      
      // Update state with the modified item
      const menuItems = get().menuItems.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      );
      
      set({ menuItems, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteMenuItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await db.menuItems.delete(id);
      
      // Update state by removing the deleted item
      const menuItems = get().menuItems.filter(item => item.id !== id);
      set({ menuItems, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getLowStockItems: () => {
    return get().menuItems.filter(item => item.stock < 5);
  },
}));