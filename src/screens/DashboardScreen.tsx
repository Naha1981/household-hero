import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Image,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '../components/BackButton';

// Mock data for the dashboard
const mockData = {
  financialSummary: {
    budget: 12000,
    spent: 7850,
    remaining: 4150,
    categories: [
      { name: 'Housing', amount: 3500, color: '#4F46E5' },
      { name: 'Food', amount: 2200, color: '#10B981' },
      { name: 'Transport', amount: 1200, color: '#F59E0B' },
      { name: 'Utilities', amount: 950, color: '#EF4444' },
    ]
  },
  energyUsage: {
    unitsRemaining: 143,
    dailyAverage: 8.5,
    estimatedDaysLeft: 17,
    lastReading: '2025-05-10'
  },
  stockAlerts: [
    { item: 'Milk', daysLeft: 1 },
    { item: 'Bread', daysLeft: 2 },
    { item: 'Eggs', daysLeft: 3 },
  ],
  tips: [
    "Switch off your geyser during load shedding to save up to 40% on electricity.",
    "Checkers has a special on rice this week - 20% off 2kg bags.",
    "Consider using a prepaid electricity meter to better track your usage."
  ]
};

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate budget percentage
  const budgetPercentage = 65.4; // 7850/12000 * 100

  // Quick action handlers
  const handleLogExpense = () => {
    // @ts-ignore
    navigation.navigate('Financial');
  };

  const handleMeterReading = () => {
    // @ts-ignore
    navigation.navigate('Energy');
  };

  const handleCompareGroceries = () => {
    // @ts-ignore
    navigation.navigate('Kitchen');
  };

  // Render the overview tab content
  const renderOverview = () => {
    const { financialSummary, energyUsage, stockAlerts, tips } = mockData;
    
    return (
      <View style={styles.tabContent}>
        {/* Financial Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Financial Summary</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Financial')}>
              <Text style={styles.cardAction}>View Details</Text>
            </TouchableOpacity>
          </View>
        
          <View style={styles.budgetContainer}>
            <View style={styles.budgetContainer}>
              <Text style={styles.budgetLabel}>Monthly Budget</Text>
              <Text style={styles.budgetAmount}>R12 000</Text>
            </View>
            <View style={styles.budgetProgressContainer}>
              <View style={styles.budgetProgressBackground}>
                <View 
                  style={[
                    styles.budgetProgressFill, 
                    { width: `${budgetPercentage}%` },
                    budgetPercentage > 80 ? styles.budgetCritical : 
                    budgetPercentage > 60 ? styles.budgetWarning : 
                    styles.budgetGood
                  ]} 
                />
              </View>
              <View style={styles.budgetDetails}>
                <Text style={styles.budgetSpent}>
                  Spent: R7 850
                </Text>
                <Text style={styles.budgetRemaining}>
                  Remaining: R4 150
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Energy Usage */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Energy Usage</Text>
            <TouchableOpacity onPress={handleMeterReading}>
              <Text style={styles.cardAction}>Add Reading</Text>
            </TouchableOpacity>
          </View>
        
          <View style={styles.energyContainer}>
            <View style={styles.energyMetric}>
              <Ionicons name="flash" size={24} color="#F59E0B" />
              <View style={styles.energyMetricText}>
                <Text style={styles.energyMetricValue}>{mockData.energyUsage.unitsRemaining}</Text>
                <Text style={styles.energyMetricLabel}>Units Left</Text>
              </View>
            </View>
            
            <View style={styles.energyMetric}>
              <Ionicons name="calendar" size={24} color="#4F46E5" />
              <View style={styles.energyMetricText}>
                <Text style={styles.energyMetricValue}>{mockData.energyUsage.estimatedDaysLeft}</Text>
                <Text style={styles.energyMetricLabel}>Days Left</Text>
              </View>
            </View>
            
            <View style={styles.energyMetric}>
              <Ionicons name="trending-down" size={24} color="#10B981" />
              <View style={styles.energyMetricText}>
                <Text style={styles.energyMetricValue}>{mockData.energyUsage.dailyAverage}</Text>
                <Text style={styles.energyMetricLabel}>Daily Avg</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Stock Alerts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Low Stock Alerts</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Stock')}>
              <Text style={styles.cardAction}>View All</Text>
            </TouchableOpacity>
          </View>
        
          <View style={styles.stockContainer}>
            {mockData.stockAlerts.map((item, index) => (
              <View key={index} style={styles.stockItem}>
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text style={styles.stockItemText}>{item.item} - {item.daysLeft} {item.daysLeft === 1 ? 'day' : 'days'} left</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* AI Tips */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>AI Tips</Text>
            <TouchableOpacity onPress={handleCompareGroceries}>
              <Text style={styles.cardAction}>Get More Tips</Text>
            </TouchableOpacity>
          </View>
        
          <View style={styles.tipsContainer}>
            {mockData.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Ionicons name="bulb-outline" size={20} color="#4F46E5" />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Render quick actions tab content
  const renderQuickActions = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Financial')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#EDE9FE' }]}>
            <Ionicons name="wallet-outline" size={28} color="#8B5CF6" />
          </View>
          <Text style={styles.quickActionText}>Log Expense</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Stock')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="list-outline" size={28} color="#F59E0B" />
          </View>
          <Text style={styles.quickActionText}>Update Stock</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Energy')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="flash-outline" size={28} color="#10B981" />
          </View>
          <Text style={styles.quickActionText}>Add Meter Reading</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={handleCompareGroceries}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#F3E8FF' }]}>
            <Ionicons name="cart-outline" size={28} color="#8B5CF6" />
          </View>
          <Text style={styles.quickActionText}>Compare Grocery Prices</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Kitchen')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#FFE4E6' }]}>
            <Ionicons name="restaurant-outline" size={28} color="#F43F5E" />
          </View>
          <Text style={styles.quickActionText}>Generate Recipe</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate('Wellness')}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: '#E0F2FE' }]}>
            <Ionicons name="fitness-outline" size={28} color="#0EA5E9" />
          </View>
          <Text style={styles.quickActionText}>Wellness Tips</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <BackButton />
      </View>
      
      <View style={styles.userGreeting}>
        <Text style={styles.greetingText}>Good afternoon,</Text>
        <Text style={styles.userName}>Maria</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]} 
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'actions' && styles.activeTab]} 
          onPress={() => setActiveTab('actions')}
        >
          <Text style={[styles.tabText, activeTab === 'actions' && styles.activeTabText]}>Quick Actions</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' ? renderOverview() : renderQuickActions()}
      </ScrollView>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Built By: NahaGrowthPartners</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 40 : 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  userGreeting: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greetingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#6366F1',
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardAction: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  budgetContainer: {
    marginBottom: 8,
  },
  budgetTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  budgetProgressContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  budgetProgressBackground: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  budgetProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  budgetGood: {
    backgroundColor: '#F59E0B',
  },
  budgetWarning: {
    backgroundColor: '#F59E0B',
  },
  budgetCritical: {
    backgroundColor: '#F59E0B',
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  budgetSpent: {
    fontSize: 14,
  },
  budgetRemaining: {
    fontSize: 14,
  },
  energyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  energyMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  energyMetricText: {
    marginLeft: 8,
  },
  energyMetricValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  energyMetricLabel: {
    fontSize: 12,
  },
  stockContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockItemText: {
    marginLeft: 12,
    fontSize: 14,
  },
  tipsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    textAlign: 'center',
  },
  footer: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
});

export default DashboardScreen;
