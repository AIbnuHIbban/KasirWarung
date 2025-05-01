import React, { useState, useEffect } from 'react';
import { Calendar, Download, FileText, BarChart3 } from 'lucide-react';
import { useTransactionStore } from '../../stores/transactionStore';
import { formatCurrency, formatDate } from '../../utils/dateUtils';
import { Transaction } from '../../types';

const SalesReport: React.FC = () => {
  const { transactions, fetchTransactions, isLoading } = useTransactionStore();
  const [reportType, setReportType] = useState<'daily' | 'monthly'>('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState({
    totalSales: 0,
    totalTransactions: 0,
    averageTransaction: 0,
  });

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    // Set default dates if not already set
    if (!startDate || !endDate) {
      const defaultEnd = new Date();
      const defaultStart = new Date();
      defaultStart.setDate(defaultStart.getDate() - 30);
      
      setStartDate(defaultStart.toISOString().substring(0, 10));
      setEndDate(defaultEnd.toISOString().substring(0, 10));
    }
  }, []);

  useEffect(() => {
    if (!startDate || !endDate || transactions.length === 0) return;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    // Filter transactions within date range
    const filteredTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date >= start && date <= end;
    });

    // Group by date or month based on report type
    const groupedData = new Map();
    let totalSales = 0;
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      
      let key;
      if (reportType === 'daily') {
        key = date.toISOString().substring(0, 10);
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!groupedData.has(key)) {
        groupedData.set(key, {
          date: key,
          totalSales: 0,
          transactionCount: 0,
        });
      }
      
      const data = groupedData.get(key);
      data.totalSales += transaction.total;
      data.transactionCount += 1;
      totalSales += transaction.total;
    });

    // Convert to array and sort by date
    const sortedData = Array.from(groupedData.values()).sort((a, b) => {
      return a.date.localeCompare(b.date);
    });

    // Calculate summary data
    const totalTransactions = filteredTransactions.length;
    const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    setReportData(sortedData);
    setSummaryData({
      totalSales,
      totalTransactions,
      averageTransaction,
    });
  }, [transactions, startDate, endDate, reportType]);

  const handleExportCSV = () => {
    if (reportData.length === 0) return;

    // Create CSV content
    const headers = reportType === 'daily' 
      ? ['Tanggal', 'Total Penjualan', 'Jumlah Transaksi'] 
      : ['Bulan', 'Total Penjualan', 'Jumlah Transaksi'];
    
    const csvRows = [
      headers.join(','),
      ...reportData.map(row => {
        const date = reportType === 'daily'
          ? formatDate(new Date(row.date))
          : `${row.date.split('-')[1]}/${row.date.split('-')[0]}`; // MM/YYYY
        
        return [
          `"${date}"`,
          row.totalSales,
          row.transactionCount
        ].join(',');
      })
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan_penjualan_${reportType}_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatReportDate = (dateString: string): string => {
    if (reportType === 'daily') {
      return formatDate(new Date(dateString));
    } else {
      const [year, month] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="card dark:bg-gray-950">
        <h2 className="text-lg font-semibold dark:text-white mb-4">Laporan Penjualan</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Jenis Laporan
            </label>
            <select
              id="reportType"
              className="input w-full dark:bg-gray-900 dark:text-white"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'daily' | 'monthly')}
            >
              <option value="daily">Harian</option>
              <option value="monthly">Bulanan</option>
            </select>
          </div>
          
          {reportType === 'daily' && (
            <>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Dari Tanggal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                  </div>
                  <input
                    type="date"
                    id="startDate"
                    className="input pl-9 w-full dark:bg-gray-900 dark:border-gray-800 dark:text-white"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Sampai Tanggal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                  </div>
                  <input
                    type="date"
                    id="endDate"
                    className="input pl-9 w-full dark:bg-gray-900 dark:border-gray-800 dark:text-white"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
          
          <div className="flex items-end">
            <button
              onClick={handleExportCSV}
              disabled={reportData.length === 0}
              className="btn-primary w-full flex items-center justify-center gap-2 dark:bg-primary-600 dark:hover:bg-primary-700"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 dark:bg-primary-900/50 rounded-lg p-4 border border-primary-100 dark:border-primary-800">
            <div className="flex items-start gap-3">
              <div className="bg-primary-100 dark:bg-primary-800 p-2 rounded-md text-primary-600 dark:text-primary-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">Total Penjualan</p>
                <p className="text-xl font-bold text-primary-700 dark:text-primary-300">
                  {formatCurrency(summaryData.totalSales)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4 border border-secondary-100 dark:border-secondary-800">
            <div className="flex items-start gap-3">
              <div className="bg-secondary-100 dark:bg-secondary-800 p-2 rounded-md text-secondary-600 dark:text-secondary-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">Jumlah Transaksi</p>
                <p className="text-xl font-bold text-secondary-700 dark:text-secondary-300">
                  {summaryData.totalTransactions}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-accent-50 dark:bg-accent-900/50 rounded-lg p-4 border border-accent-100 dark:border-accent-800">
            <div className="flex items-start gap-3">
              <div className="bg-accent-100 dark:bg-accent-800 p-2 rounded-md text-accent-600 dark:text-accent-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-accent-600 dark:text-accent-400 font-medium">Rata-Rata per Transaksi</p>
                <p className="text-xl font-bold text-accent-700 dark:text-accent-300">
                  {formatCurrency(summaryData.averageTransaction)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="card dark:bg-gray-950 dark:bg-black dark:border-neutral-700">
        <h3 className="text-lg font-semibold dark:text-white mb-4">
          Detail Laporan {reportType === 'daily' ? 'Harian' : 'Bulanan'}
        </h3>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-neutral-100 dark:bg-gray-900 rounded-md w-full"></div>
            {[1, 2, 3, 4, 5].map(index => (
              <div key={index} className="h-12 bg-neutral-100 dark:bg-gray-900 rounded-md w-full"></div>
            ))}
          </div>
        ) : reportData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-black">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    {reportType === 'daily' ? 'Tanggal' : 'Bulan'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Jumlah Transaksi
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Total Penjualan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-black divide-y divide-neutral-200 dark:divide-neutral-700">
                {reportData.map((row, index) => (
                  <tr key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                      {formatReportDate(row.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                      {row.transactionCount} transaksi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium dark:text-white">
                      {formatCurrency(row.totalSales)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-neutral-50 dark:bg-black">
                <tr>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-semibold dark:text-white">
                    Total
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium dark:text-white">
                    {summaryData.totalTransactions} transaksi
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-semibold dark:text-white">
                    {formatCurrency(summaryData.totalSales)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-50 dark:bg-gray-900/50 rounded-lg">
            <FileText className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
            <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Tidak ada data</h3>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Pilih rentang tanggal yang berbeda atau buat transaksi baru.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReport;