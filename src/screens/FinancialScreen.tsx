import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../components/BackButton';

// Mock transaction data
const mockTransactions = [
  { id: '1', date: '2025-05-15', category: 'Groceries', amount: 450, description: 'Checkers - Weekly groceries' },
  { id: '2', date: '2025-05-14', category: 'Transport', amount: 200, description: 'Uber - Work commute' },
  { id: '3', date: '2025-05-12', category: 'Utilities', amount: 850, description: 'Electricity - Prepaid tokens' },
  { id: '4', date: '2025-05-10', category: 'Dining', amount: 320, description: 'Steers - Family dinner' },
  { id: '5', date: '2025-05-08', category: 'Shopping', amount: 750, description: 'Woolworths - Clothing' },
  { id: '6', date: '2025-05-05', category: 'Housing', amount: 3500, description: 'Rent - May' },
  { id: '7', date: '2025-05-03', category: 'Entertainment', amount: 180, description: 'Netflix subscription' },
  { id: '8', date: '2025-05-01', category: 'Income', amount: -12000, description: 'Salary - May' },
];

// Expense categories with icons
const categories = [
  { id: 'housing', name: 'Housing', icon: 'home', color: '#4F46E5' },
  { id: 'groceries', name: 'Groceries', icon: 'cart', color: '#10B981' },
  { id: 'transport', name: 'Transport', icon: 'car', color: '#F59E0B' },
  { id: 'utilities', name: 'Utilities', icon: 'flash', color: '#EF4444' },
  { id: 'dining', name: 'Dining', icon: 'restaurant', color: '#EC4899' },
  { id: 'entertainment', name: 'Entertainment', icon: 'film', color: '#8B5CF6' },
  { id: 'shopping', name: 'Shopping', icon: 'bag', color: '#3B82F6' },
  { id: 'health', name: 'Health', icon: 'medical', color: '#06B6D4' },
  { id: 'education', name: 'Education', icon: 'school', color: '#14B8A6' },
  { id: 'income', name: 'Income', icon: 'cash', color: '#22C55E' },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal', color: '#6B7280' },
];

// Budget data
const budgetData = [
  { category: 'Housing', budget: 4000, spent: 3500, color: '#4F46E5' },
  { category: 'Groceries', budget: 2500, spent: 1850, color: '#10B981' },
  { category: 'Transport', budget: 1500, spent: 1200, color: '#F59E0B' },
  { category: 'Utilities', budget: 1200, spent: 950, color: '#EF4444' },
  { category: 'Dining', budget: 800, spent: 620, color: '#EC4899' },
  { category: 'Entertainment', budget: 600, spent: 380, color: '#8B5CF6' },
  { category: 'Shopping', budget: 1000, spent: 750, color: '#3B82F6' },
  { category: 'Other', budget: 400, spent: 200, color: '#6B7280' },
];

