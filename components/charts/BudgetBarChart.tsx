
import React from 'react';
import { BudgetCategorySpending } from '../../types';

interface BudgetBarChartProps {
  data: BudgetCategorySpending[];
}

const BudgetBarChart: React.FC<BudgetBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-theme-dark-text-muted text-center py-8">No budget data to display.</p>;
  }

  const maxValue = Math.max(...data.map(d => Math.max(d.allocated, d.amount)));

  return (
    <div className="bg-theme-dark-ui-element p-4 rounded-lg shadow">
      <div className={`grid grid-cols-${data.length > 4 ? '1' : data.length} md:grid-cols-${Math.min(data.length, 4)} gap-x-4 gap-y-6 items-end justify-items-center min-h-[200px] px-3`}>
        {data.map((item, index) => {
          const allocatedHeight = maxValue > 0 ? (item.allocated / maxValue) * 100 : 0;
          const spentHeight = maxValue > 0 ? (item.amount / maxValue) * 100 : 0;
          const isOverBudget = item.amount > item.allocated;

          return (
            <div key={index} className="flex flex-col items-center w-full max-w-[100px]">
              <div className="flex items-end h-40 w-full gap-1 justify-center">
                {/* Allocated Bar */}
                <div 
                  className="bg-theme-dark-text-muted/50 w-1/2 rounded-t-sm"
                  style={{ height: `${Math.max(5, allocatedHeight)}%` }}
                  title={`Allocated: R ${item.allocated.toFixed(2)}`}
                ></div>
                {/* Spent Bar */}
                <div 
                  className={`${isOverBudget ? 'bg-theme-dark-negative' : 'bg-theme-dark-accent'} w-1/2 rounded-t-sm`}
                  style={{ height: `${Math.max(5, spentHeight)}%` }}
                  title={`Spent: R ${item.amount.toFixed(2)}`}
                ></div>
              </div>
              <p className="text-theme-dark-text-muted text-xs font-medium mt-2 text-center break-words">
                {item.category}
              </p>
              <p className={`text-xs ${isOverBudget ? 'text-theme-dark-negative' : 'text-theme-dark-text-muted'}`}>
                R {item.amount.toFixed(2)} / R {item.allocated.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
       <div className="flex justify-center space-x-4 mt-4 text-xs text-theme-dark-text-muted">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-theme-dark-text-muted/50 rounded-sm mr-1"></span> Allocated
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-theme-dark-accent rounded-sm mr-1"></span> Spent (Under/On Budget)
        </div>
         <div className="flex items-center">
          <span className="w-3 h-3 bg-theme-dark-negative rounded-sm mr-1"></span> Spent (Over Budget)
        </div>
      </div>
    </div>
  );
};

export default BudgetBarChart;
