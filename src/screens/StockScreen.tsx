import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for household stock
const mockStockData = {
  categories: [
    { id: 'groceries', name: 'Groceries', icon: 'cart' },
    { id: 'household', name: 'Household', icon: 'home' },
    { id: 'toiletries', name: 'Toiletries', icon: 'water' },
    { id: 'medicine', name: 'Medicine', icon: 'medical' },
  ],
  items: [
    { id: '1', name: 'Milk', category: 'groceries', quantity: 1, unit: 'L', daysLeft: 1, lowStockAlert: true },
    { id: '2', name: 'Bread', category: 'groceries', quantity: 1, unit: 'loaf', daysLeft: 2, lowStockAlert: true },
    { id: '3', name: 'Eggs', category: 'groceries', quantity: 6, unit: 'eggs', daysLeft: 3, lowStockAlert: true },
    { id: '4', name: 'Rice', category: 'groceries', quantity: 2, unit: 'kg', daysLeft: 14, lowStockAlert: false },
    { id: '5', name: 'Toilet Paper', category: 'household', quantity: 4, unit: 'rolls', daysLeft: 7, lowStockAlert: false },
    { id: '6', name: 'Dish Soap', category: 'household', quantity: 1, unit: 'bottle', daysLeft: 10, lowStockAlert: false },
    { id: '7', name: 'Toothpaste', category: 'toiletries', quantity: 1, unit: 'tube', daysLeft: 5, lowStockAlert: false },
    { id: '8', name: 'Paracetamol', category: 'medicine', quantity: 10, unit: 'tablets', daysLeft: 30, lowStockAlert: false },
  ]
};

