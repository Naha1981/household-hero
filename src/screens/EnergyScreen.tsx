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

// Mock data for energy usage
const mockEnergyData = {
  currentReading: 143,
  lastPurchase: {
    date: '2025-05-01',
    amount: 500,
    units: 250
  },
  history: [
    { date: '2025-05-01', units: 250, cost: 500 },
    { date: '2025-04-15', units: 200, cost: 400 },
    { date: '2025-04-01', units: 220, cost: 440 },
    { date: '2025-03-15', units: 180, cost: 360 },
    { date: '2025-03-01', units: 210, cost: 420 },
  ],
  dailyUsage: 8.5,
  estimatedDaysLeft: 17,
  appliances: [
    { name: 'Geyser', dailyUsage: 3.2, monthlyCost: 192, percentage: 38 },
    { name: 'Refrigerator', dailyUsage: 1.5, monthlyCost: 90, percentage: 18 },
    { name: 'Lights', dailyUsage: 1.0, monthlyCost: 60, percentage: 12 },
    { name: 'TV & Electronics', dailyUsage: 0.8, monthlyCost: 48, percentage: 9 },
    { name: 'Stove/Oven', dailyUsage: 1.2, monthlyCost: 72, percentage: 14 },
    { name: 'Other', dailyUsage: 0.8, monthlyCost: 48, percentage: 9 },
  ],
  tips: [
    "Switch off your geyser during load shedding to save up to 40% on electricity.",
    "Use energy-efficient LED bulbs to reduce lighting costs by up to 80%.",
    "Set your refrigerator temperature to 3-4°C for optimal efficiency.",
    "Unplug electronics when not in use to eliminate phantom power usage."
  ]
};

