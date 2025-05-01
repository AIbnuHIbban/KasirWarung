import React, { useEffect, useState } from 'react';
import { PlusCircle, Search, AlertTriangle } from 'lucide-react';
import { useMenuStore } from '../../stores/menuStore';
import { MenuItem } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';
import MenuForm from './MenuForm';
import MenuCard from './MenuCard';

const MenuList: React.FC = () => {
  const { menuItems, fetchMenuItems, isLoading, getLowStockItems } = useMenuStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const lowStockItems = getLowStockItems();
  const hasLowStockWarning = lowStockItems.length > 0;

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingItem(null);
  };

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Menu Makanan & Minuman</h1>
          <p className="text-neutral-500 dark:text-white">Kelola menu dan stok warung Anda</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Tambah Menu
        </button>
      </div>

      {/* Low Stock Warning */}
      {hasLowStockWarning && (
        <div className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-warning-500 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-warning-800">Peringatan Stok Menipis</h3>
              <p className="text-sm text-warning-700 mt-1">
                {lowStockItems.length} menu memiliki stok kurang dari 5.
                {' '}
                <span className="font-medium">
                  {lowStockItems.map(item => item.name).join(', ')}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Cari menu..."
            className="input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto">
          <select
            className="input w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Semua Kategori' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="card dark:bg-gray-950 animate-pulse">
              <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
              <div className="h-5 bg-neutral-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
              <div className="flex justify-between mt-6">
                <div className="h-8 bg-neutral-200 rounded w-20"></div>
                <div className="h-8 bg-neutral-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <MenuCard 
              key={item.id} 
              item={item} 
              onEdit={() => handleEdit(item)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-neutral-200 dark:bg-black dark:border-gray-800">
          <Search className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
          <h3 className="text-lg font-medium text-neutral-800 dark:text-white">Tidak ada menu ditemukan</h3>
          <p className="text-neutral-500 mt-1 dark:text-white">
            Coba cari dengan kata kunci lain atau tambahkan menu baru.
          </p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary mt-4"
          >
            Tambah Menu Baru
          </button>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <MenuForm 
              onClose={handleFormClose} 
              editItem={editingItem}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;