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
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for recipes
const mockRecipes = [
  {
    id: '1',
    name: 'Bobotie (South African Meatloaf)',
    ingredients: ['500g ground beef', '2 onions', '2 slices bread', '250ml milk', '2 eggs', 'curry powder', 'turmeric', 'bay leaves'],
    prepTime: '15 min',
    cookTime: '45 min',
    image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    source: 'Traditional South African Recipe'
  },
  {
    id: '2',
    name: 'Chakalaka (Spicy Vegetable Relish)',
    ingredients: ['2 carrots', '1 bell pepper', '1 onion', '2 tomatoes', 'baked beans', 'curry powder', 'garlic', 'chili'],
    prepTime: '10 min',
    cookTime: '20 min',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    source: 'South African Home Cooking'
  },
  {
    id: '3',
    name: 'Pap en Wors (Maize Porridge with Sausage)',
    ingredients: ['2 cups maize meal', '4 cups water', 'salt', '500g boerewors', '1 onion', 'tomato and onion mix'],
    prepTime: '5 min',
    cookTime: '30 min',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    source: 'Traditional South African Recipe'
  }
];

// Mock data for grocery price comparison
const mockGroceryComparison = [
  {
    item: 'Rice (2kg)',
    prices: [
      { store: 'Checkers', price: 32.99, onSpecial: true },
      { store: 'Pick n Pay', price: 36.99, onSpecial: false },
      { store: 'Woolworths', price: 42.99, onSpecial: false },
      { store: 'Shoprite', price: 33.99, onSpecial: false }
    ]
  },
  {
    item: 'Milk (1L)',
    prices: [
      { store: 'Checkers', price: 16.99, onSpecial: false },
      { store: 'Pick n Pay', price: 15.99, onSpecial: true },
      { store: 'Woolworths', price: 18.99, onSpecial: false },
      { store: 'Shoprite', price: 16.49, onSpecial: false }
    ]
  },
  {
    item: 'Bread (White Loaf)',
    prices: [
      { store: 'Checkers', price: 14.99, onSpecial: false },
      { store: 'Pick n Pay', price: 14.49, onSpecial: false },
      { store: 'Woolworths', price: 17.99, onSpecial: false },
      { store: 'Shoprite', price: 13.99, onSpecial: true }
    ]
  },
  {
    item: 'Eggs (Dozen)',
    prices: [
      { store: 'Checkers', price: 39.99, onSpecial: false },
      { store: 'Pick n Pay', price: 37.99, onSpecial: true },
      { store: 'Woolworths', price: 45.99, onSpecial: false },
      { store: 'Shoprite', price: 38.99, onSpecial: false }
    ]
  }
];

