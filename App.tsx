
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import OnboardingScreen from './screens/OnboardingScreen';
import DashboardScreen from './screens/DashboardScreen';
import FinancialScreen from './screens/FinancialScreen';
import EnergyScreen from './screens/EnergyScreen';
import HouseholdScreen from './screens/HouseholdScreen';
import KitchenScreen from './screens/KitchenScreen';
import WellnessScreen from './screens/WellnessScreen';
import SettingsScreen from './screens/SettingsScreen';
import BudgetScreen from './screens/BudgetScreen';
// LoginScreen and SignupScreen are removed
import ProtectedRoute from './components/ProtectedRoute'; 
import LoadingSpinner from './components/LoadingSpinner';
// AuthProvider and useAuth are removed
import SpendingOverviewScreen from './screens/SpendingOverviewScreen';
import { 
  UserProfile, Transaction, BudgetItem, Appliance, StockItem, MealPlanItem, GroceryListItem,
  AppData 
} from './types';

const APP_STORAGE_KEY = 'houseHoldHeroAI_data_v1_local'; // Generic key for local storage

export const getTodaysDateISO = (): string => new Date().toISOString().split('T')[0];

export const isFetchAllowedToday = (lastFetchDate?: string | null): boolean => {
  if (!lastFetchDate) return true;
  return lastFetchDate !== getTodaysDateISO();
};

export const isUsageAllowedToday = (usageTracker: AppData['recipeGenerationUsage'], limit: number): { allowed: boolean; count: number } => {
  const today = getTodaysDateISO();
  if (!usageTracker || usageTracker.date !== today) {
    return { allowed: true, count: 0 }; 
  }
  return { allowed: usageTracker.count < limit, count: usageTracker.count };
};

export const incrementUsageTracker = (usageTracker: AppData['recipeGenerationUsage'] ): AppData['recipeGenerationUsage'] => {
    const today = getTodaysDateISO();
    if (!usageTracker || usageTracker.date !== today) {
        return { date: today, count: 1};
    }
    return { ...usageTracker, count: usageTracker.count + 1 };
};

const defaultAppData: AppData = { 
  userProfile: null, // Initialize userProfile as null
  transactions: [], budgetItems: [], appliances: [], stockItems: [],
  mealPlan: [], groceryList: [],
  lastFinancialTipFetchDate: null, dailyFinancialTip: null,
  lastEnergySavingTipFetchDate: null, energySavingTips: null,
  lastApplianceCareTipFetchDates: null, applianceCareTips: null,
  lastInsuranceBasicTipFetchDate: null, insuranceBasicTip: null,
  lastConsumptionEstimateRequestDate: null, consumptionEstimates: null,
  recipeGenerationUsage: null, priceComparisonUsage: null,
  lastKitchenTipFetchDate: null, kitchenUtilityTip: null,
  lastFitnessTipFetchDate: null, fitnessTip: null,
  lastGardeningTipFetchDate: null, gardeningGuide: null,
  lastBudgetFeedbackFetchDate: null, budgetFeedback: null,
};


const App: React.FC = () => {
  const [appData, setAppDataState] = useState<AppData>(defaultAppData);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    setIsDataLoading(true);
    try {
      const storedData = localStorage.getItem(APP_STORAGE_KEY);
      if (storedData) {
        const parsedData: AppData = JSON.parse(storedData);
        setAppDataState({ ...defaultAppData, ...parsedData });
      } else {
        setAppDataState(defaultAppData); 
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setAppDataState(defaultAppData);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isDataLoading) { 
      try {
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appData));
      } catch (error) {
        console.error("Error saving data to localStorage:", error);
      }
    }
  }, [appData, isDataLoading]);

  const updateAppData = useCallback((updates: Partial<AppData> | ((prevState: AppData) => Partial<AppData>)) => {
    setAppDataState(prev => ({ ...prev, ...(typeof updates === 'function' ? updates(prev) : updates) }));
  }, []);
  
  const clearAllLocalUserData = useCallback(() => {
    localStorage.removeItem(APP_STORAGE_KEY);
    setAppDataState(defaultAppData); 
    // Potentially navigate to onboarding after clearing data
    // navigate('/app-onboarding', { replace: true }); // Requires navigate from react-router-dom
  }, []);
  
  const setTransactions = (transactions: Transaction[] | ((prev: Transaction[]) => Transaction[])) => 
    updateAppData(prev => ({ transactions: typeof transactions === 'function' ? transactions(prev.transactions) : transactions }));
  const setBudgetItems = (items: BudgetItem[] | ((prev: BudgetItem[]) => BudgetItem[])) => 
    updateAppData(prev => ({ budgetItems: typeof items === 'function' ? items(prev.budgetItems) : items }));
  const setAppliances = (items: Appliance[] | ((prev: Appliance[]) => Appliance[])) => 
    updateAppData(prev => ({ appliances: typeof items === 'function' ? items(prev.appliances) : items }));
  const setStockItems = (items: StockItem[] | ((prev: StockItem[]) => StockItem[])) => 
    updateAppData(prev => ({ stockItems: typeof items === 'function' ? items(prev.stockItems) : items }));
  const setMealPlan = (items: MealPlanItem[] | ((prev: MealPlanItem[]) => MealPlanItem[])) => 
    updateAppData(prev => ({ mealPlan: typeof items === 'function' ? items(prev.mealPlan) : items }));
  const setGroceryList = (items: GroceryListItem[] | ((prev: GroceryListItem[]) => GroceryListItem[])) => 
    updateAppData(prev => ({ groceryList: typeof items === 'function' ? items(prev.groceryList) : items }));
  
  const setUserProfile = (profile: UserProfile | null | ((prev: UserProfile | null) => UserProfile | null)) =>
    updateAppData(prev => ({ userProfile: typeof profile === 'function' ? profile(prev.userProfile) : profile }));


  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <LoadingSpinner size="lg" text="Loading HouseHoldHero AI..." />
      </div>
    );
  }
  
  const hasOnboarded = appData.userProfile?.onboarded_app === true;

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        {hasOnboarded && <Navbar userProfile={appData.userProfile} />} 
        <main className={`flex-grow ${hasOnboarded ? 'max-w-7xl w-full mx-auto py-6 sm:py-8 px-2 sm:px-4 lg:px-6' : ''}`}>
          <Routes>
            {/* Onboarding is now the primary entry if no profile or not onboarded */}
            <Route path="/app-onboarding" element={
              <OnboardingScreen 
                userProfile={appData.userProfile} 
                setUserProfile={setUserProfile} 
              />} 
            />
            
            <Route element={<ProtectedRoute userProfile={appData.userProfile} />}>
              <Route path="/" element={
                <DashboardScreen 
                  userProfile={appData.userProfile} 
                  transactions={appData.transactions}
                  budgetItems={appData.budgetItems}
                  appData={appData}
                  updateAppData={updateAppData}
                />} 
              />
              <Route path="/financial" element={
                <FinancialScreen 
                  transactions={appData.transactions} 
                  setTransactions={setTransactions} 
                  budgetItems={appData.budgetItems} 
                  setBudgetItems={setBudgetItems} 
                  userProfile={appData.userProfile} 
                  appData={appData}
                  updateAppData={updateAppData}
                />} 
              />
              <Route path="/budget" element={
                <BudgetScreen
                  appData={appData}
                  updateAppData={updateAppData}
                  setBudgetItemsProp={setBudgetItems} // Pass the correct setter
                  userProfile={appData.userProfile} 
                />}
              />
              <Route path="/spending-overview" element={
                <SpendingOverviewScreen 
                  appData={appData}
                />} 
              />
              <Route path="/energy" element={
                <EnergyScreen 
                  userProfile={appData.userProfile} 
                  appliances={appData.appliances} 
                  setAppliances={setAppliances}
                  appData={appData}
                  updateAppData={updateAppData} 
                />} 
              />
              <Route path="/household" element={
                <HouseholdScreen 
                  stockItems={appData.stockItems} 
                  setStockItems={setStockItems} 
                />} 
              />
              <Route path="/kitchen" element={
                <KitchenScreen 
                  groceryList={appData.groceryList} 
                  setGroceryList={setGroceryList} 
                  mealPlan={appData.mealPlan} 
                  setMealPlan={setMealPlan}
                  appData={appData}
                  updateAppData={updateAppData}
                />} 
              />
              <Route path="/wellness" element={
                <WellnessScreen 
                  appData={appData}
                  updateAppData={updateAppData}
                />} 
              />
              <Route path="/settings" element={
                <SettingsScreen 
                  userProfile={appData.userProfile}
                  setUserProfile={setUserProfile}
                  clearAllData={clearAllLocalUserData} 
                />} 
              />
            </Route>
            {/* Fallback route: if onboarded, go to dashboard, else to onboarding */}
            <Route path="*" element={<Navigate to={hasOnboarded ? "/" : "/app-onboarding"} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;