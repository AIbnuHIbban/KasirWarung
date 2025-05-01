import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, ChevronRight } from 'lucide-react';
import { useTransactionStore } from '../../stores/transactionStore';
import { formatCurrency, formatDateTime } from '../../utils/dateUtils';

const RecentTransactions: React.FC = () => {
  const { 
    transactions, 
    fetchTransactions, 
    isLoading 
  } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="card dark:bg-gray-950">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-white">Transaksi Terbaru</h2>
        <Link 
          to="/transaksi" 
          className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
        >
          Lihat Semua
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(index => (
            <div key={index} className="animate-pulse">
              <div className="h-14 bg-neutral-100 rounded-lg flex items-center px-4">
                <div className="w-10 h-10 bg-neutral-200 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/3"></div>
                </div>
                <div className="h-5 w-20 bg-neutral-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : recentTransactions.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  ID Transaksi
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center">
                      <Receipt className="w-4 h-4 text-neutral-400 mr-2" />
                      {transaction.id.substring(0, 8)}...
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">
                    {formatDateTime(transaction.date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">
                    {transaction.items.length} item
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                    {formatCurrency(transaction.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 text-neutral-500">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
          <p>Belum ada transaksi</p>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;