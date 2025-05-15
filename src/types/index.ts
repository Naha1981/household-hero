/**
 * Type definitions for the HouseHoldHero AI app
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// Navigation Types
export type RootStackParamList = {
  Landing: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  RecipeDetail: { recipe: Recipe };
  StockDetail: { item: StockItem };
  TransactionDetail: { transaction: Transaction };
  EnergyDetail: { reading: EnergyReading };
  BudgetEdit: { budget?: Budget };
  Settings: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Financial: undefined;
  Energy: undefined;
  Stock: undefined;
  Kitchen: undefined;
  Wellness: undefined;
};

// User profile types
export interface UserProfile {
  uid: string;
  name: string;
  householdSize: string;
  province: string;
  incomeRange: string;
  electricityProvider: string;
  tariff: string;
  createdAt?: string;
  updatedAt?: string;
}

// Financial types
export interface Transaction {
  id: string;
  userId: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  createdAt?: string;
}

export interface Budget {
  id?: string;
  userId: string;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetSummary {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  color: string;
}

export interface FinancialSummary {
  income: number;
  expenses: number;
  balance: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
}

// Energy types
export interface EnergyReading {
  id: string;
  userId: string;
  date: string;
  reading: number;
  purchaseAmount?: number;
  purchaseUnits?: number;
  createdAt?: string;
}

export interface EnergyUsageSummary {
  currentReading: number;
  dailyAverage: number;
  estimatedDaysLeft: number;
  lastPurchase: {
    date: string;
    amount: number;
    units: number;
  };
  applianceBreakdown: {
    name: string;
    dailyUsage: number;
    monthlyCost: number;
    percentage: number;
  }[];
}

// Stock types
export interface StockItem {
  id: string;
  userId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  daysLeft: number;
  lowStockAlert: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockCategory {
  id: string;
  name: string;
  icon: string;
}

// Recipe types
export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  image?: string;
  source?: string;
  tags?: string[];
}

export interface GroceryPrice {
  item: string;
  prices: {
    store: string;
    price: number;
    onSpecial: boolean;
  }[];
}

// Wellness types
export interface FitnessRoutine {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  image?: string;
  exercises: {
    name: string;
    reps?: string;
    duration?: string;
  }[];
}

export interface GardeningTip {
  id: string;
  title: string;
  description: string;
  image?: string;
  tips: string[];
  region?: string;
  season?: string;
}

// Gemini API types
export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export interface FinancialAnalysisPrompt {
  userId: string;
  transactions: Transaction[];
}

export interface EnergyAnalysisPrompt {
  userId: string;
  meterReading: number;
  tariff: string;
  appliances: {
    name: string;
    hoursPerDay: number;
  }[];
}

export interface RecipeGenerationPrompt {
  ingredients: string[];
  dietaryPreferences?: string[];
}


