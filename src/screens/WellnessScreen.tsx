import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data for fitness routines
const mockFitnessRoutines = [
  {
    id: '1',
    title: 'Morning Energy Boost',
    description: 'Start your day with this 15-minute routine to energize your body and mind.',
    duration: '15 min',
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    exercises: [
      { name: 'Jumping Jacks', duration: '2 min' },
      { name: 'Push-ups', reps: '10 reps' },
      { name: 'Squats', reps: '15 reps' },
      { name: 'Plank', duration: '30 sec' },
      { name: 'High Knees', duration: '1 min' }
    ]
  },
  {
    id: '2',
    title: 'No-Equipment Home Workout',
    description: 'A full-body workout you can do at home without any equipment.',
    duration: '30 min',
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    exercises: [
      { name: 'Bodyweight Squats', reps: '20 reps' },
      { name: 'Lunges', reps: '10 each leg' },
      { name: 'Push-ups', reps: '15 reps' },
      { name: 'Tricep Dips', reps: '12 reps' },
      { name: 'Plank', duration: '45 sec' },
      { name: 'Mountain Climbers', duration: '1 min' }
    ]
  },
  {
    id: '3',
    title: 'Stress Relief Stretching',
    description: 'Gentle stretches to relieve tension and stress after a long day.',
    duration: '20 min',
    level: 'All Levels',
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    exercises: [
      { name: 'Neck Rolls', duration: '1 min' },
      { name: 'Shoulder Stretches', duration: '2 min' },
      { name: 'Child\'s Pose', duration: '2 min' },
      { name: 'Cat-Cow Stretch', duration: '2 min' },
      { name: 'Hamstring Stretch', duration: '1 min each leg' },
      { name: 'Spinal Twist', duration: '1 min each side' }
    ]
  }
];

// Mock data for gardening tips
const mockGardeningTips = [
  {
    id: '1',
    title: 'Water-Wise Gardening',
    description: 'Tips for maintaining a beautiful garden while conserving water in South Africa\'s dry climate.',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    tips: [
      'Group plants with similar water needs together',
      'Water early in the morning or late in the evening to reduce evaporation',
      'Use mulch to retain soil moisture and reduce water needs',
      'Consider installing a rainwater harvesting system',
      'Choose indigenous drought-resistant plants'
    ]
  },
  {
    id: '2',
    title: 'Vegetable Garden Basics',
    description: 'Start growing your own vegetables with these South African climate-adapted tips.',
    image: 'https://images.unsplash.com/photo-1592419391526-cd24e159468a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    tips: [
      'Start with easy vegetables like spinach, tomatoes, and peppers',
      'Prepare soil with compost before planting',
      'Plant according to seasonal calendars for South Africa',
      'Protect young plants from harsh sun with shade cloth',
      'Implement companion planting to deter pests naturally'
    ]
  },
  {
    id: '3',
    title: 'Indigenous Plants Guide',
    description: 'Beautify your garden with local South African plants that thrive in the local climate.',
    image: 'https://images.unsplash.com/photo-1551893665-f843f600794e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    tips: [
      'Consider proteas and fynbos for coastal regions',
      'Aloes and succulents work well in drier areas',
      'Indigenous plants attract local birds and beneficial insects',
      'Most native plants require less maintenance once established',
      'Visit local nurseries specializing in indigenous plants for advice'
    ]
  }
];

