import React from 'react';
import SalesReport from '../components/reports/SalesReport';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Laporan</h1>
        <p className="text-neutral-500 dark:text-white">Analisis penjualan dan kinerja warung Anda</p>
      </div>

      <SalesReport />
    </div>
  );
};

export default Reports;