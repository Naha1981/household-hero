
import React, { useState, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { AppData, Transaction, TransactionType, MonthlySpending, CategoricalSpending, GroundingSource } from '../types';
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import SpendingLineChart from '../components/charts/SpendingLineChart';
import SpendingBarChart from '../components/charts/SpendingBarChart';

interface SpendingOverviewScreenProps {
  appData: AppData;
}

type SpendingTab = "overview" | "categories" | "merchants";

const SpendingOverviewScreen: React.FC<SpendingOverviewScreenProps> = ({ appData }) => {
  const navigate = ReactRouterDOM.useNavigate();
  const [activeTab, setActiveTab] = useState<SpendingTab>("overview");
  const { transactions } = appData;

  const processSpendingOverTime = (monthsAgo: number): MonthlySpending[] => {
    const currentDate = new Date();
    const monthlyData: { [key: string]: number } = {};
    const monthLabels: string[] = [];

    for (let i = monthsAgo - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      monthlyData[monthKey] = 0;
      monthLabels.push(monthName);
    }
    
    transactions.forEach(t => {
      if (t.type === TransactionType.Expense) {
        const tDate = new Date(t.date);
        const monthKey = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyData.hasOwnProperty(monthKey)) {
          monthlyData[monthKey] += t.amount;
        }
      }
    });
    
    return monthLabels.map((label, index) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - (monthsAgo - 1 - index), 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        return { month: label, amount: monthlyData[key] || 0 };
    });
  };

  const spendingOverLast6Months = useMemo(() => processSpendingOverTime(6), [transactions]);
  const totalLast6Months = useMemo(() => spendingOverLast6Months.reduce((sum, item) => sum + item.amount, 0), [spendingOverLast6Months]);

  const processSpendingByCategoryThisMonth = (): CategoricalSpending[] => {
    const currentDate = new Date();
    const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const categoryData: { [category: string]: number } = {};

    transactions.forEach(t => {
      if (t.type === TransactionType.Expense) {
        const tDate = new Date(t.date);
        const monthKey = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;
        if (monthKey === currentMonthKey) {
          categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
        }
      }
    });
    return Object.entries(categoryData)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };
  
  const spendingByCategoryThisMonth = useMemo(() => processSpendingByCategoryThisMonth(), [transactions]);
  const totalThisMonth = useMemo(() => spendingByCategoryThisMonth.reduce((sum, item) => sum + item.amount, 0), [spendingByCategoryThisMonth]);
  
  // Placeholder for percentage change - proper calculation would require previous period data.
  // const last6MonthsChange = -12; 
  // const thisMonthChange = 5;

  const renderOverview = () => (
    <>
      <div className="flex flex-wrap gap-6 py-6">
        <div className="flex min-w-72 flex-1 flex-col gap-3 bg-theme-dark-ui-element p-6 rounded-lg shadow-xl">
          <p className="text-theme-dark-text text-base font-medium leading-normal">Spending over time</p>
          <p className="text-theme-dark-text tracking-light text-4xl font-bold leading-tight truncate">R {totalLast6Months.toFixed(2)}</p>
          <div className="flex gap-2 items-baseline">
            <p className="text-theme-dark-text-muted text-base font-normal leading-normal">Last 6 months</p>
            {/* Placeholder for change percentage display if logic is added */}
            {/* <p className={`${last6MonthsChange < 0 ? 'text-theme-dark-negative' : 'text-theme-dark-positive'} text-base font-medium leading-normal`}>
              {last6MonthsChange > 0 ? '+' : ''}{last6MonthsChange}%
            </p> */}
          </div>
          <div className="flex min-h-[200px] flex-1 flex-col gap-8 py-4">
            <SpendingLineChart data={spendingOverLast6Months} />
          </div>
        </div>
      {/* </div>
      <div className="flex flex-wrap gap-6 py-6 pt-0"> */}
        <div className="flex min-w-72 flex-1 flex-col gap-3 bg-theme-dark-ui-element p-6 rounded-lg shadow-xl">
          <p className="text-theme-dark-text text-base font-medium leading-normal">Spending by category</p>
          <p className="text-theme-dark-text tracking-light text-4xl font-bold leading-tight truncate">R {totalThisMonth.toFixed(2)}</p>
          <div className="flex gap-2 items-baseline">
            <p className="text-theme-dark-text-muted text-base font-normal leading-normal">This month</p>
            {/* Placeholder for change percentage display */}
           {/*  <p className={`${thisMonthChange < 0 ? 'text-theme-dark-negative' : 'text-theme-dark-positive'} text-base font-medium leading-normal`}>
              {thisMonthChange > 0 ? '+' : ''}{thisMonthChange}%
            </p> */}
          </div>
           <SpendingBarChart data={spendingByCategoryThisMonth.slice(0,4)} /> {/* Show top 4 for example */}
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-theme-dark-bg text-theme-dark-text min-h-screen p-0 md:p-4 pb-16">
      <div className="flex items-center bg-theme-dark-bg p-4 pb-2 justify-between sticky top-0 z-30 md:relative">
        <button onClick={() => navigate(-1)} className="text-theme-dark-text flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-theme-dark-ui-element/70 transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-theme-dark-text text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Spending Analysis
        </h2>
      </div>

      <div className="pb-3 sticky top-[72px] md:top-0 bg-theme-dark-bg z-20">
        <div className="flex border-b border-theme-dark-border px-4 gap-2 sm:gap-8 justify-center md:justify-start">
          {(Object.keys({overview: "Overview", categories: "Categories", merchants: "Merchants"}) as SpendingTab[]).map(tabKey => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 px-2 sm:px-4
                ${activeTab === tabKey ? 'border-b-theme-dark-accent text-theme-dark-text' : 'border-b-transparent text-theme-dark-text-muted hover:text-theme-dark-text transition-colors'}`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                {{overview: "Overview", categories: "Categories", merchants: "Merchants"}[tabKey]}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "categories" && <div className="text-center py-16 text-theme-dark-text-muted">Categories view coming soon. Stay tuned!</div>}
        {activeTab === "merchants" && <div className="text-center py-16 text-theme-dark-text-muted">Merchants view coming soon. We're working on it!</div>}
      </div>
    </div>
  );
};

export default SpendingOverviewScreen;
