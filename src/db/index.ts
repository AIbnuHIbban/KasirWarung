import Dexie, { Table } from 'dexie';
import { MenuItem, Transaction } from '../types';

class KasirWarungDatabase extends Dexie {
  menuItems!: Table<MenuItem>;
  transactions!: Table<Transaction>;

  constructor() {
    super('KasirWarungDB');
    this.version(1).stores({
      menuItems: 'id, name, category, stock',
      transactions: 'id, date, total, createdAt',
    });
  }

  async initializeData() {
    // Check if we already have data
    const menuCount = await this.menuItems.count();
    
    if (menuCount === 0) {
      // Seed initial menu items only
      const defaultMenuItems: Partial<MenuItem>[] = [
        {
          id: '1',
          name: 'Nasi Goreng',
          price: 15000,
          stock: 20,
          category: 'Makanan',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Mie Goreng',
          price: 12000,
          stock: 15,
          category: 'Makanan',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          name: 'Es Teh',
          price: 5000,
          stock: 30,
          category: 'Minuman',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      // Add seed data to database
      await this.menuItems.bulkAdd(defaultMenuItems as MenuItem[]);
    }
  }
}

export const db = new KasirWarungDatabase();