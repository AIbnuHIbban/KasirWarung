import React, { useEffect } from 'react';
import SalesOverview from '../components/dashboard/SalesOverview';
import SalesChart from '../components/dashboard/SalesChart';
import TopSellingItems from '../components/dashboard/TopSellingItems';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { db } from '../db';

const Dashboard: React.FC = () => {
  useEffect(() => {
    // Initialize database with sample data if needed
    db.initializeData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
        <p className="text-neutral-500 dark:text-white">Ringkasan penjualan dan kinerja warung Anda</p>
      </div>

      <SalesOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <TopSellingItems />
        </div>
      </div>

      <RecentTransactions />
    </div>
  );
};

export default Dashboard;