import React, { useEffect, useState } from 'react';
import { Calendar, Search, ChevronDown, ChevronUp, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTransactionStore } from '../../stores/transactionStore';
import { formatDate, formatTime, formatCurrency } from '../../utils/dateUtils';
import { Transaction } from '../../types';

const TransactionHistory: React.FC = () => {
  const { transactions, fetchTransactions, isLoading } = useTransactionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, selectedDate]);

  const handleViewDetails = (transaction: Transaction) => {
    setViewingTransaction(transaction);
  };

  const closeDetails = () => {
    setViewingTransaction(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const searchDate = selectedDate ? new Date(selectedDate) : null;
    
    const dateMatches = searchDate
      ? transactionDate.toISOString().split('T')[0] === selectedDate
      : true;
      
    const searchMatches = searchTerm
      ? transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.items.some(item => 
          item.menuItemName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;
      
    return dateMatches && searchMatches;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedId(null); // Close any expanded items when changing pages
  };

  return (
    <div className="card dark:bg-gray-950">
      <h2 className="text-lg font-semibold mb-4">Riwayat Transaksi</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Cari transaksi..."
            className="input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="date"
            className="input pl-10 w-full"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(index => (
            <div key={index} className="animate-pulse bg-white rounded-lg border border-neutral-200 p-4">
              <div className="h-6 bg-neutral-200 rounded w-1/4 mb-4"></div>
              <div className="h-5 bg-neutral-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : filteredTransactions.length > 0 ? (
        <>
          <div className="space-y-4">
            {paginatedTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="bg-white rounded-lg border border-neutral-200 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{transaction.id.substring(0, 8)}...</h3>
                      <p className="text-neutral-500 text-sm">
                        {formatDate(transaction.date)} · {formatTime(transaction.date)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-2">
                      <span className="font-semibold">
                        {formatCurrency(transaction.total)}
                      </span>
                      <button 
                        onClick={() => handleViewDetails(transaction)}
                        className="p-1.5 text-neutral-500 hover:bg-neutral-100 rounded-md"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleExpand(transaction.id)}
                        className="p-1.5 text-neutral-500 hover:bg-neutral-100 rounded-md"
                      >
                        {expandedId === transaction.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-neutral-500 text-sm">
                    {transaction.items.length} item
                  </p>
                </div>

                {expandedId === transaction.id && (
                  <div className="bg-neutral-50 border-t border-neutral-200 p-4">
                    <h4 className="font-medium text-sm text-neutral-500 mb-2">
                      Detail Item
                    </h4>
                    <div className="space-y-2">
                      {transaction.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div>
                            <span className="font-medium">{item.menuItemName}</span>
                            <span className="text-neutral-500 ml-2">
                              x{item.quantity}
                            </span>
                          </div>
                          <span>{formatCurrency(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-4">
              <div className="text-sm text-neutral-500">
                Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTransactions.length)} dari {filteredTransactions.length} transaksi
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-neutral-50 rounded-lg dark:bg-gray-950">
          <Calendar className="w-12 h-12 mx-auto text-neutral-300 mb-3" />
          <h3 className="text-lg font-medium text-neutral-800 dark:text-white">Tidak ada transaksi ditemukan</h3>
          <p className="text-neutral-500 mt-1 dark:text-white">
            Coba ubah filter pencarian atau buat transaksi baru.
          </p>
        </div>
      )}

      {/* Transaction Details Modal */}
      {viewingTransaction && (
        <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Detail Transaksi</h2>
                <button 
                  onClick={closeDetails}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-neutral-500">ID Transaksi</p>
                    <p className="font-medium">{viewingTransaction.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Tanggal</p>
                    <p className="font-medium">{formatDate(viewingTransaction.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Waktu</p>
                    <p className="font-medium">{formatTime(viewingTransaction.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Total</p>
                    <p className="font-semibold text-primary-600">{formatCurrency(viewingTransaction.total)}</p>
                  </div>
                </div>

                <h3 className="font-medium mb-2 border-b border-neutral-200 pb-2">
                  Detail Item
                </h3>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-neutral-500 text-sm">
                      <th className="py-2">Item</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Harga</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingTransaction.items.map((item) => (
                      <tr key={item.id} className="border-b border-neutral-100">
                        <td className="py-2 font-medium">{item.menuItemName}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                        <td className="py-2 text-right font-medium">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="py-3 text-right font-semibold">Total</td>
                      <td className="py-3 text-right font-semibold">{formatCurrency(viewingTransaction.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={closeDetails}
                  className="btn-primary"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;