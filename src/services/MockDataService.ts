import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { 
  UserProfile, 
  Transaction, 
  Budget, 
  EnergyReading, 
  StockItem 
} from '../types';

// Mock user data
const mockUser: User = {
  uid: 'mock-user-id',
  email: 'user@example.com',
  displayName: 'Maria',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({
    token: 'mock-token',
    signInProvider: 'password',
    expirationTime: '',
    issuedAtTime: '',
    claims: {}
  }),
  reload: async () => {},
  toJSON: () => ({})
};

// Mock user profile
const mockUserProfile: UserProfile = {
  uid: 'mock-user-id',
  name: 'Maria',
  householdSize: '3',
  province: 'Gauteng',
  incomeRange: 'R20,001 - R40,000',
  electricityProvider: 'city_power',
  tariff: 'Prepaid',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Mock transactions
const mockTransactions: Transaction[] = [
  { 
    id: '1', 
    userId: 'mock-user-id', 
    date: '2025-05-15', 
    category: 'Groceries', 
    amount: 450, 
    description: 'Checkers - Weekly groceries',
    createdAt: new Date().toISOString()
  },
  { 
    id: '2', 
    userId: 'mock-user-id', 
    date: '2025-05-14', 
    category: 'Transport', 
    amount: 200, 
    description: 'Uber - Work commute',
    createdAt: new Date().toISOString()
  },
  { 
    id: '3', 
    userId: 'mock-user-id', 
    date: '2025-05-12', 
    category: 'Utilities', 
    amount: 850, 
    description: 'Electricity - Prepaid tokens',
    createdAt: new Date().toISOString()
  },
  { 
    id: '4', 
    userId: 'mock-user-id', 
    date: '2025-05-10', 
    category: 'Dining', 
    amount: 320, 
    description: 'Steers - Family dinner',
    createdAt: new Date().toISOString()
  },
  { 
    id: '5', 
    userId: 'mock-user-id', 
    date: '2025-05-08', 
    category: 'Shopping', 
    amount: 750, 
    description: 'Woolworths - Clothing',
    createdAt: new Date().toISOString()
  },
  { 
    id: '6', 
    userId: 'mock-user-id', 
    date: '2025-05-05', 
    category: 'Housing', 
    amount: 3500, 
    description: 'Rent - May',
    createdAt: new Date().toISOString()
  },
  { 
    id: '7', 
    userId: 'mock-user-id', 
    date: '2025-05-03', 
    category: 'Entertainment', 
    amount: 180, 
    description: 'Netflix subscription',
    createdAt: new Date().toISOString()
  },
  { 
    id: '8', 
    userId: 'mock-user-id', 
    date: '2025-05-01', 
    category: 'Income', 
    amount: -12000, 
    description: 'Salary - May',
    createdAt: new Date().toISOString()
  },
];

// Mock budgets
const mockBudgets: Budget[] = [
  { 
    id: '1', 
    userId: 'mock-user-id', 
    category: 'Housing', 
    amount: 4000, 
    period: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '2', 
    userId: 'mock-user-id', 
    category: 'Groceries', 
    amount: 2500, 
    period: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '3', 
    userId: 'mock-user-id', 
    category: 'Transport', 
    amount: 1500, 
    period: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '4', 
    userId: 'mock-user-id', 
    category: 'Utilities', 
    amount: 1200, 
    period: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '5', 
    userId: 'mock-user-id', 
    category: 'Dining', 
    amount: 800, 
    period: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '6', 
    userId: 'mock-user-id', 
    category: 'Entertainment', 
    amount: 600, 
    period: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '7', 
    userId: 'mock-user-id', 
    category: 'Shopping', 
    amount: 1000, 
    period: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '8', 
    userId: 'mock-user-id', 
    category: 'Other', 
    amount: 400, 
    period: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

// Mock energy readings
const mockEnergyReadings: EnergyReading[] = [
  { 
    id: '1', 
    userId: 'mock-user-id', 
    date: '2025-05-10', 
    reading: 143, 
    purchaseAmount: 500,
    purchaseUnits: 250,
    createdAt: new Date().toISOString()
  },
  { 
    id: '2', 
    userId: 'mock-user-id', 
    date: '2025-04-15', 
    reading: 100, 
    purchaseAmount: 400,
    purchaseUnits: 200,
    createdAt: new Date().toISOString()
  },
  { 
    id: '3', 
    userId: 'mock-user-id', 
    date: '2025-04-01', 
    reading: 80, 
    purchaseAmount: 440,
    purchaseUnits: 220,
    createdAt: new Date().toISOString()
  },
  { 
    id: '4', 
    userId: 'mock-user-id', 
    date: '2025-03-15', 
    reading: 60, 
    purchaseAmount: 360,
    purchaseUnits: 180,
    createdAt: new Date().toISOString()
  },
  { 
    id: '5', 
    userId: 'mock-user-id', 
    date: '2025-03-01', 
    reading: 40, 
    purchaseAmount: 420,
    purchaseUnits: 210,
    createdAt: new Date().toISOString()
  },
];

// Mock stock items
const mockStockItems: StockItem[] = [
  { 
    id: '1', 
    userId: 'mock-user-id', 
    name: 'Milk', 
    category: 'groceries', 
    quantity: 1, 
    unit: 'L', 
    daysLeft: 1, 
    lowStockAlert: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '2', 
    userId: 'mock-user-id', 
    name: 'Bread', 
    category: 'groceries', 
    quantity: 1, 
    unit: 'loaf', 
    daysLeft: 2, 
    lowStockAlert: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '3', 
    userId: 'mock-user-id', 
    name: 'Eggs', 
    category: 'groceries', 
    quantity: 6, 
    unit: 'eggs', 
    daysLeft: 3, 
    lowStockAlert: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '4', 
    userId: 'mock-user-id', 
    name: 'Rice', 
    category: 'groceries', 
    quantity: 2, 
    unit: 'kg', 
    daysLeft: 14, 
    lowStockAlert: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '5', 
    userId: 'mock-user-id', 
    name: 'Toilet Paper', 
    category: 'household', 
    quantity: 4, 
    unit: 'rolls', 
    daysLeft: 7, 
    lowStockAlert: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '6', 
    userId: 'mock-user-id', 
    name: 'Dish Soap', 
    category: 'household', 
    quantity: 1, 
    unit: 'bottle', 
    daysLeft: 10, 
    lowStockAlert: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '7', 
    userId: 'mock-user-id', 
    name: 'Toothpaste', 
    category: 'toiletries', 
    quantity: 1, 
    unit: 'tube', 
    daysLeft: 5, 
    lowStockAlert: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: '8', 
    userId: 'mock-user-id', 
    name: 'Paracetamol', 
    category: 'medicine', 
    quantity: 10, 
    unit: 'tablets', 
    daysLeft: 30, 
    lowStockAlert: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

class MockDataService {
  // Auth methods
  async signUp(email: string, password: string, name: string): Promise<User> {
    console.log('Mock sign up:', { email, password, name });
    return mockUser;
  }

  async signIn(email: string, password: string): Promise<User> {
    console.log('Mock sign in:', { email, password });
    return mockUser;
  }

  async signOut(): Promise<void> {
    console.log('Mock sign out');
  }

  getCurrentUser(): User | null {
    return mockUser;
  }

  // User profile methods
  async createUserProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
    console.log('Mock create user profile:', profile);
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    console.log('Mock get user profile:', userId);
    return mockUserProfile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    console.log('Mock update user profile:', { userId, updates });
  }

  // Transaction methods
  async addTransaction(transaction: Omit<Transaction, 'createdAt'>): Promise<string> {
    console.log('Mock add transaction:', transaction);
    return 'new-transaction-id';
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    console.log('Mock get transactions:', userId);
    return mockTransactions;
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    console.log('Mock delete transaction:', transactionId);
  }

  // Budget methods
  async setBudget(budget: Omit<Budget, 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log('Mock set budget:', budget);
    return 'new-budget-id';
  }

  async getBudgets(userId: string, period: 'weekly' | 'monthly' | 'yearly'): Promise<Budget[]> {
    console.log('Mock get budgets:', { userId, period });
    return mockBudgets.filter(b => b.period === period);
  }

  // Energy reading methods
  async addEnergyReading(reading: Omit<EnergyReading, 'createdAt'>): Promise<string> {
    console.log('Mock add energy reading:', reading);
    return 'new-reading-id';
  }

  async getEnergyReadings(userId: string, limit?: number): Promise<EnergyReading[]> {
    console.log('Mock get energy readings:', { userId, limit });
    return limit ? mockEnergyReadings.slice(0, limit) : mockEnergyReadings;
  }

  // Stock item methods
  async addStockItem(item: Omit<StockItem, 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log('Mock add stock item:', item);
    return 'new-item-id';
  }

  async getStockItems(userId: string, category?: string): Promise<StockItem[]> {
    console.log('Mock get stock items:', { userId, category });
    if (category && category !== 'all') {
      return mockStockItems.filter(item => item.category === category);
    }
    return mockStockItems;
  }

  async updateStockItem(itemId: string, updates: Partial<StockItem>): Promise<void> {
    console.log('Mock update stock item:', { itemId, updates });
  }

  async deleteStockItem(itemId: string): Promise<void> {
    console.log('Mock delete stock item:', itemId);
  }

  // Helper methods
  timestampToDate(timestamp: any): Date {
    return new Date();
  }

  dateToTimestamp(date: Date): any {
    return { toDate: () => date };
  }
}

export default new MockDataService();
