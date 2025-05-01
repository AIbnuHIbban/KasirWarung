import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useMenuStore } from '../../stores/menuStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { MenuItem, TransactionItem } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

const TransactionForm: React.FC = () => {
  const { menuItems, fetchMenuItems, updateMenuItem } = useMenuStore();
  const { 
    currentTransaction, 
    addToCurrentTransaction,
    updateCurrentTransactionItem,
    removeFromCurrentTransaction,
    getCurrentTotal,
    addTransaction,
    clearCurrentTransaction
  } = useTransactionStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleAddItem = (menuItem: MenuItem) => {
    if (menuItem.stock <= 0) return;

    const newItem: TransactionItem = {
      id: crypto.randomUUID(),
      menuItemId: menuItem.id,
      menuItemName: menuItem.name,
      quantity: 1,
      price: menuItem.price,
      total: menuItem.price,
    };

    addToCurrentTransaction(newItem);
  };

  const handleQuantityChange = (id: string, quantity: number, maxStock: number) => {
    if (quantity <= 0 || quantity > maxStock) return;
    updateCurrentTransactionItem(id, quantity);
  };

  const total = getCurrentTotal();

  const filteredMenuItems = menuItems.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.stock > 0;
  });

  const handleSaveTransaction = async () => {
    if (currentTransaction.length === 0 || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      await addTransaction(currentTransaction);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving transaction', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Menu Items Section */}
      <div className="lg:col-span-2 card">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Pilih Menu</h2>
        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400 dark:text-white" />
          </div>
          <input
            type="text"
            placeholder="Cari menu..."
            className="input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto p-1">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="border border-neutral-200 rounded-lg p-3 hover:border-primary-300 transition-colors dark:border-gray-800"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium dark:text-white">{item.name}</h3>
                  <p className="text-neutral-500 text-sm dark:text-white">
                    Stok: {item.stock}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-right dark:text-white">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleAddItem(item)}
                disabled={item.stock <= 0}
                className={`mt-2 w-full py-1.5 rounded-md text-sm font-medium flex items-center justify-center ${
                  item.stock <= 0
                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed dark:bg-primary-900 dark:text-white'
                    : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-600 dark:hover:bg-primary-700 dark:text-white'
                }`}
              >
                <Plus className="w-4 h-4 mr-1" />
                Tambah
              </button>
            </div>
          ))}

          {filteredMenuItems.length === 0 && (
            <div className="col-span-2 text-center py-10 bg-neutral-50 rounded-lg">
              <Search className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
              <p className="text-neutral-500">
                Menu tidak ditemukan atau stok habis
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Current Transaction Section */}
      <div className="lg:col-span-1 grid grid-rows-[auto_1fr_auto] card">
        <h2 className="text-lg font-semibold mb-4 flex items-center dark:text-white">
          <ShoppingCart className="w-5 h-5 mr-2 text-primary-500 " />
          Transaksi Saat Ini
        </h2>

        {showSuccess && (
          <div className="mb-4 p-3 bg-success-50 text-success-700 rounded-md text-sm border border-success-200 animate-pulse-slow">
            Transaksi berhasil disimpan!
          </div>
        )}

        {currentTransaction.length > 0 ? (
          <div className="space-y-3 overflow-y-auto max-h-[350px] mb-4">
            {currentTransaction.map((item) => {
              const menuItem = menuItems.find(m => m.id === item.menuItemId);
              const maxStock = menuItem ? menuItem.stock + item.quantity : item.quantity;
              
              return (
                <div
                  key={item.id}
                  className="border border-neutral-200 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.menuItemName}</h3>
                      <p className="text-neutral-500 text-sm">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-neutral-200 rounded-md">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1, maxStock)}
                        className="px-2 py-1 text-neutral-500 hover:bg-neutral-100 rounded-l-md"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 text-center min-w-[40px]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1, maxStock)}
                        className="px-2 py-1 text-neutral-500 hover:bg-neutral-100 rounded-r-md"
                        disabled={item.quantity >= maxStock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCurrentTransaction(item.id)}
                      className="p-1.5 text-error-500 hover:bg-error-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[350px] bg-neutral-50 rounded-lg mb-4 dark:bg-gray-950">
            <ShoppingCart className="w-12 h-12 text-neutral-300 mb-2 dark:text-white" />
            <p className="text-neutral-500 dark:text-white">Belum ada item</p>
            <p className="text-neutral-400 text-sm mt-1 dark:text-white">
              Pilih menu dari daftar untuk memulai transaksi
            </p>
          </div>
        )}

        <div className="border-t border-neutral-200 pt-4 dark:border-gray-700">
          <div className="flex justify-between text-lg font-semibold mb-4">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearCurrentTransaction}
              className="btn-outline flex-1"
              disabled={currentTransaction.length === 0 || isProcessing}
            >
              Batal
            </button>
            <button
              onClick={handleSaveTransaction}
              className="btn-primary flex-1"
              disabled={currentTransaction.length === 0 || isProcessing}
            >
              {isProcessing ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;