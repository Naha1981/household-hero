
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SectionContainer from '../components/SectionContainer';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { Transaction, TransactionType, BudgetItem, UserProfile, GroundingSource, AppData, AIData, WhatIfFrequency } from '../types';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../constants';
import { getCategorySuggestion, analyzeSpendingForSavings, getFinancialLiteracyTip } from '../services/geminiService';
import { getTodaysDateISO, isFetchAllowedToday } from '../App'; 

interface FinancialScreenProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  budgetItems: BudgetItem[];
  setBudgetItems: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
  userProfile: UserProfile | null;
  appData: AppData;
  updateAppData: (updates: Partial<AppData>) => void;
}

const FinancialScreen: React.FC<FinancialScreenProps> = ({ transactions, setTransactions, budgetItems, setBudgetItems, userProfile, appData, updateAppData }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [isLogModalOpen, setIsLogModalOpen] = useState(searchParams.get('action') === 'logExpense');
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.Expense);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [categorySuggestion, setCategorySuggestion] = useState('');
  const [isSuggestingCategory, setIsSuggestingCategory] = useState(false);
  
  const [savingsAnalysis, setSavingsAnalysis] = useState<AIData<string> | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  // What-If Planner State
  const [whatIfName, setWhatIfName] = useState('');
  const [whatIfAmount, setWhatIfAmount] = useState('');
  const [whatIfDate, setWhatIfDate] = useState(new Date().toISOString().split('T')[0]);
  const [whatIfFrequency, setWhatIfFrequency] = useState<WhatIfFrequency>('once');
  const [whatIfSimulationResult, setWhatIfSimulationResult] = useState<string | null>(null);

  const canFetchFinancialTip = isFetchAllowedToday(appData.lastFinancialTipFetchDate);

  const fetchDailyFinancialTip = async () => {
    if (!canFetchFinancialTip && appData.dailyFinancialTip) return;
    setIsLoadingTip(true);
    const tipData = await getFinancialLiteracyTip();
    updateAppData({
      dailyFinancialTip: { data: tipData.tip, sources: tipData.sources, lastFetched: getTodaysDateISO() },
      lastFinancialTipFetchDate: getTodaysDateISO(),
    });
    setIsLoadingTip(false);
  };

  useEffect(() => {
    if (searchParams.get('action') === 'logExpense' && !isLogModalOpen) {
      setIsLogModalOpen(true);
    }
  }, [searchParams, isLogModalOpen]);

  const closeLogModal = () => {
    setIsLogModalOpen(false);
    searchParams.delete('action');
    setSearchParams(searchParams);
  };

  const availableCategories = transactionType === TransactionType.Expense ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES;

  useEffect(() => {
    if (description.length > 5 && !isSuggestingCategory) {
      const handleSuggestCategory = async () => {
        setIsSuggestingCategory(true);
        const suggestion = await getCategorySuggestion(description, availableCategories);
        setCategorySuggestion(suggestion);
        if (availableCategories.includes(suggestion)) {
          setCategory(suggestion);
        } else if (suggestion !== "Other (Error)" && suggestion !== "Other (API Key Missing)") {
          setCategory("Other");
          setCustomCategory(suggestion);
        }
        setIsSuggestingCategory(false);
      };
      handleSuggestCategory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, transactionType]); 

  const handleLogTransaction = () => {
    if (!description || !amount || (!category && !customCategory)) {
      alert("Please fill all required fields.");
      return;
    }
    const finalCategory = category === "Other" ? customCategory : category;
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date,
      description,
      amount: parseFloat(amount),
      category: finalCategory,
      type: transactionType,
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setDescription('');
    setAmount('');
    setCategory('');
    setCustomCategory('');
    setCategorySuggestion('');
    closeLogModal();
  };
  
  const fetchSavingsAnalysis = async () => {
    if (transactions.length > 0) {
      setIsLoadingAnalysis(true);
      const analysisResult = await analyzeSpendingForSavings(transactions, budgetItems);
      setSavingsAnalysis({data: analysisResult.analysis, sources: analysisResult.sources});
      setIsLoadingAnalysis(false);
    }
  };

  useEffect(() => {
    fetchSavingsAnalysis();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, budgetItems]); 
  
  const totalIncome = transactions.filter(t => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  const handleSimulateImpact = () => {
    if (!whatIfName || !whatIfAmount) {
      setWhatIfSimulationResult("Please enter a purchase name and amount.");
      return;
    }
    const purchaseAmount = parseFloat(whatIfAmount);
    if (isNaN(purchaseAmount) || purchaseAmount <= 0) {
      setWhatIfSimulationResult("Please enter a valid positive amount for the purchase.");
      return;
    }

    const totalMonthlyBudget = budgetItems.reduce((sum, item) => sum + item.allocated, 0);
    let impactMessage = `Simulating impact of "${whatIfName}" (R ${purchaseAmount.toFixed(2)}):\n`;

    if (whatIfFrequency === 'once') {
      if (totalMonthlyBudget > 0) {
        const percentOfBudget = ((purchaseAmount / totalMonthlyBudget) * 100).toFixed(1);
        impactMessage += `- This one-time purchase is about ${percentOfBudget}% of your total monthly allocated budget (R ${totalMonthlyBudget.toFixed(2)}).\n`;
        impactMessage += `- If made this month, your remaining total budget might effectively be R ${(totalMonthlyBudget - purchaseAmount).toFixed(2)}.`;
      } else {
        impactMessage += `- As a one-time purchase. Consider how this fits into your current cash flow.`;
      }
    } else if (whatIfFrequency === 'monthly') {
      impactMessage += `- This would be a recurring monthly expense of R ${purchaseAmount.toFixed(2)}.\n`;
      if (totalMonthlyBudget > 0) {
        impactMessage += `- Your total monthly allocated budget would effectively decrease to R ${(totalMonthlyBudget - purchaseAmount).toFixed(2)}.`;
      }
      impactMessage += `\n- Ensure you adjust your other budget categories accordingly.`;
    } else if (whatIfFrequency === 'yearly') {
      const monthlyEquivalent = purchaseAmount / 12;
      impactMessage += `- This yearly expense is R ${purchaseAmount.toFixed(2)}, averaging R ${monthlyEquivalent.toFixed(2)} per month.\n`;
      if (totalMonthlyBudget > 0) {
        impactMessage += `- Consider setting aside R ${monthlyEquivalent.toFixed(2)} monthly. Your effective discretionary budget would be reduced by this amount.`;
      }
    }
    setWhatIfSimulationResult(impactMessage);
  };
  
  const renderSources = (sources?: GroundingSource[]) => {
    if (!sources || sources.length === 0) return null;
    return (
      <div className="mt-2 text-xs">
        <p className="font-semibold text-slate-600">Sources:</p>
        <ul className="list-disc list-inside space-y-1">
          {sources.map((source, idx) => source.web && (
             <li key={idx}><a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{source.web.title || source.web.uri}</a></li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <SectionContainer title="Financial Command Centre">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Income" titleClassName="text-success">
          <p className="text-2xl font-bold text-slate-700">R {totalIncome.toFixed(2)}</p>
        </Card>
        <Card title="Total Expenses" titleClassName="text-error">
          <p className="text-2xl font-bold text-slate-700">R {totalExpenses.toFixed(2)}</p>
        </Card>
        <Card title="Net Balance" titleClassName={netBalance >= 0 ? 'text-success' : 'text-error'}>
          <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-slate-700' : 'text-error'}`}>
            R {netBalance.toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <Button onClick={() => setIsLogModalOpen(true)} size="md">Log New Transaction</Button>
        <Link to="/budget">
          <Button variant="secondary" size="md">Manage Detailed Budget</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Financial Literacy Hub">
          {isLoadingTip ? <LoadingSpinner text="Fetching tip..." /> : (
            appData.dailyFinancialTip && appData.dailyFinancialTip.lastFetched === getTodaysDateISO() ? (
              <>
                <p className="text-slate-600 mb-2 whitespace-pre-line">{appData.dailyFinancialTip.data}</p>
                {renderSources(appData.dailyFinancialTip.sources)}
                <p className="text-xs text-slate-500 mt-3 italic">You've received your tip for today.</p>
              </>
            ) : (
               <Button onClick={fetchDailyFinancialTip} disabled={isLoadingTip || !canFetchFinancialTip} className="mt-2">
                {canFetchFinancialTip ? 'Get Today\'s Financial Tip' : 'Tip Already Received Today'}
              </Button>
            )
          )}
        </Card>
        <Card title="Savings Tips & Spending Analysis">
          {isLoadingAnalysis ? <LoadingSpinner text="Analyzing..." /> : (
            transactions.length === 0 ? <p className="text-slate-600">Log some transactions to get analysis.</p> : (
              <>
              <p className="text-slate-600 mb-2 whitespace-pre-line">{savingsAnalysis?.data}</p>
              {renderSources(savingsAnalysis?.sources)}
              <Button onClick={fetchSavingsAnalysis} size="sm" variant="ghost" className="mt-3 text-primary" disabled={isLoadingAnalysis}>Re-analyze Spending</Button>
              </>
            )
          )}
        </Card>
      </div>
      
      <Card title="Recent Transactions" className="mb-8">
        {transactions.length === 0 ? (
          <p className="text-slate-600">No transactions logged yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {transactions.slice(0, 10).map(t => ( 
              <li key={t.id} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800">{t.description}</p>
                    <p className="text-sm text-slate-500">{t.category} - {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <p className={`font-semibold ${t.type === TransactionType.Income ? 'text-success' : 'text-error'}`}>
                    {t.type === TransactionType.Income ? '+' : '-'}R {t.amount.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal isOpen={isLogModalOpen} onClose={closeLogModal} title="Log New Transaction">
        <div className="space-y-4">
          <Select
            label="Transaction Type"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as TransactionType)}
            options={[
              { value: TransactionType.Expense, label: "Expense" },
              { value: TransactionType.Income, label: "Income" },
            ]}
          />
          <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <Input label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Groceries at PnP" required />
          <Input label="Amount (R)" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g., 250.75" required />
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              ...availableCategories.map(c => ({ value: c, label: c })),
              { value: "Other", label: "Other (Specify)" }
            ]}
            required
          />
          {isSuggestingCategory && <LoadingSpinner size="sm" text="Suggesting category..."/>}
          {categorySuggestion && !isSuggestingCategory && <p className="text-sm text-slate-500">Suggested: {categorySuggestion}</p>}
          {category === "Other" && (
            <Input label="Custom Category" value={customCategory} onChange={e => setCustomCategory(e.target.value)} placeholder="e.g., Online Subscription" required />
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={closeLogModal}>Cancel</Button>
            <Button onClick={handleLogTransaction}>Log Transaction</Button>
          </div>
        </div>
      </Modal>
      
      <Card title="What-If Planner">
        <p className="text-sm text-slate-500 mb-4">Plan for large upcoming purchases and see their potential impact on your budget.</p>
        <div className="space-y-4">
          <Input
            label="Purchase Name"
            value={whatIfName}
            onChange={(e) => setWhatIfName(e.target.value)}
            placeholder="e.g., New washing machine"
          />
          <Input
            label="Amount (R)"
            type="number"
            value={whatIfAmount}
            onChange={(e) => setWhatIfAmount(e.target.value)}
            placeholder="e.g., 5000"
          />
          <Input
            label="Planned Date"
            type="date"
            value={whatIfDate}
            onChange={(e) => setWhatIfDate(e.target.value)}
          />
          <Select
            label="Repeat Frequency"
            value={whatIfFrequency}
            onChange={(e) => setWhatIfFrequency(e.target.value as WhatIfFrequency)}
            options={[
              { value: 'once', label: 'One-time' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
          />
          <Button onClick={handleSimulateImpact} className="w-full sm:w-auto">Simulate Impact</Button>
        </div>
        {whatIfSimulationResult && (
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-md">
            <h4 className="font-semibold text-indigo-700 mb-2">Simulation Result:</h4>
            <p className="text-sm text-indigo-600 whitespace-pre-line">{whatIfSimulationResult}</p>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-4 italic">This is a preview tool — results are simulations only. More detailed monthly impact analysis coming in future updates!</p>
      </Card>
    </SectionContainer>
  );
};

export default FinancialScreen;
