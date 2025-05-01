import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useTransactionStore } from '../../stores/transactionStore';
import { DailySales } from '../../types';
import { formatCurrency } from '../../utils/dateUtils';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-neutral-200 shadow-lg rounded-md">
        <p className="font-medium">{label}</p>
        <p className="text-primary-600 font-semibold">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }

  return null;
};

const formatChartDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
};

const SalesChart: React.FC = () => {
  const [salesData, setSalesData] = useState<DailySales[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getSalesChart } = useTransactionStore();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getSalesChart(7);
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales chart data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getSalesChart]);

  return (
    <div className="card dark:bg-gray-950">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold dark:text-white">Penjualan 7 Hari Terakhir</h2>
      </div>

      <div className="h-80">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6">
                <div className="h-2 bg-neutral-200 rounded"></div>
                <div className="h-60 bg-neutral-200 rounded"></div>
                <div className="h-2 bg-neutral-200 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesData}
              margin={{ top: 10, right: 10, left: 20, bottom: 20 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatChartDate}
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value).replace('Rp', '')}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="total" 
                fill="#ff6b35" 
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesChart;