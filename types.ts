export enum AppSection {
  Dashboard = 'Dashboard',
  Financial = 'Financial',
  Energy = 'Energy',
  Household = 'Household',
  Kitchen = 'Kitchen',
  Wellness = 'Wellness',
  Onboarding = 'Onboarding', // App-specific onboarding
  Settings = 'Settings',
  Budget = 'Budget',
  // Login = 'Login', // Removed
}

export interface UserProfile {
  username?: string; 
  name?: string; 
  location?: string; 
  householdSize?: number;
  incomeLevel?: string; 
  electricityTariff?: string; 
  onboarded_app: boolean; 
  avatar_url?: string | null; // Will be a placeholder or initials if actual upload is removed
}

export enum TransactionType {
  Income = 'Income',
  Expense = 'Expense',
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number;
  category: string; // User-defined or AI-suggested
  type: TransactionType;
}

export interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number; // Calculated from transactions for display purposes
}

export interface Appliance {
  id: string;
  name: string;
  estimatedKWHLow: number; 
  estimatedKWHHigh: number; 
  notes?: string;
  typicalConsumption?: string; 
  lastTypicalConsumptionFetch?: string; 
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // e.g., "kg", "liters", "items"
  lowStockThreshold?: number;
  lastUpdated: string; // ISO string - general last update
  lastRestockedDate?: string; // ISO string - when item was last restocked/quantity increased significantly
  lastUsedUpDate?: string; // ISO string - when item was marked as "Used Up" (quantity became 0)
  estimatedConsumptionDays?: number; // Estimated days this item lasts based on usage
}

export interface MealPlanItem {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  description: string; 
}

export interface GroceryListItem {
  id: string;
  name: string;
  quantity: string; 
  isChecked: boolean;
}

export interface PriceComparisonResult {
  item: string;
  store: string;
  price: string;
  lastChecked: string; // ISO string
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
  [key: string]: any; 
}

export interface DailyUsageTracker {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface DatedFetchTracker {
  [key: string]: string; 
}

export interface AIData<T> {
  data: T;
  sources?: GroundingSource[];
  lastFetched?: string; // YYYY-MM-DD
}

export interface ConsumptionEstimateData {
    estimates: Record<string, string>; 
    totalKWh: number;
    period: string;
}

// For What-If Planner
export type WhatIfFrequency = 'once' | 'monthly' | 'yearly';

// Central AppData structure (Primarily for localStorage)
export interface AppData {
  userProfile: UserProfile | null; // Local user profile
  transactions: Transaction[];
  budgetItems: BudgetItem[];
  appliances: Appliance[];
  stockItems: StockItem[];
  mealPlan: MealPlanItem[];
  groceryList: GroceryListItem[];

  lastFinancialTipFetchDate?: string | null;
  dailyFinancialTip?: AIData<string> | null;

  lastEnergySavingTipFetchDate?: string | null;
  energySavingTips?: AIData<string[]> | null;
  
  lastApplianceCareTipFetchDates?: DatedFetchTracker | null;
  applianceCareTips?: { [applianceName: string]: AIData<string> } | null;

  lastInsuranceBasicTipFetchDate?: string | null;
  insuranceBasicTip?: AIData<string> | null;

  lastConsumptionEstimateRequestDate?: string | null;
  consumptionEstimates?: AIData<ConsumptionEstimateData> | null;

  recipeGenerationUsage?: DailyUsageTracker | null;
  priceComparisonUsage?: DailyUsageTracker | null;

  lastKitchenTipFetchDate?: string | null;
  kitchenUtilityTip?: AIData<string> | null;

  lastFitnessTipFetchDate?: string | null;
  fitnessTip?: AIData<string> | null;

  lastGardeningTipFetchDate?: string | null;
  gardeningGuide?: AIData<string> | null;

  lastBudgetFeedbackFetchDate?: string | null;
  budgetFeedback?: AIData<string> | null;
}

// Chart-specific types
export interface MonthlySpending {
  month: string; // e.g., "Jan", "Feb"
  amount: number;
}

export interface CategoricalSpending {
  category: string;
  amount: number;
  percentage?: number; // Optional: for bar height calculation if needed
}

export interface BudgetCategorySpending extends CategoricalSpending {
  allocated: number;
}