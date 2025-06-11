
import React, { useState, useMemo, useEffect, ChangeEvent } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { AppData, BudgetItem, Transaction, TransactionType, UserProfile, BudgetCategorySpending, AIData, GroundingSource } from '../types';
import { DEFAULT_EXPENSE_CATEGORIES } from '../constants';
import { getBudgetFeedback } from '../services/geminiService';
import { getTodaysDateISO, isFetchAllowedToday } from '../App'; // Import helpers from App

import ArrowLeftIcon from '../components/icons/ArrowLeftIcon';
import Select from '../components/Select';
import Input from '../components/Input';
import Button from '../components/Button';
import BudgetBarChart from '../components/charts/BudgetBarChart';
import LoadingSpinner from '../components/LoadingSpinner';

interface BudgetScreenProps {
  appData: AppData;
  updateAppData: (updates: Partial<AppData>) => void;
  setBudgetItemsProp: (items: BudgetItem[]) => void; // Renamed to avoid conflict with local state
  userProfile: UserProfile | null;
}

type BudgetTab = "overview" | "set_budgets" | "ai_insights";

const BudgetScreen: React.FC<BudgetScreenProps> = ({ appData, updateAppData, setBudgetItemsProp, userProfile }) => {
  const navigate = ReactRouterDOM.useNavigate();
  const { transactions, budgetItems: globalBudgetItems } = appData;

  const [activeTab, setActiveTab] = useState<BudgetTab>("overview");
  
  const [editingBudgetItem, setEditingBudgetItem] = useState<BudgetItem | null>(null);
  const [categoryInput, setCategoryInput] = useState<string>(DEFAULT_EXPENSE_CATEGORIES[0] || '');
  const [allocatedInput, setAllocatedInput] = useState<string>('');

  const [isLoadingAiFeedback, setIsLoadingAiFeedback] = useState(false);
  const canFetchBudgetFeedback = isFetchAllowedToday(appData.lastBudgetFeedbackFetchDate);

  useEffect(() => {
    if (editingBudgetItem) {
      setCategoryInput(editingBudgetItem.category);
      setAllocatedInput(editingBudgetItem.allocated.toString());
    } else {
      setCategoryInput(DEFAULT_EXPENSE_CATEGORIES[0] || '');
      setAllocatedInput('');
    }
  }, [editingBudgetItem]);


  const calculateSpentForCategory = (category: string): number => {
    return transactions
      .filter(t => t.type === TransactionType.Expense && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const budgetDataForChart: BudgetCategorySpending[] = useMemo(() => {
    return globalBudgetItems.map(item => ({
      ...item,
      category: item.category,
      allocated: item.allocated,
      amount: calculateSpentForCategory(item.category), 
    }));
  }, [globalBudgetItems, transactions]);

  const totalAllocated = useMemo(() => budgetDataForChart.reduce((sum, item) => sum + item.allocated, 0), [budgetDataForChart]);
  const totalSpentInBudgetedCategories = useMemo(() => budgetDataForChart.reduce((sum, item) => sum + item.amount, 0), [budgetDataForChart]);

  const handleAddOrUpdateBudgetItem = () => {
    if (!categoryInput || !allocatedInput) {
      alert("Please select a category and enter an allocated amount.");
      return;
    }
    const allocated = parseFloat(allocatedInput);
    if (isNaN(allocated) || allocated < 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    let updatedBudgetItems;
    if (editingBudgetItem) {
      updatedBudgetItems = globalBudgetItems.map(item =>
        item.id === editingBudgetItem.id ? { ...item, category: categoryInput, allocated } : item
      );
    } else {
      if (globalBudgetItems.find(item => item.category === categoryInput)) {
        alert(`Budget for category "${categoryInput}" already exists. Please edit the existing item.`);
        return;
      }
      const newItem: BudgetItem = {
        id: Date.now().toString(),
        category: categoryInput,
        allocated,
        spent: 0, 
      };
      updatedBudgetItems = [...globalBudgetItems, newItem];
    }
    setBudgetItemsProp(updatedBudgetItems);
    setEditingBudgetItem(null); 
  };

  const handleDeleteBudgetItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this budget item?")) {
      const updatedBudgetItems = globalBudgetItems.filter(item => item.id !== id);
      setBudgetItemsProp(updatedBudgetItems);
      if (editingBudgetItem && editingBudgetItem.id === id) {
        setEditingBudgetItem(null); 
      }
    }
  };

  const fetchAiBudgetFeedback = async () => {
    if (!canFetchBudgetFeedback) return;
    setIsLoadingAiFeedback(true);
    const { feedback, sources } = await getBudgetFeedback(globalBudgetItems, transactions, userProfile);
    updateAppData({
      budgetFeedback: { data: feedback, sources, lastFetched: getTodaysDateISO() },
      lastBudgetFeedbackFetchDate: getTodaysDateISO(),
    });
    setIsLoadingAiFeedback(false);
  };
  
  const renderSources = (sources?: GroundingSource[]) => {
    if (!sources || sources.length === 0) return null;
    return (
      <div className="mt-3 text-xs">
        <p className="font-semibold text-theme-dark-text-muted">Sources:</p>
        <ul className="list-disc list-inside text-theme-dark-text-muted space-y-1">
          {sources.map((source, idx) => source.web && (
            <li key={idx}>
              <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-theme-dark-accent hover:underline">
                {source.web.title || source.web.uri}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-theme-dark-ui-element p-4 rounded-lg shadow">
          <p className="text-theme-dark-text-muted text-sm">Total Budgeted</p>
          <p className="text-theme-dark-text text-2xl font-bold">R {totalAllocated.toFixed(2)}</p>
        </div>
        <div className="bg-theme-dark-ui-element p-4 rounded-lg shadow">
          <p className="text-theme-dark-text-muted text-sm">Total Spent (Budgeted)</p>
          <p className="text-theme-dark-text text-2xl font-bold">R {totalSpentInBudgetedCategories.toFixed(2)}</p>
        </div>
        <div className="bg-theme-dark-ui-element p-4 rounded-lg shadow">
          <p className="text-theme-dark-text-muted text-sm">Remaining Budget</p>
          <p className={`text-2xl font-bold ${totalAllocated - totalSpentInBudgetedCategories >= 0 ? 'text-theme-dark-positive' : 'text-theme-dark-negative'}`}>
            R {(totalAllocated - totalSpentInBudgetedCategories).toFixed(2)}
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-theme-dark-text text-xl font-semibold mb-3">Spending vs. Allocated Budget</h3>
        <BudgetBarChart data={budgetDataForChart} />
      </div>
    </div>
  );

  const renderSetBudgetsTab = () => (
    <div className="space-y-6">
      <div className="bg-theme-dark-ui-element p-6 rounded-lg shadow">
        <h3 className="text-theme-dark-text text-lg font-semibold mb-4">
          {editingBudgetItem ? 'Edit Budget Item' : 'Add New Budget Item'}
        </h3>
        <div className="space-y-4">
          <Select
            label="Category"
            options={DEFAULT_EXPENSE_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
            value={categoryInput}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategoryInput(e.target.value)}
            className="bg-theme-dark-bg border-theme-dark-border text-theme-dark-text focus:ring-theme-dark-accent focus:border-theme-dark-accent placeholder:text-theme-dark-text-muted/50"
            labelClassName="text-theme-dark-text-muted"
          />
          <Input
            label="Allocated Amount (R)"
            type="number"
            value={allocatedInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAllocatedInput(e.target.value)}
            placeholder="e.g., 1500"
            className="bg-theme-dark-bg border-theme-dark-border text-theme-dark-text focus:ring-theme-dark-accent focus:border-theme-dark-accent placeholder:text-theme-dark-text-muted/50"
            labelClassName="text-theme-dark-text-muted"
          />
          <div className="flex space-x-3 pt-2">
            <Button 
              onClick={handleAddOrUpdateBudgetItem}
              className="bg-theme-dark-accent text-theme-dark-bg hover:bg-theme-dark-accent/80 focus:ring-theme-dark-accent/70"
            >
              {editingBudgetItem ? 'Update Item' : 'Add Item'}
            </Button>
            {editingBudgetItem && (
              <Button 
                onClick={() => setEditingBudgetItem(null)}
                variant="ghost" 
                className="text-theme-dark-text-muted hover:bg-theme-dark-text-muted/20 focus:ring-theme-dark-text-muted/50"
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-theme-dark-ui-element p-6 rounded-lg shadow">
        <h3 className="text-theme-dark-text text-lg font-semibold mb-4">Current Budget Items</h3>
        {globalBudgetItems.length === 0 ? (
          <p className="text-theme-dark-text-muted">No budget items set yet.</p>
        ) : (
          <ul className="space-y-4">
            {globalBudgetItems.map(item => {
              const spent = calculateSpentForCategory(item.category);
              const remaining = item.allocated - spent;
              const progress = item.allocated > 0 ? (spent / item.allocated) * 100 : 0;
              return (
                <li key={item.id} className="p-4 bg-theme-dark-bg/50 rounded-md shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-theme-dark-text font-medium">{item.category}</span>
                    <span className="text-theme-dark-text-muted text-sm">
                      Allocated: R {item.allocated.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-theme-dark-border rounded-full h-2.5 mb-2">
                    <div
                      className={`${spent > item.allocated ? 'bg-theme-dark-negative' : 'bg-theme-dark-positive'} h-2.5 rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${Math.min(100, Math.max(0,progress))}%` }} // Ensure width is between 0 and 100
                    ></div>
                  </div>
                  <div className="text-xs text-theme-dark-text-muted flex justify-between">
                    <span>Spent: R {spent.toFixed(2)}</span>
                    <span className={remaining < 0 ? 'text-theme-dark-negative font-semibold' : 'text-theme-dark-positive'}>
                      Remaining: R {remaining.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditingBudgetItem(item)} className="text-theme-dark-accent hover:bg-theme-dark-accent/20 focus:ring-theme-dark-accent/50">Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteBudgetItem(item.id)} className="text-theme-dark-negative hover:bg-theme-dark-negative/20 focus:ring-theme-dark-negative/50">Delete</Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );

  const renderAiInsightsTab = () => (
    <div className="bg-theme-dark-ui-element p-6 rounded-lg shadow">
      <h3 className="text-theme-dark-text text-lg font-semibold mb-4">AI Budget Feedback (1/day)</h3>
      {isLoadingAiFeedback ? (
        <LoadingSpinner text="Analyzing your budget..." />
      ) : appData.budgetFeedback?.data ? (
        <>
          <div className="p-4 bg-theme-dark-bg/50 rounded text-theme-dark-text-muted whitespace-pre-line leading-relaxed">
            {appData.budgetFeedback.data}
          </div>
          {renderSources(appData.budgetFeedback.sources)}
          {!canFetchBudgetFeedback && <p className="text-xs text-theme-dark-text-muted mt-4 italic">Today's budget feedback received.</p>}
        </>
      ) : (
         <p className="text-theme-dark-text-muted mb-4">Get AI-powered feedback on your budget's realism and suggestions for improvement based on general South African benchmarks.</p>
      )}
      {canFetchBudgetFeedback && (
        <Button 
          onClick={fetchAiBudgetFeedback} 
          isLoading={isLoadingAiFeedback}
          disabled={globalBudgetItems.length === 0}
          className="bg-theme-dark-accent text-theme-dark-bg hover:bg-theme-dark-accent/80 focus:ring-theme-dark-accent/70 mt-3"
        >
          {globalBudgetItems.length === 0 ? "Set a Budget First" : "Get AI Budget Feedback"}
        </Button>
      )}
    </div>
  );
  
  return (
    <div className="bg-theme-dark-bg text-theme-dark-text min-h-screen p-0 md:p-4 pb-16">
      <div className="flex items-center bg-theme-dark-bg p-4 pb-2 justify-between sticky top-0 z-20 md:relative">
        <button onClick={() => navigate(-1)} className="text-theme-dark-text flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-theme-dark-ui-element/70 transition-colors">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="text-theme-dark-text text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Budget Management
        </h2>
      </div>

      <div className="pb-3 sticky top-[72px] md:top-0 bg-theme-dark-bg z-20">
        <div className="flex border-b border-theme-dark-border px-4 gap-2 sm:gap-8 justify-center md:justify-start">
          {(Object.keys({overview: "Overview", set_budgets: "Set Budgets", ai_insights: "AI Insights"}) as BudgetTab[]).map(tabKey => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 px-2 sm:px-4
                ${activeTab === tabKey ? 'border-b-theme-dark-accent text-theme-dark-text' : 'border-b-transparent text-theme-dark-text-muted hover:text-theme-dark-text transition-colors'}`}
            >
              <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                {{overview: "Overview", set_budgets: "Set Budgets", ai_insights: "AI Insights"}[tabKey]}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "set_budgets" && renderSetBudgetsTab()}
        {activeTab === "ai_insights" && renderAiInsightsTab()}
      </div>
    </div>
  );
};

export default BudgetScreen;