const EnergyScreen = () => {
  const [activeTab, setActiveTab] = useState('usage');
  const [modalVisible, setModalVisible] = useState(false);
  const [newReading, setNewReading] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [purchaseUnits, setPurchaseUnits] = useState('');
  
  // Handle adding a new meter reading
  const handleAddReading = () => {
    // Here we would normally update the database
    // For now, we'll just close the modal
    setModalVisible(false);
    
    // Reset form
    setNewReading('');
    setPurchaseAmount('');
    setPurchaseUnits('');
  };

  // Render the usage tab
  const renderUsage = () => (
    <View style={styles.tabContent}>
      <View style={styles.currentReadingCard}>
        <View style={styles.readingHeader}>
          <Text style={styles.sectionTitle}>Current Status</Text>
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.readingContainer}>
          <View style={styles.readingCircle}>
            <Text style={styles.readingValue}>{mockEnergyData.currentReading}</Text>
            <Text style={styles.readingLabel}>Units Left</Text>
          </View>
          
          <View style={styles.readingDetails}>
            <View style={styles.readingDetailItem}>
              <Ionicons name="time-outline" size={20} color="#4F46E5" />
              <Text style={styles.readingDetailText}>
                {mockEnergyData.estimatedDaysLeft} days remaining
              </Text>
            </View>
            
            <View style={styles.readingDetailItem}>
              <Ionicons name="flash-outline" size={20} color="#F59E0B" />
              <Text style={styles.readingDetailText}>
                {mockEnergyData.dailyUsage} units/day average
              </Text>
            </View>
            
            <View style={styles.readingDetailItem}>
              <Ionicons name="calendar-outline" size={20} color="#10B981" />
              <Text style={styles.readingDetailText}>
                Last purchase: {formatDate(mockEnergyData.lastPurchase.date)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.appliancesCard}>
        <Text style={styles.sectionTitle}>Estimated Usage by Appliance</Text>
        <Text style={styles.sectionSubtitle}>
          Based on typical South African household patterns
        </Text>
        
        {mockEnergyData.appliances.map((appliance, index) => (
          <View key={index} style={styles.applianceItem}>
            <View style={styles.applianceHeader}>
              <Text style={styles.applianceName}>{appliance.name}</Text>
              <Text style={styles.appliancePercentage}>{appliance.percentage}%</Text>
            </View>
            
            <View style={styles.applianceProgressBackground}>
              <View 
                style={[
                  styles.applianceProgressFill, 
                  { width: `${appliance.percentage}%` },
                  getApplianceColor(appliance.name)
                ]} 
              />
            </View>
            
            <View style={styles.applianceDetails}>
              <Text style={styles.applianceDetailText}>
                {appliance.dailyUsage} units/day
              </Text>
              <Text style={styles.applianceDetailText}>
                ~R{appliance.monthlyCost}/month
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // Render the history tab
  const renderHistory = () => (
    <View style={styles.tabContent}>
      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Purchase History</Text>
        
        {mockEnergyData.history.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.historyLeft}>
              <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
              <Text style={styles.historyUnits}>{item.units} units</Text>
            </View>
            <Text style={styles.historyCost}>R{item.cost}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.usageGraphCard}>
        <Text style={styles.sectionTitle}>Monthly Usage Trend</Text>
        <View style={styles.graphPlaceholder}>
          <Text style={styles.placeholderText}>Bar Chart</Text>
          <Text style={styles.placeholderSubtext}>
            (Chart visualization would be implemented with Chart.js)
          </Text>
        </View>
      </View>
    </View>
  );

  // Render the tips tab
  const renderTips = () => (
    <View style={styles.tabContent}>
      <View style={styles.tipsCard}>
        <Text style={styles.sectionTitle}>Energy Saving Tips</Text>
        <Text style={styles.sectionSubtitle}>
          Personalized for South African households
        </Text>
        
        {mockEnergyData.tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <View style={styles.tipIconContainer}>
              <Ionicons name="bulb-outline" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.loadshedding}>
        <Text style={styles.sectionTitle}>Loadshedding Preparation</Text>
        
        <View style={styles.loadsheddingItem}>
          <Ionicons name="time-outline" size={24} color="#4F46E5" />
          <View style={styles.loadsheddingContent}>
            <Text style={styles.loadsheddingTitle}>Check the Schedule</Text>
            <Text style={styles.loadsheddingText}>
              Stay updated with the latest loadshedding schedule for your area.
            </Text>
          </View>
        </View>
        
        <View style={styles.loadsheddingItem}>
          <Ionicons name="battery-charging-outline" size={24} color="#10B981" />
          <View style={styles.loadsheddingContent}>
            <Text style={styles.loadsheddingTitle}>Backup Power</Text>
            <Text style={styles.loadsheddingText}>
              Invest in a UPS or power bank for essential electronics.
            </Text>
          </View>
        </View>
        
        <View style={styles.loadsheddingItem}>
          <Ionicons name="flash-off-outline" size={24} color="#F59E0B" />
          <View style={styles.loadsheddingContent}>
            <Text style={styles.loadsheddingTitle}>Unplug Appliances</Text>
            <Text style={styles.loadsheddingText}>
              Disconnect sensitive electronics during outages to prevent surge damage.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Helper function to get appliance color
  const getApplianceColor = (applianceName) => {
    switch(applianceName) {
      case 'Geyser':
        return { backgroundColor: '#EF4444' };
      case 'Refrigerator':
        return { backgroundColor: '#3B82F6' };
      case 'Lights':
        return { backgroundColor: '#F59E0B' };
      case 'TV & Electronics':
        return { backgroundColor: '#8B5CF6' };
      case 'Stove/Oven':
        return { backgroundColor: '#EC4899' };
      default:
        return { backgroundColor: '#6B7280' };
    }
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
        <Text style={styles.headerTitle}>Energy Insights</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'usage' && styles.activeTab]}
          onPress={() => setActiveTab('usage')}
        >
          <Text style={[styles.tabText, activeTab === 'usage' && styles.activeTabText]}>
            Usage
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'tips' && styles.activeTab]}
          onPress={() => setActiveTab('tips')}
        >
          <Text style={[styles.tabText, activeTab === 'tips' && styles.activeTabText]}>
            Tips
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'usage' && renderUsage()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'tips' && renderTips()}
      </ScrollView>
      
      {/* Add Meter Reading Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Electricity</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Current Meter Reading</Text>
              <TextInput
                style={styles.input}
                value={newReading}
                onChangeText={setNewReading}
                placeholder="Enter current units remaining"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>New Purchase (Optional)</Text>
              <View style={styles.purchaseInputs}>
                <View style={styles.purchaseInputContainer}>
                  <Text style={styles.purchaseLabel}>Amount (R)</Text>
                  <TextInput
                    style={styles.purchaseInput}
                    value={purchaseAmount}
                    onChangeText={setPurchaseAmount}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.purchaseInputContainer}>
                  <Text style={styles.purchaseLabel}>Units</Text>
                  <TextInput
                    style={styles.purchaseInput}
                    value={purchaseUnits}
                    onChangeText={setPurchaseUnits}
                    placeholder="0"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleAddReading}
            >
              <Text style={styles.saveButtonText}>Save Reading</Text>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
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
  currentReadingCard: {
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
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  readingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  readingValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  readingLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  readingDetails: {
    flex: 1,
  },
  readingDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  readingDetailText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  appliancesCard: {
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
  applianceItem: {
    marginBottom: 16,
  },
  applianceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  applianceName: {
    fontSize: 14,
    color: '#4B5563',
  },
  appliancePercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  applianceProgressBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  applianceProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  applianceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  applianceDetailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  historyCard: {
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
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  historyLeft: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  historyUnits: {
    fontSize: 12,
    color: '#6B7280',
  },
  historyCost: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  usageGraphCard: {
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
  graphPlaceholder: {
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
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
  tipsCard: {
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
  tipItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
  },
  loadshedding: {
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
  loadsheddingItem: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
  },
  loadsheddingContent: {
    flex: 1,
    marginLeft: 12,
  },
  loadsheddingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  loadsheddingText: {
    fontSize: 14,
    color: '#4B5563',
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
  purchaseInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  purchaseInputContainer: {
    width: '48%',
  },
  purchaseLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  purchaseInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
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

export default EnergyScreen;