const WellnessScreen = () => {
  const [activeTab, setActiveTab] = useState('fitness');
  const [selectedFitnessRoutine, setSelectedFitnessRoutine] = useState(null);
  const [selectedGardeningTip, setSelectedGardeningTip] = useState(null);
  const [fitnessModalVisible, setFitnessModalVisible] = useState(false);
  const [gardeningModalVisible, setGardeningModalVisible] = useState(false);
  
  // Handle fitness routine selection
  const handleSelectFitnessRoutine = (routine) => {
    setSelectedFitnessRoutine(routine);
    setFitnessModalVisible(true);
  };

  // Handle gardening tip selection
  const handleSelectGardeningTip = (tip) => {
    setSelectedGardeningTip(tip);
    setGardeningModalVisible(true);
  };

  // Render the fitness tab
  const renderFitness = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Fitness Routines</Text>
      <Text style={styles.sectionSubtitle}>
        Simple workouts you can do at home without special equipment
      </Text>
      
      {mockFitnessRoutines.map((routine) => (
        <TouchableOpacity 
          key={routine.id} 
          style={styles.routineCard}
          onPress={() => handleSelectFitnessRoutine(routine)}
        >
          <Image source={{ uri: routine.image }} style={styles.routineImage} />
          <View style={styles.routineContent}>
            <Text style={styles.routineTitle}>{routine.title}</Text>
            <View style={styles.routineMetaContainer}>
              <View style={styles.routineMeta}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.routineMetaText}>{routine.duration}</Text>
              </View>
              <View style={styles.routineMeta}>
                <Ionicons name="fitness-outline" size={16} color="#6B7280" />
                <Text style={styles.routineMetaText}>{routine.level}</Text>
              </View>
            </View>
            <Text style={styles.routineDescription}>{routine.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
      
      <View style={styles.wellnessCard}>
        <Text style={styles.wellnessCardTitle}>Daily Wellness Tip</Text>
        <Text style={styles.wellnessCardText}>
          "Taking just 10 minutes a day for mindful breathing can significantly reduce stress levels and improve focus."
        </Text>
      </View>
    </View>
  );

  // Render the gardening tab
  const renderGardening = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Gardening Tips</Text>
      <Text style={styles.sectionSubtitle}>
        Advice adapted for South African climate and conditions
      </Text>
      
      {mockGardeningTips.map((tip) => (
        <TouchableOpacity 
          key={tip.id} 
          style={styles.gardeningCard}
          onPress={() => handleSelectGardeningTip(tip)}
        >
          <Image source={{ uri: tip.image }} style={styles.gardeningImage} />
          <View style={styles.gardeningContent}>
            <Text style={styles.gardeningTitle}>{tip.title}</Text>
            <Text style={styles.gardeningDescription}>{tip.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
      
      <View style={styles.seasonalCard}>
        <Text style={styles.seasonalCardTitle}>Seasonal Planting Guide</Text>
        <Text style={styles.seasonalCardSubtitle}>What to plant in South Africa this month</Text>
        
        <View style={styles.seasonalItemContainer}>
          <View style={styles.seasonalItem}>
            <View style={[styles.seasonalIcon, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="leaf-outline" size={20} color="#0EA5E9" />
            </View>
            <Text style={styles.seasonalItemText}>Spinach</Text>
          </View>
          
          <View style={styles.seasonalItem}>
            <View style={[styles.seasonalIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="nutrition-outline" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.seasonalItemText}>Carrots</Text>
          </View>
          
          <View style={styles.seasonalItem}>
            <View style={[styles.seasonalIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="flower-outline" size={20} color="#10B981" />
            </View>
            <Text style={styles.seasonalItemText}>Marigolds</Text>
          </View>
          
          <View style={styles.seasonalItem}>
            <View style={[styles.seasonalIcon, { backgroundColor: '#FFE4E6' }]}>
              <Ionicons name="restaurant-outline" size={20} color="#F43F5E" />
            </View>
            <Text style={styles.seasonalItemText}>Tomatoes</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wellness & Gardening</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'fitness' && styles.activeTab]}
          onPress={() => setActiveTab('fitness')}
        >
          <Text style={[styles.tabText, activeTab === 'fitness' && styles.activeTabText]}>
            Fitness & Wellness
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'gardening' && styles.activeTab]}
          onPress={() => setActiveTab('gardening')}
        >
          <Text style={[styles.tabText, activeTab === 'gardening' && styles.activeTabText]}>
            Gardening
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'fitness' ? renderFitness() : renderGardening()}
      </ScrollView>
      
      {/* Fitness Routine Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={fitnessModalVisible}
        onRequestClose={() => {
          setFitnessModalVisible(false);
          setSelectedFitnessRoutine(null);
        }}
      >
        {selectedFitnessRoutine && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Image source={{ uri: selectedFitnessRoutine.image }} style={styles.modalImage} />
                
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>{selectedFitnessRoutine.title}</Text>
                    <View style={styles.modalMetaContainer}>
                      <View style={styles.modalMeta}>
                        <Ionicons name="time-outline" size={16} color="#6B7280" />
                        <Text style={styles.modalMetaText}>{selectedFitnessRoutine.duration}</Text>
                      </View>
                      <View style={styles.modalMeta}>
                        <Ionicons name="fitness-outline" size={16} color="#6B7280" />
                        <Text style={styles.modalMetaText}>{selectedFitnessRoutine.level}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    onPress={() => {
                      setFitnessModalVisible(false);
                      setSelectedFitnessRoutine(null);
                    }}
                  >
                    <Ionicons name="close-circle" size={32} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.modalDescription}>{selectedFitnessRoutine.description}</Text>
                
                <View style={styles.exercisesContainer}>
                  <Text style={styles.exercisesTitle}>Exercises</Text>
                  
                  {selectedFitnessRoutine.exercises.map((exercise, index) => (
                    <View key={index} style={styles.exerciseItem}>
                      <View style={styles.exerciseNumberContainer}>
                        <Text style={styles.exerciseNumber}>{index + 1}</Text>
                      </View>
                      <View style={styles.exerciseContent}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        <Text style={styles.exerciseDetail}>
                          {exercise.reps || exercise.duration}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start Workout</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
      
      {/* Gardening Tip Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={gardeningModalVisible}
        onRequestClose={() => {
          setGardeningModalVisible(false);
          setSelectedGardeningTip(null);
        }}
      >
        {selectedGardeningTip && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Image source={{ uri: selectedGardeningTip.image }} style={styles.modalImage} />
                
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedGardeningTip.title}</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      setGardeningModalVisible(false);
                      setSelectedGardeningTip(null);
                    }}
                  >
                    <Ionicons name="close-circle" size={32} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.modalDescription}>{selectedGardeningTip.description}</Text>
                
                <View style={styles.tipsContainer}>
                  <Text style={styles.tipsTitle}>Key Tips</Text>
                  
                  {selectedGardeningTip.tips.map((tip, index) => (
                    <View key={index} style={styles.tipItem}>
                      <View style={styles.tipBullet} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save to Favorites</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  routineCard: {
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
  routineImage: {
    width: '100%',
    height: 160,
  },
  routineContent: {
    padding: 16,
  },
  routineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  routineMetaContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  routineMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  routineMetaText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  routineDescription: {
    fontSize: 14,
    color: '#4B5563',
  },
  wellnessCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  wellnessCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 8,
  },
  wellnessCardText: {
    fontSize: 16,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  gardeningCard: {
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
  gardeningImage: {
    width: '100%',
    height: 160,
  },
  gardeningContent: {
    padding: 16,
  },
  gardeningTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  gardeningDescription: {
    fontSize: 14,
    color: '#4B5563',
  },
  seasonalCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  seasonalCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 4,
  },
  seasonalCardSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
  },
  seasonalItemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  seasonalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  seasonalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  seasonalItemText: {
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
    maxHeight: '90%',
  },
  modalImage: {
    width: '100%',
    height: 200,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    flex: 1,
    paddingRight: 16,
  },
  modalMetaContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  modalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  modalMetaText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  modalDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  exercisesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  exerciseNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#6B7280',
  },
  startButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 16,
    margin: 20,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginTop: 6,
    marginRight: 12,
  },
  tipText: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    margin: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WellnessScreen;