const FinancialScreen = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Calculate total income, expenses and balance
  const financialSummary = mockTransactions.reduce(
    (summary, transaction) => {
      if (transaction.amount < 0) {
        summary.income += Math.abs(transaction.amount);
      } else {
        summary.expenses += transaction.amount;
      }
      summary.balance = summary.income - summary.expenses;
      return summary;
    },
    { income: 0, expenses: 0, balance: 0 }
  );

  // Handle adding a new transaction
  const handleAddTransaction = () => {
    // Here we would normally add the transaction to the database
    // For now, we'll just close the modal
    setModalVisible(false);
    
    // Reset form
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setTransactionType('expense');
  };

  // Render the transactions tab
  const renderTransactions = () => (
    <View style={styles.tabContent}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.summaryAmount}>R{financialSummary.income.toLocaleString()}</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={styles.summaryAmount}>R{financialSummary.expenses.toLocaleString()}</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Balance</Text>
          <Text style={[
            styles.summaryAmount,
            { color: financialSummary.balance >= 0 ? '#10B981' : '#EF4444' }
          ]}>
            R{financialSummary.balance.toLocaleString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        
        {mockTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <View style={[
                styles.categoryIcon,
                { backgroundColor: getCategoryColor(transaction.category) }
              ]}>
                <Ionicons 
                  name={getCategoryIcon(transaction.category)} 
                  size={16} 
                  color="#FFFFFF" 
                />
              </View>
              <View>
                <Text style={styles.transactionCategory}>{transaction.category}</Text>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
              </View>
            </View>
            <Text style={[
              styles.transactionAmount,
              { color: transaction.amount < 0 ? '#10B981' : '#EF4444' }
            ]}>
              {transaction.amount < 0 ? '+' : '-'}R{Math.abs(transaction.amount).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  // Render the budget tab
  const renderBudget = () => (
    <View style={styles.tabContent}>
      <View style={styles.budgetSummaryContainer}>
        <Text style={styles.sectionTitle}>Monthly Budget</Text>
        <View style={styles.budgetSummaryCard}>
          <View style={styles.budgetSummaryItem}>
            <Text style={styles.budgetSummaryLabel}>Total Budget</Text>
            <Text style={styles.budgetSummaryAmount}>
              R{budgetData.reduce((sum, item) => sum + item.budget, 0).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.budgetSummaryItem}>
            <Text style={styles.budgetSummaryLabel}>Total Spent</Text>
            <Text style={styles.budgetSummaryAmount}>
              R{budgetData.reduce((sum, item) => sum + item.spent, 0).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.budgetSummaryItem}>
            <Text style={styles.budgetSummaryLabel}>Remaining</Text>
            <Text style={[styles.budgetSummaryAmount, { color: '#10B981' }]}>
              R{budgetData.reduce((sum, item) => sum + (item.budget - item.spent), 0).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.categoryBudgetsContainer}>
        <Text style={styles.sectionTitle}>Category Budgets</Text>
        
        {budgetData.map((item, index) => {
          const percentage = (item.spent / item.budget) * 100;
          return (
            <View key={index} style={styles.categoryBudgetItem}>
              <View style={styles.categoryBudgetHeader}>
                <View style={styles.categoryNameContainer}>
                  <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                  <Text style={styles.categoryName}>{item.category}</Text>
                </View>
                <Text style={styles.categoryBudgetText}>
                  R{item.spent.toLocaleString()} / R{item.budget.toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.budgetProgressBackground}>
                <View 
                  style={[
                    styles.budgetProgressFill, 
                    { width: `${percentage}%`, backgroundColor: item.color },
                    percentage > 90 ? styles.budgetOverspent : {}
                  ]} 
                />
              </View>
            </View>
          );
        })}
      </View>
      
      <TouchableOpacity style={styles.editBudgetButton}>
        <Text style={styles.editBudgetButtonText}>Edit Budget</Text>
      </TouchableOpacity>
    </View>
  );

  // Render the reports tab
  const renderReports = () => (
    <View style={styles.tabContent}>
      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>Spending by Category</Text>
        <Text style={styles.reportDescription}>
          View your spending breakdown by category for the current month
        </Text>
        <View style={styles.pieChartPlaceholder}>
          <Text style={styles.placeholderText}>Pie Chart</Text>
          <Text style={styles.placeholderSubtext}>
            (Chart visualization would be implemented with Chart.js)
          </Text>
        </View>
      </View>
      
      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>Monthly Spending Trend</Text>
        <Text style={styles.reportDescription}>
          Track your spending patterns over the past 6 months
        </Text>
        <View style={styles.lineChartPlaceholder}>
          <Text style={styles.placeholderText}>Line Chart</Text>
          <Text style={styles.placeholderSubtext}>
            (Chart visualization would be implemented with Chart.js)
          </Text>
        </View>
      </View>
      
      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>AI Financial Insights</Text>
        <View style={styles.insightItem}>
          <Ionicons name="trending-up" size={20} color="#EF4444" />
          <Text style={styles.insightText}>
            Your grocery spending is 15% higher than last month. Consider comparing prices across different retailers.
          </Text>
        </View>
        
        <View style={styles.insightItem}>
          <Ionicons name="trending-down" size={20} color="#10B981" />
          <Text style={styles.insightText}>
            You've reduced your transport costs by 10% this month. Great job!
          </Text>
        </View>
        
        <View style={styles.insightItem}>
          <Ionicons name="alert-circle" size={20} color="#F59E0B" />
          <Text style={styles.insightText}>
            You're on track to exceed your dining budget by R200 this month.
          </Text>
        </View>
      </View>
    </View>
  );

  // Helper function to get category color
  const getCategoryColor = (categoryName) => {
    const category = categories.find(
      cat => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.color : '#6B7280';
  };

  // Helper function to get category icon
  const getCategoryIcon = (categoryName) => {
    const category = categories.find(
      cat => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.icon : 'ellipsis-horizontal';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Management</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
            <Text style={styles.backLink}>← Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
            Transactions
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'budget' && styles.activeTab]}
          onPress={() => setActiveTab('budget')}
        >
          <Text style={[styles.tabText, activeTab === 'budget' && styles.activeTabText]}>
            Budget
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}
        >
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
            Reports
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'budget' && renderBudget()}
        {activeTab === 'reports' && renderReports()}
      </ScrollView>
      
      {/* Add Transaction Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Transaction</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.transactionTypeContainer}>
              <TouchableOpacity 
                style={[
                  styles.transactionTypeButton, 
                  transactionType === 'expense' && styles.activeTransactionType
                ]}
                onPress={() => setTransactionType('expense')}
              >
                <Text style={[
                  styles.transactionTypeText,
                  transactionType === 'expense' && styles.activeTransactionTypeText
                ]}>
                  Expense
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.transactionTypeButton, 
                  transactionType === 'income' && styles.activeTransactionType
                ]}
                onPress={() => setTransactionType('income')}
              >
                <Text style={[
                  styles.transactionTypeText,
                  transactionType === 'income' && styles.activeTransactionTypeText
                ]}>
                  Income
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Amount (R)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="What was this for?"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
              >
                {categories
                  .filter(cat => transactionType === 'income' ? cat.id === 'income' : cat.id !== 'income')
                  .map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        selectedCategory === category.id && { borderColor: category.color }
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <View style={[styles.categoryIconButton, { backgroundColor: category.color }]}>
                        <Ionicons name={category.icon} size={20} color="#FFFFFF" />
                      </View>
                      <Text style={styles.categoryButtonText}>{category.name}</Text>
                    </TouchableOpacity>
                  ))
                }
              </ScrollView>
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleAddTransaction}
            >
              <Text style={styles.saveButtonText}>Save Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitleContainer: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backLink: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 15,
  },
  addButton: {
    backgroundColor: '#4F46E5',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingVertical: 15,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  transactionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  transactionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  budgetSummaryContainer: {
    marginBottom: 20,
  },
  budgetSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  budgetSummaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  budgetSummaryLabel: {
    fontSize: 16,
    color: '#4B5563',
  },
  budgetSummaryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  categoryBudgetsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryBudgetItem: {
    marginBottom: 16,
  },
  categoryBudgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#4B5563',
  },
  categoryBudgetText: {
    fontSize: 14,
    color: '#6B7280',
  },
  budgetProgressBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  budgetProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetOverspent: {
    backgroundColor: '#EF4444',
  },
  editBudgetButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  editBudgetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  pieChartPlaceholder: {
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineChartPlaceholder: {
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 12,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  transactionTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  transactionTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  activeTransactionType: {
    borderBottomColor: '#4F46E5',
  },
  transactionTypeText: {
    fontSize: 16,
    color: '#6B7280',
  },
  activeTransactionTypeText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 8,
    padding: 8,
  },
  categoryIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#4B5563',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FinancialScreen;
