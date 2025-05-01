import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MenuItem } from '../../types';
import { useMenuStore } from '../../stores/menuStore';

// Add these utility functions at the top of your file
const formatToRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const parseRupiah = (value: string): number => {
  // Remove currency symbol, dots, and other non-numeric characters
  const numericValue = value.replace(/[^\d]/g, '');
  return numericValue ? parseInt(numericValue, 10) : 0;
};

interface MenuFormProps {
  onClose: () => void;
  editItem: MenuItem | null;
}

const MenuForm: React.FC<MenuFormProps> = ({ onClose, editItem }) => {
  const { addMenuItem, updateMenuItem } = useMenuStore();
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    category: 'Makanan',
  });
  // Add this for displaying formatted price
  const [displayPrice, setDisplayPrice] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        price: editItem.price,
        stock: editItem.stock,
        category: editItem.category,
      });
      // Set the formatted display price
      setDisplayPrice(formatToRupiah(editItem.price));
    }
  }, [editItem]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama menu wajib diisi';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Harga harus lebih dari 0';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'Stok tidak boleh negatif';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Handle price input separately for formatting
      const numericValue = parseRupiah(value);
      setFormData({
        ...formData,
        price: numericValue,
      });
      setDisplayPrice(formatToRupiah(numericValue));
    } else if (name === 'stock') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Special handler for direct price input
  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Only update if it's empty or contains valid characters
    if (rawValue === '' || /^[Rp\s\d.,]+$/.test(rawValue)) {
      const numericValue = parseRupiah(rawValue);
      setFormData({
        ...formData,
        price: numericValue,
      });
      setDisplayPrice(rawValue === '' ? '' : formatToRupiah(numericValue));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editItem) {
        await updateMenuItem(editItem.id, formData);
      } else {
        await addMenuItem(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving menu item', error);
      setErrors({
        form: 'Terjadi kesalahan saat menyimpan data',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 modal">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold dark:text-white">
          {editItem ? 'Edit Menu' : 'Tambah Menu Baru'}
        </h2>
        <button 
          onClick={onClose}
          className="text-neutral-500 hover:text-neutral-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errors.form && (
        <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-md text-error-700 text-sm">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium label mb-1">
            Nama Menu
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`input w-full ${errors.name ? 'input-error' : ''}`}
            value={formData.name}
            onChange={handleChange}
            placeholder="Contoh: Nasi Goreng"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error-600">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium label mb-1">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            className="input w-full"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
            <option value="Camilan">Camilan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium label mb-1">
              Harga (Rp)
            </label>
            <input
              type="text"
              id="price"
              name="price"
              className={`input w-full ${errors.price ? 'input-error' : ''}`}
              value={displayPrice}
              onChange={handlePriceInput}
              placeholder="Rp 0"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-error-600">{errors.price}</p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium label mb-1">
              Stok
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              className={`input w-full ${errors.stock ? 'input-error' : ''}`}
              value={formData.stock}
              onChange={handleChange}
              min="0"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-error-600">{errors.stock}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline cancel-button"
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Menyimpan...' : editItem ? 'Simpan Perubahan' : 'Tambah Menu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuForm;