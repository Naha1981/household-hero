import React from 'react';
import { CategoricalSpending } from '../../types';

interface SpendingBarChartProps {
  data: CategoricalSpending[]; // Expects data like [{ category: "Groceries", amount: 500 }, ...]
}

const SpendingBarChart: React.FC<SpendingBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-theme-dark-text-muted text-center py-8">No category spending data.</p>;
  }

  const maxAmount = Math.max(...data.map(item => item.amount), 0);

  return (
    <div className="bg-theme-dark-ui-element p-4 rounded-lg shadow">
        <div className={`grid grid-cols-${data.length > 3 ? '2' : data.length} sm:grid-cols-${Math.min(data.length, 4)} gap-x-4 gap-y-6 items-end justify-items-center min-h-[180px] px-3`}>
        {data.map((item, index) => {
            const barHeight = maxAmount > 0 ? (item.amount / maxAmount) * 90 : 0; // 90% of max height for visual appeal
            return (
            <div key={index} className="flex flex-col items-center w-full max-w-[100px]">
                <div 
                    className="bg-theme-dark-accent border-t-2 border-theme-dark-border w-full rounded-t-sm"
                    style={{ height: `${Math.max(5, barHeight)}%` }} // min height 5%
                    title={`R ${item.amount.toFixed(2)}`}
                ></div>
                <p className="text-theme-dark-text-muted text-[13px] font-bold leading-normal tracking-[0.015em] mt-2 text-center break-words">
                {item.category}
                </p>
            </div>
            );
        })}
        </div>
    </div>
  );
};

export default SpendingBarChart;