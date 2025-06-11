
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionContainer from '../components/SectionContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from '../components/icons/IconMap';
import { UserProfile, Transaction, AppSection, GroundingSource, BudgetItem, AppData, AIData } from '../types';
import { getFinancialLiteracyTip, analyzeSpendingForSavings } from '../services/geminiService';
import { NAVIGATION_ITEMS } from '../constants';
import { getTodaysDateISO, isFetchAllowedToday } from '../App'; // Import helpers

interface DashboardScreenProps {
  userProfile: UserProfile | null;
  transactions: Transaction[];
  budgetItems: BudgetItem[];
  appData: AppData;
  updateAppData: (updates: Partial<AppData>) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ userProfile, transactions, budgetItems, appData, updateAppData }) => {
  const [savingsAnalysis, setSavingsAnalysis] = useState<AIData<string> | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const canFetchFinancialTip = isFetchAllowedToday(appData.lastFinancialTipFetchDate);

  const fetchDailyFinancialTip = async () => {
    if (!canFetchFinancialTip && appData.dailyFinancialTip) {
      return;
    }
    setIsLoadingTip(true);
    try {
      const tipData = await getFinancialLiteracyTip();
      updateAppData({
        dailyFinancialTip: { data: tipData.tip, sources: tipData.sources, lastFetched: getTodaysDateISO() },
        lastFinancialTipFetchDate: getTodaysDateISO(),
      });
    } catch (error) {
      console.error("Error fetching daily tip:", error);
      updateAppData({
        dailyFinancialTip: { data: "Could not load tip. Please try again later.", lastFetched: getTodaysDateISO() },
      });
    }
    setIsLoadingTip(false);
  };
  
  useEffect(() => {
    // No auto-fetch on load, user must click the button
  }, []);


  useEffect(() => {
    if (transactions.length > 0) {
      const fetchAnalysis = async () => {
        setIsLoadingAnalysis(true);
        try {
          const analysisResult = await analyzeSpendingForSavings(transactions, budgetItems); 
          setSavingsAnalysis({data: analysisResult.analysis, sources: analysisResult.sources});
        } catch (error) {
          console.error("Error fetching spending analysis:", error);
          setSavingsAnalysis({ data: "Could not load spending analysis." });
        }
        setIsLoadingAnalysis(false);
      };
      fetchAnalysis();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, budgetItems]); 

  const quickActions = [
    { name: "Log Expense", path: "/financial?action=logExpense", icon: "currency-dollar" },
    { name: "Add Stock", path: "/household?action=addStock", icon: "archive" },
    { name: "Recipe Ideas", path: "/kitchen?action=recipeGen", icon: "beaker" },
    { name: "Energy Insights", path: "/energy", icon: "lightning-bolt" },
  ];

  const summaryCards = [
    { title: "Total Expenses (This Month)", value: `R ${transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}`, link: "/financial", linkText: "View Financials" },
  ];
  
  const renderSources = (sources?: GroundingSource[]) => {
    if (!sources || sources.length === 0) return null;
    return (
      <div className="mt-2">
        <p className="text-xs text-slate-500 font-semibold">Sources:</p>
        <ul className="list-disc list-inside space-y-1">
          {sources.map((source, idx) => source.web && (
            <li key={idx} className="text-xs">
              <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                {source.web.title || source.web.uri}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <SectionContainer title={`Welcome back${userProfile?.name ? `, ${userProfile.name}` : ''}!`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {summaryCards.map(card => (
          <Card key={card.title} title={card.title} titleClassName="text-secondary">
            <p className="text-3xl font-bold text-slate-700 mb-2">{card.value}</p>
            <Link to={card.link} className="text-sm text-primary hover:underline font-medium">{card.linkText}</Link>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Consider lg:grid-cols-4 if all fit well */}
          {quickActions.map(action => (
            <Link key={action.name} to={action.path}>
              <Button variant="outline" className="w-full flex items-center justify-center py-3 text-primary border-primary/50 hover:bg-primary/10">
                <Icon name={action.icon} className="w-5 h-5 mr-2" />
                {action.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Daily Financial Tip">
          {isLoadingTip ? <LoadingSpinner text="Fetching tip..." /> : (
            appData.dailyFinancialTip && appData.dailyFinancialTip.lastFetched === getTodaysDateISO() ? (
              <>
                <p className="text-slate-600 mb-2 whitespace-pre-line">{appData.dailyFinancialTip.data}</p>
                {renderSources(appData.dailyFinancialTip.sources)}
                <p className="text-xs text-slate-500 mt-3 italic">You've received your tip for today.</p>
              </>
            ) : (
               <Button onClick={fetchDailyFinancialTip} disabled={isLoadingTip || !canFetchFinancialTip}>
                {canFetchFinancialTip ? 'Get Today\'s Financial Tip' : 'Tip Received Today'}
              </Button>
            )
          )}
        </Card>

        {transactions.length > 0 && (
          <Card title="Spending Insights & Savings">
            {isLoadingAnalysis ? <LoadingSpinner text="Analyzing spending..." /> : (
              <>
                <p className="text-slate-600 mb-2 whitespace-pre-line">{savingsAnalysis?.data}</p>
                {renderSources(savingsAnalysis?.sources)}
              </>
            )}
          </Card>
        )}
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Explore Sections</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {NAVIGATION_ITEMS.filter(item => item.name !== AppSection.Dashboard && item.name !== AppSection.Settings).map(item => (
            <Link key={item.name} to={item.path}>
              <Card className="text-center hover:shadow-xl hover:border-primary/40 transform hover:-translate-y-1 transition-all duration-150 ease-in-out">
                <Icon name={item.icon} className="w-10 h-10 mx-auto mb-3 text-primary" />
                <p className="font-medium text-slate-600">{item.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default DashboardScreen;