const KitchenScreen = () => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [groceryItem, setGroceryItem] = useState('');
  
  // Handle recipe selection
  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    setRecipeModalVisible(true);
  };

  // Handle grocery price comparison
  const handleCompareGroceries = () => {
    // Here we would normally fetch real-time prices using the Gemini API
    // For now, we'll just show the mock data
    setCompareModalVisible(true);
  };

  // Render the recipes tab
  const renderRecipes = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes or ingredients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.recipeFilters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={[styles.filterButton, styles.activeFilterButton]}>
            <Text style={styles.activeFilterText}>All Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Quick Meals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Budget Friendly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Traditional</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <Text style={styles.sectionTitle}>Recommended Recipes</Text>
      
      {mockRecipes.map((recipe) => (
        <TouchableOpacity 
          key={recipe.id} 
          style={styles.recipeCard}
          onPress={() => handleRecipeSelect(recipe)}
        >
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
          <View style={styles.recipeContent}>
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <View style={styles.recipeMetaContainer}>
              <View style={styles.recipeMeta}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.recipeMetaText}>{recipe.prepTime} prep</Text>
              </View>
              <View style={styles.recipeMeta}>
                <Ionicons name="flame-outline" size={16} color="#6B7280" />
                <Text style={styles.recipeMetaText}>{recipe.cookTime} cook</Text>
              </View>
            </View>
            <Text style={styles.recipeIngredients}>
              {recipe.ingredients.slice(0, 3).join(', ')}
              {recipe.ingredients.length > 3 ? '...' : ''}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity style={styles.generateButton}>
        <Ionicons name="restaurant-outline" size={20} color="#FFFFFF" />
        <Text style={styles.generateButtonText}>Generate Recipe from Ingredients</Text>
      </TouchableOpacity>
    </View>
  );

  // Render the grocery comparison tab
  const renderGroceryComparison = () => (
    <View style={styles.tabContent}>
      <View style={styles.compareContainer}>
        <Text style={styles.compareTitle}>Compare Grocery Prices</Text>
        <Text style={styles.compareSubtitle}>
          Find the best deals across South African retailers
        </Text>
        
        <View style={styles.compareInputContainer}>
          <TextInput
            style={styles.compareInput}
            placeholder="Enter grocery item (e.g., rice, milk)"
            value={groceryItem}
            onChangeText={setGroceryItem}
          />
          <TouchableOpacity 
            style={styles.compareButton}
            onPress={handleCompareGroceries}
          >
            <Text style={styles.compareButtonText}>Compare</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.recentComparisonsTitle}>Recent Comparisons</Text>
        
        {mockGroceryComparison.map((item, index) => {
          // Find the cheapest price
          const cheapestPrice = Math.min(...item.prices.map(p => p.price));
          
          return (
            <View key={index} style={styles.comparisonCard}>
              <Text style={styles.comparisonItemName}>{item.item}</Text>
              
              {item.prices.map((price, priceIndex) => (
                <View key={priceIndex} style={styles.priceRow}>
                  <Text style={styles.storeName}>{price.store}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={[
                      styles.price,
                      price.price === cheapestPrice && styles.cheapestPrice
                    ]}>
                      R{price.price.toFixed(2)}
                    </Text>
                    {price.onSpecial && (
                      <View style={styles.specialBadge}>
                        <Text style={styles.specialText}>Special</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
              
              <View style={styles.savingsContainer}>
                <Text style={styles.savingsText}>
                  Potential savings: R{(Math.max(...item.prices.map(p => p.price)) - cheapestPrice).toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kitchen Companion</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
          onPress={() => setActiveTab('recipes')}
        >
          <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>
            Recipes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'grocery' && styles.activeTab]}
          onPress={() => setActiveTab('grocery')}
        >
          <Text style={[styles.tabText, activeTab === 'grocery' && styles.activeTabText]}>
            Price Comparison
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'recipes' ? renderRecipes() : renderGroceryComparison()}
      </ScrollView>
      
      {/* Recipe Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={recipeModalVisible}
        onRequestClose={() => {
          setRecipeModalVisible(false);
          setSelectedRecipe(null);
        }}
      >
        {selectedRecipe && (
          <View style={styles.modalOverlay}>
            <View style={styles.recipeModalContent}>
              <ScrollView>
                <Image source={{ uri: selectedRecipe.image }} style={styles.recipeModalImage} />
                
                <View style={styles.recipeModalHeader}>
                  <View>
                    <Text style={styles.recipeModalName}>{selectedRecipe.name}</Text>
                    <Text style={styles.recipeModalSource}>{selectedRecipe.source}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => {
                      setRecipeModalVisible(false);
                      setSelectedRecipe(null);
                    }}
                  >
                    <Ionicons name="close-circle" size={32} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.recipeModalMeta}>
                  <View style={styles.recipeModalMetaItem}>
                    <Ionicons name="time-outline" size={20} color="#4F46E5" />
                    <Text style={styles.recipeModalMetaText}>
                      Prep: {selectedRecipe.prepTime}
                    </Text>
                  </View>
                  <View style={styles.recipeModalMetaItem}>
                    <Ionicons name="flame-outline" size={20} color="#4F46E5" />
                    <Text style={styles.recipeModalMetaText}>
                      Cook: {selectedRecipe.cookTime}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.recipeModalSection}>
                  <Text style={styles.recipeModalSectionTitle}>Ingredients</Text>
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientItem}>
                      <View style={styles.ingredientBullet} />
                      <Text style={styles.ingredientText}>{ingredient}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.recipeModalSection}>
                  <Text style={styles.recipeModalSectionTitle}>Instructions</Text>
                  <Text style={styles.instructionsText}>
                    {/* Placeholder for instructions */}
                    1. Preheat the oven to 180°C (350°F).\n\n
                    2. In a large pan, sauté the onions until translucent.\n\n
                    3. Add the ground beef and cook until browned.\n\n
                    4. Add the spices and cook for another 2 minutes.\n\n
                    5. Soak the bread in the milk, then mash and add to the meat mixture.\n\n
                    6. Transfer to a baking dish.\n\n
                    7. Beat the eggs and pour over the meat mixture.\n\n
                    8. Place bay leaves on top and bake for 45 minutes until golden brown.
                  </Text>
                </View>
                
                <TouchableOpacity style={styles.addToGroceryButton}>
                  <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.addToGroceryButtonText}>Add Ingredients to Shopping List</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
      
      {/* Grocery Comparison Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={compareModalVisible}
        onRequestClose={() => setCompareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.compareModalContent}>
            <View style={styles.compareModalHeader}>
              <Text style={styles.compareModalTitle}>Price Comparison</Text>
              <TouchableOpacity onPress={() => setCompareModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.compareModalSubtitle}>
              Searching for: {groceryItem || 'All items'}
            </Text>
            
            <Text style={styles.compareModalNote}>
              Prices last updated: May 15, 2025
            </Text>
            
            {/* Placeholder for real-time data from Gemini API */}
            <View style={styles.compareModalLoading}>
              <Text style={styles.compareModalLoadingText}>
                In a real implementation, this would use the Gemini API to fetch real-time prices from South African retailers.
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setCompareModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
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
  searchContainer: {
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
  recipeFilters: {
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  activeFilterButton: {
    backgroundColor: '#4F46E5',
  },
  filterText: {
    color: '#4B5563',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recipeImage: {
    width: '100%',
    height: 160,
  },
  recipeContent: {
    padding: 16,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  recipeMetaContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  recipeMetaText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  recipeIngredients: {
    fontSize: 14,
    color: '#4B5563',
  },
  generateButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  compareContainer: {
    marginBottom: 20,
  },
  compareTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  compareSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  compareInputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  compareInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 12,
  },
  compareButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  compareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recentComparisonsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  comparisonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  comparisonItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  storeName: {
    fontSize: 16,
    color: '#4B5563',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  cheapestPrice: {
    color: '#10B981',
    fontWeight: '700',
  },
  specialBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  specialText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
  },
  savingsContainer: {
    marginTop: 12,
    paddingTop: 8,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  recipeModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  recipeModalImage: {
    width: '100%',
    height: 200,
  },
  recipeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
  },
  recipeModalName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  recipeModalSource: {
    fontSize: 14,
    color: '#6B7280',
  },
  recipeModalMeta: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recipeModalMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  recipeModalMetaText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 4,
  },
  recipeModalSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recipeModalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4F46E5',
    marginRight: 8,
  },
  ingredientText: {
    fontSize: 16,
    color: '#4B5563',
  },
  instructionsText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  addToGroceryButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  addToGroceryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  compareModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  compareModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  compareModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  compareModalSubtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  compareModalNote: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  compareModalLoading: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  compareModalLoadingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  closeModalButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default KitchenScreen;
