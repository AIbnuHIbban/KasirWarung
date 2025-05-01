import React from 'react';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import { MenuItem } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';
import { useMenuStore } from '../../stores/menuStore';

interface MenuCardProps {
  item: MenuItem;
  onEdit: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, onEdit }) => {
  const { deleteMenuItem } = useMenuStore();
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDelete = async () => {
    if (confirmDelete) {
      await deleteMenuItem(item.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  // Auto-reset confirm state after 3 seconds
  React.useEffect(() => {
    if (confirmDelete) {
      const timer = setTimeout(() => {
        setConfirmDelete(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmDelete]);

  const isLowStock = item.stock < 5;

  return (
    <div className="card dark:bg-gray-950 group hover:border-primary-300">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium group-hover:text-primary-600 transition-colors dark:text-white">
          {item.name}
        </h3>
        <span className="px-2 py-0.5 bg-neutral-100 dark:bg-gray-900 text-neutral-700 rounded text-xs font-medium dark:text-white">
          {item.category}
        </span>
      </div>
      <p className="text-xl font-semibold text-neutral-900 mb-1 dark:text-white">
        {formatCurrency(item.price)}
      </p>
      <div className="flex items-center">
        {isLowStock ? (
          <div className="flex items-center text-error-600 text-sm">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>Stok menipis: {item.stock} tersisa</span>
          </div>
        ) : (
          <p className="text-neutral-500 text-sm dark:text-white">
            Stok: {item.stock} tersedia
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onEdit}
          className="btn-outline py-1.5 px-3 text-sm flex dark:bg-white dark:hover:bg-black dark:hover:text-white dark:border-0"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className={`py-1.5 px-3 text-sm rounded-lg font-medium flex items-center ${
            confirmDelete 
              ? 'bg-error-500 hover:bg-error-600 dark:border-0 text-white dark:bg-white dark:hover:bg-error-500 dark:hover:text-white'
              : 'text-error-600 hover:bg-error-50 border dark:border-0 border-error-200 dark:bg-white dark:hover:bg-error-600 dark:hover:text-white'
          }`}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          {confirmDelete ? 'Konfirmasi' : 'Hapus'}
        </button>
      </div>
    </div>
  );
};

export default MenuCard;