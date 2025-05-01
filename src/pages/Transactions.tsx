import React from 'react';
import TransactionForm from '../components/transaction/TransactionForm';
import TransactionHistory from '../components/transaction/TransactionHistory';

const Transactions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Transaksi</h1>
        <p className="text-neutral-500 dark:text-white">Kelola transaksi penjualan warung</p>
      </div>

      <TransactionForm />
      <TransactionHistory />
    </div>
  );
};

export default Transactions;