const StockScreen = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // New item form state
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'groceries',
    quantity: '',
    unit: '',
    daysLeft: '',
    lowStockAlert: false
  });

  // Filter items based on active category and search query
  const filteredItems = mockStockData.items.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle adding a new item
  const handleAddItem = () => {
    // Here we would normally add the item to the database
    // For now, we'll just close the modal
    setModalVisible(false);
    
    // Reset form
    setNewItem({
      name: '',
      category: 'groceries',
      quantity: '',
      unit: '',
      daysLeft: '',
      lowStockAlert: false
    });
  };

  // Handle editing an item
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setEditModalVisible(true);
  };

  // Handle updating an item
  const handleUpdateItem = () => {
    // Here we would normally update the item in the database
    // For now, we'll just close the modal
    setEditModalVisible(false);
    setSelectedItem(null);
  };

  // Render item card
  const renderItemCard = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <TouchableOpacity onPress={() => handleEditItem(item)}>
          <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.itemDetails}>
        <View style={styles.itemDetail}>
          <Text style={styles.itemDetailLabel}>Quantity:</Text>
          <Text style={styles.itemDetailValue}>{item.quantity} {item.unit}</Text>
        </View>
        
        <View style={styles.itemDetail}>
          <Text style={styles.itemDetailLabel}>Days Left:</Text>
          <Text style={[
            styles.itemDetailValue,
            item.daysLeft <= 2 ? styles.lowStock : 
            item.daysLeft <= 5 ? styles.mediumStock : 
            styles.goodStock
          ]}>
            {item.daysLeft}
          </Text>
        </View>
      </View>
      
      {item.lowStockAlert && (
        <View style={styles.alertBadge}>
          <Ionicons name="alert-circle" size={16} color="#FFFFFF" />
          <Text style={styles.alertText}>Low Stock</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stock Tracking</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity 
          style={[styles.categoryButton, activeCategory === 'all' && styles.activeCategoryButton]}
          onPress={() => setActiveCategory('all')}
        >
          <Ionicons 
            name="apps" 
            size={20} 
            color={activeCategory === 'all' ? '#FFFFFF' : '#4F46E5'} 
          />
          <Text 
            style={[
              styles.categoryButtonText, 
              activeCategory === 'all' && styles.activeCategoryButtonText
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {mockStockData.categories.map((category) => (
          <TouchableOpacity 
            key={category.id}
            style={[
              styles.categoryButton, 
              activeCategory === category.id && styles.activeCategoryButton
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Ionicons 
              name={category.icon} 
              size={20} 
              color={activeCategory === category.id ? '#FFFFFF' : '#4F46E5'} 
            />
            <Text 
              style={[
                styles.categoryButtonText, 
                activeCategory === category.id && styles.activeCategoryButtonText
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <FlatList
        data={filteredItems}
        renderItem={renderItemCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.itemsContainer}
        numColumns={2}
        columnWrapperStyle={styles.itemsRow}
      />
      
      {/* Add Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Item</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Item Name</Text>
              <TextInput
                style={styles.input}
                value={newItem.name}
                onChangeText={(value) => setNewItem({...newItem, name: value})}
                placeholder="Enter item name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
              >
                {mockStockData.categories.map((category) => (
                  <TouchableOpacity 
                    key={category.id}
                    style={[
                      styles.categoryOption, 
                      newItem.category === category.id && styles.selectedCategoryOption
                    ]}
                    onPress={() => setNewItem({...newItem, category: category.id})}
                  >
                    <Ionicons 
                      name={category.icon} 
                      size={20} 
                      color={newItem.category === category.id ? '#FFFFFF' : '#4F46E5'} 
                    />
                    <Text 
                      style={[
                        styles.categoryOptionText, 
                        newItem.category === category.id && styles.selectedCategoryOptionText
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={newItem.quantity}
                  onChangeText={(value) => setNewItem({...newItem, quantity: value})}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Unit</Text>
                <TextInput
                  style={styles.input}
                  value={newItem.unit}
                  onChangeText={(value) => setNewItem({...newItem, unit: value})}
                  placeholder="e.g., kg, L, pcs"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Days Left (Estimated)</Text>
              <TextInput
                style={styles.input}
                value={newItem.daysLeft}
                onChangeText={(value) => setNewItem({...newItem, daysLeft: value})}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGroup}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setNewItem({...newItem, lowStockAlert: !newItem.lowStockAlert})}
              >
                <View style={[
                  styles.checkbox,
                  newItem.lowStockAlert && styles.checkboxChecked
                ]}>
                  {newItem.lowStockAlert && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Set low stock alert</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleAddItem}
            >
              <Text style={styles.saveButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Edit Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible && selectedItem !== null}
        onRequestClose={() => {
          setEditModalVisible(false);
          setSelectedItem(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Item</Text>
              <TouchableOpacity onPress={() => {
                setEditModalVisible(false);
                setSelectedItem(null);
              }}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {selectedItem && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Item Name</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedItem.name}
                    onChangeText={(value) => setSelectedItem({...selectedItem, name: value})}
                  />
                </View>
                
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedItem.quantity.toString()}
                      onChangeText={(value) => setSelectedItem({...selectedItem, quantity: value})}
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>Unit</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedItem.unit}
                      onChangeText={(value) => setSelectedItem({...selectedItem, unit: value})}
                    />
                  </View>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Days Left (Estimated)</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedItem.daysLeft.toString()}
                    onChangeText={(value) => setSelectedItem({...selectedItem, daysLeft: value})}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => setSelectedItem({...selectedItem, lowStockAlert: !selectedItem.lowStockAlert})}
                  >
                    <View style={[
                      styles.checkbox,
                      selectedItem.lowStockAlert && styles.checkboxChecked
                    ]}>
                      {selectedItem.lowStockAlert && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>Set low stock alert</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.editButtonsContainer}>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => {
                      // Here we would normally delete the item from the database
                      setEditModalVisible(false);
                      setSelectedItem(null);
                    }}
                  >
                    <Ionicons name="trash" size={20} color="#FFFFFF" />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.updateButton}
                    onPress={handleUpdateItem}
                  >
                    <Text style={styles.updateButtonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  activeCategoryButton: {
    backgroundColor: '#4F46E5',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#4F46E5',
    marginLeft: 6,
  },
  activeCategoryButtonText: {
    color: '#FFFFFF',
  },
  itemsContainer: {
    padding: 10,
  },
  itemsRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  itemDetails: {
    marginBottom: 12,
  },
  itemDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemDetailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  itemDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  lowStock: {
    color: '#EF4444',
  },
  mediumStock: {
    color: '#F59E0B',
  },
  goodStock: {
    color: '#10B981',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  alertText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
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
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
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
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  selectedCategoryOption: {
    backgroundColor: '#4F46E5',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#4F46E5',
    marginLeft: 6,
  },
  selectedCategoryOptionText: {
    color: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#4B5563',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '48%',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  updateButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '48%',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StockScreen;
