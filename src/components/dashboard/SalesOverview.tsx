import React, { useEffect, useState } from 'react';
import { TrendingUp, ShoppingCart, CupSoda } from 'lucide-react';
import { formatCurrency } from '../../utils/dateUtils';
import { useTransactionStore } from '../../stores/transactionStore';
import { TopSellingItem } from '../../types';

const SalesOverview: React.FC = () => {
  const [todaySales, setTodaySales] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [topItem, setTopItem] = useState<TopSellingItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { 
    getTodaySales, 
    getTodayTransactionCount,
    getTopSellingItems 
  } = useTransactionStore();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const sales = await getTodaySales();
        const count = await getTodayTransactionCount();
        const topItems = await getTopSellingItems(1, 1);
        
        setTodaySales(sales);
        setTransactionCount(count);
        setTopItem(topItems.length > 0 ? topItems[0] : null);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getTodaySales, getTodayTransactionCount, getTopSellingItems]);

  const cards = [
    {
      title: 'Total Penjualan Hari Ini',
      value: formatCurrency(todaySales),
      icon: <TrendingUp className="h-6 w-6 text-primary-600" />,
      color: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      title: 'Jumlah Transaksi Hari Ini',
      value: transactionCount,
      icon: <ShoppingCart className="h-6 w-6 text-secondary-600" />,
      color: 'bg-secondary-50',
      iconColor: 'text-secondary-600',
    },
    {
      title: 'Menu Paling Laku Hari Ini',
      value: topItem ? topItem.name : 'Belum ada penjualan',
      subtext: topItem ? `${topItem.count} porsi` : '',
      icon: <CupSoda className="h-6 w-6 text-accent-600" />,
      color: 'bg-accent-50',
      iconColor: 'text-accent-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {isLoading ? (
        // Skeleton loading state
        Array(3).fill(0).map((_, index) => (
          <div key={index} className="card dark:bg-gray-950 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-3"></div>
                <div className="h-7 bg-neutral-200 rounded w-1/2"></div>
              </div>
              <div className="h-10 w-10 rounded-full bg-neutral-200"></div>
            </div>
          </div>
        ))
      ) : (
        // Actual content
        cards.map((card, index) => (
          <div key={index} className="card dark:bg-gray-950 hover:border-primary-500 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-white">{card.title}</h3>
                <p className="text-2xl font-semibold mt-1 dark:text-white">{card.value}</p>
                {card.subtext && <p className="text-sm text-neutral-500 dark:text-white">{card.subtext}</p>}
              </div>
              <div className={`h-12 w-12 rounded-full ${card.color} flex items-center justify-center ${card.iconColor}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SalesOverview;