import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData
} from 'firebase/firestore';

// Firebase configuration
// In a production environment, these values should be in environment variables
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// User profile interface
interface UserProfile {
  uid: string;
  name: string;
  householdSize: string;
  province: string;
  incomeRange: string;
  electricityProvider: string;
  tariff: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Transaction interface
interface Transaction {
  id?: string;
  userId: string;
  date: Timestamp;
  category: string;
  amount: number;
  description: string;
  createdAt: Timestamp;
}

// Energy Reading interface
interface EnergyReading {
  id?: string;
  userId: string;
  date: Timestamp;
  reading: number;
  purchaseAmount?: number;
  purchaseUnits?: number;
  createdAt: Timestamp;
}

// Stock Item interface
interface StockItem {
  id?: string;
  userId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  daysLeft: number;
  lowStockAlert: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Budget interface
interface Budget {
  id?: string;
  userId: string;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

class FirebaseService {
  // Auth methods
  async signUp(email: string, password: string, name: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // User profile methods
  async createUserProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const userRef = doc(db, 'users', profile.uid);
      const now = Timestamp.now();
      
      await setDoc(userRef, {
        ...profile,
        createdAt: now,
        updatedAt: now
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Transaction methods
  async addTransaction(transaction: Omit<Transaction, 'createdAt'>): Promise<string> {
    try {
      const transactionsRef = collection(db, 'transactions');
      const newTransactionRef = doc(transactionsRef);
      const now = Timestamp.now();
      
      await setDoc(newTransactionRef, {
        ...transaction,
        createdAt: now
      });
      
      return newTransactionRef.id;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const transactionsRef = collection(db, 'transactions');
      const q = query(
        transactionsRef,
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];
      
      querySnapshot.forEach((doc) => {
        transactions.push({
          id: doc.id,
          ...doc.data()
        } as Transaction);
      });
      
      return transactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      const transactionRef = doc(db, 'transactions', transactionId);
      await deleteDoc(transactionRef);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // Budget methods
  async setBudget(budget: Omit<Budget, 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Check if budget for this category already exists
      const budgetsRef = collection(db, 'budgets');
      const q = query(
        budgetsRef,
        where('userId', '==', budget.userId),
        where('category', '==', budget.category),
        where('period', '==', budget.period)
      );
      
      const querySnapshot = await getDocs(q);
      const now = Timestamp.now();
      
      if (!querySnapshot.empty) {
        // Update existing budget
        const existingBudget = querySnapshot.docs[0];
        await updateDoc(existingBudget.ref, {
          amount: budget.amount,
          updatedAt: now
        });
        return existingBudget.id;
      } else {
        // Create new budget
        const newBudgetRef = doc(budgetsRef);
        await setDoc(newBudgetRef, {
          ...budget,
          createdAt: now,
          updatedAt: now
        });
        return newBudgetRef.id;
      }
    } catch (error) {
      console.error('Error setting budget:', error);
      throw error;
    }
  }

  async getBudgets(userId: string, period: 'weekly' | 'monthly' | 'yearly'): Promise<Budget[]> {
    try {
      const budgetsRef = collection(db, 'budgets');
      const q = query(
        budgetsRef,
        where('userId', '==', userId),
        where('period', '==', period)
      );
      
      const querySnapshot = await getDocs(q);
      const budgets: Budget[] = [];
      
      querySnapshot.forEach((doc) => {
        budgets.push({
          id: doc.id,
          ...doc.data()
        } as Budget);
      });
      
      return budgets;
    } catch (error) {
      console.error('Error getting budgets:', error);
      throw error;
    }
  }

  // Energy reading methods
  async addEnergyReading(reading: Omit<EnergyReading, 'createdAt'>): Promise<string> {
    try {
      const readingsRef = collection(db, 'energyReadings');
      const newReadingRef = doc(readingsRef);
      const now = Timestamp.now();
      
      await setDoc(newReadingRef, {
        ...reading,
        createdAt: now
      });
      
      return newReadingRef.id;
    } catch (error) {
      console.error('Error adding energy reading:', error);
      throw error;
    }
  }

  async getEnergyReadings(userId: string, limit?: number): Promise<EnergyReading[]> {
    try {
      const readingsRef = collection(db, 'energyReadings');
      let q = query(
        readingsRef,
        where('userId', '==', userId),
        orderBy('date', 'desc')
      );
      
      if (limit) {
        q = query(q, limit(limit));
      }
      
      const querySnapshot = await getDocs(q);
      const readings: EnergyReading[] = [];
      
      querySnapshot.forEach((doc) => {
        readings.push({
          id: doc.id,
          ...doc.data()
        } as EnergyReading);
      });
      
      return readings;
    } catch (error) {
      console.error('Error getting energy readings:', error);
      throw error;
    }
  }

  // Stock item methods
  async addStockItem(item: Omit<StockItem, 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const stockRef = collection(db, 'stock');
      const newItemRef = doc(stockRef);
      const now = Timestamp.now();
      
      await setDoc(newItemRef, {
        ...item,
        createdAt: now,
        updatedAt: now
      });
      
      return newItemRef.id;
    } catch (error) {
      console.error('Error adding stock item:', error);
      throw error;
    }
  }

  async getStockItems(userId: string, category?: string): Promise<StockItem[]> {
    try {
      const stockRef = collection(db, 'stock');
      let q;
      
      if (category && category !== 'all') {
        q = query(
          stockRef,
          where('userId', '==', userId),
          where('category', '==', category)
        );
      } else {
        q = query(
          stockRef,
          where('userId', '==', userId)
        );
      }
      
      const querySnapshot = await getDocs(q);
      const items: StockItem[] = [];
      
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        } as StockItem);
      });
      
      return items;
    } catch (error) {
      console.error('Error getting stock items:', error);
      throw error;
    }
  }

  async updateStockItem(itemId: string, updates: Partial<StockItem>): Promise<void> {
    try {
      const itemRef = doc(db, 'stock', itemId);
      
      await updateDoc(itemRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating stock item:', error);
      throw error;
    }
  }

  async deleteStockItem(itemId: string): Promise<void> {
    try {
      const itemRef = doc(db, 'stock', itemId);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error('Error deleting stock item:', error);
      throw error;
    }
  }

  // Helper methods
  timestampToDate(timestamp: Timestamp): Date {
    return timestamp.toDate();
  }

  dateToTimestamp(date: Date): Timestamp {
    return Timestamp.fromDate(date);
  }
}

export default new FirebaseService();
