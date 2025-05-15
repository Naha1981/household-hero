import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the user profile type
interface UserProfile {
  uid: string;
  name: string;
  householdSize: string;
  province: string;
  incomeRange: string;
  electricityProvider: string;
  tariff: string;
}

// Define transaction type
interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}

// Define energy reading type
interface EnergyReading {
  id: string;
  date: string;
  reading: number;
  purchaseAmount?: number;
  purchaseUnits?: number;
}

// Define stock item type
interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  daysLeft: number;
  lowStockAlert: boolean;
}

// Define budget item type
interface BudgetItem {
  category: string;
  budget: number;
  spent: number;
}

// Define the store state
interface StoreState {
  // Authentication
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  
  // Financial data
  transactions: Transaction[];
  budgets: BudgetItem[];
  
  // Energy data
  energyReadings: EnergyReading[];
  currentReading: number | null;
  
  // Stock data
  stockItems: StockItem[];
  
  // Actions
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // Transaction actions
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Budget actions
  setBudget: (category: string, amount: number) => void;
  updateSpent: (category: string, amount: number) => void;
  
  // Energy actions
  addEnergyReading: (reading: EnergyReading) => void;
  setCurrentReading: (reading: number) => void;
  
  // Stock actions
  addStockItem: (item: StockItem) => void;
  updateStockItem: (id: string, updates: Partial<StockItem>) => void;
  deleteStockItem: (id: string) => void;
  
  // Utility actions
  clearStore: () => void;
}

// Create the store with persistence
const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      userProfile: null,
      transactions: [],
      budgets: [],
      energyReadings: [],
      currentReading: null,
      stockItems: [],
      
      // Authentication actions
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      setUserProfile: (profile) => set({ userProfile: profile }),
      
      updateUserProfile: (updates) => set((state) => ({
        userProfile: state.userProfile ? { ...state.userProfile, ...updates } : null
      })),
      
      // Transaction actions
      addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions]
      })),
      
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map((transaction) => 
          transaction.id === id ? { ...transaction, ...updates } : transaction
        )
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((transaction) => transaction.id !== id)
      })),
      
      // Budget actions
      setBudget: (category, amount) => set((state) => {
        const existingBudgetIndex = state.budgets.findIndex(
          (budget) => budget.category === category
        );
        
        if (existingBudgetIndex >= 0) {
          // Update existing budget
          const updatedBudgets = [...state.budgets];
          updatedBudgets[existingBudgetIndex] = {
            ...updatedBudgets[existingBudgetIndex],
            budget: amount
          };
          return { budgets: updatedBudgets };
        } else {
          // Add new budget
          return {
            budgets: [...state.budgets, { category, budget: amount, spent: 0 }]
          };
        }
      }),
      
      updateSpent: (category, amount) => set((state) => {
        const existingBudgetIndex = state.budgets.findIndex(
          (budget) => budget.category === category
        );
        
        if (existingBudgetIndex >= 0) {
          // Update existing budget spent amount
          const updatedBudgets = [...state.budgets];
          updatedBudgets[existingBudgetIndex] = {
            ...updatedBudgets[existingBudgetIndex],
            spent: amount
          };
          return { budgets: updatedBudgets };
        }
        
        return state;
      }),
      
      // Energy actions
      addEnergyReading: (reading) => set((state) => ({
        energyReadings: [reading, ...state.energyReadings],
        currentReading: reading.reading
      })),
      
      setCurrentReading: (reading) => set({ currentReading: reading }),
      
      // Stock actions
      addStockItem: (item) => set((state) => ({
        stockItems: [...state.stockItems, item]
      })),
      
      updateStockItem: (id, updates) => set((state) => ({
        stockItems: state.stockItems.map((item) => 
          item.id === id ? { ...item, ...updates } : item
        )
      })),
      
      deleteStockItem: (id) => set((state) => ({
        stockItems: state.stockItems.filter((item) => item.id !== id)
      })),
      
      // Utility actions
      clearStore: () => set({
        isAuthenticated: false,
        userProfile: null,
        transactions: [],
        budgets: [],
        energyReadings: [],
        currentReading: null,
        stockItems: []
      })
    }),
    {
      name: 'householdhero-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default useStore;
