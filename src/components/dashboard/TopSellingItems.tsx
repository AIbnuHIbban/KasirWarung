import React, { useEffect, useState } from 'react';
import { CupSoda, ArrowUp } from 'lucide-react';
import { useTransactionStore } from '../../stores/transactionStore';
import { TopSellingItem } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

const TopSellingItems: React.FC = () => {
  const [topItems, setTopItems] = useState<TopSellingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getTopSellingItems } = useTransactionStore();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const items = await getTopSellingItems(7, 5);
        setTopItems(items);
      } catch (error) {
        console.error('Error fetching top selling items', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getTopSellingItems]);

  return (
    <div className="card dark:bg-gray-950">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-white">Menu Paling Laku</h2>
        <span className="text-sm text-neutral-500 dark:text-white">7 hari terakhir</span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(index => (
            <div key={index} className="animate-pulse flex items-center gap-3 p-3 rounded-lg">
              <div className="w-10 h-10 bg-neutral-200 rounded-md"></div>
              <div className="flex-1">
                <div className="h-4 bg-neutral-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-neutral-200 rounded w-1/4"></div>
              </div>
              <div className="h-5 bg-neutral-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : topItems.length > 0 ? (
        <div className="space-y-2">
          {topItems.map((item, index) => (
            <div 
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                index === 0 ? 'bg-primary-50' : 'hover:bg-neutral-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-md ${
                index === 0 ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-600'
              } flex items-center justify-center`}>
                <CupSoda className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                <div className="flex items-center text-sm">
                  <span className="text-neutral-500">{item.count} terjual</span>
                  {index === 0 && (
                    <span className="ml-2 flex items-center text-success-600">
                      <ArrowUp className="w-3 h-3 mr-0.5" />
                      tertinggi
                    </span>
                  )}
                </div>
              </div>
              <div className="font-medium">
                {formatCurrency(item.total)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-neutral-500">
          <CupSoda className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
          <p>Belum ada data penjualan</p>
        </div>
      )}
    </div>
  );
};

export default TopSellingItems;