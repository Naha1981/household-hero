import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Define the electricity providers in South Africa
const ELECTRICITY_PROVIDERS = [
  { id: 'eskom', name: 'Eskom', tariffs: ['Homepower 1', 'Homepower 2', 'Homepower 3', 'Homepower 4'] },
  { id: 'city_power', name: 'City Power', tariffs: ['Prepaid', 'Conventional', 'Business'] },
  { id: 'cape_town', name: 'City of Cape Town', tariffs: ['Domestic', 'Lifeline'] },
  { id: 'tshwane', name: 'City of Tshwane', tariffs: ['Residential', 'Prepaid'] },
];

// Define household size options
const HOUSEHOLD_SIZES = ['1', '2', '3', '4', '5+'];

// Define income ranges
const INCOME_RANGES = [
  'R0 - R5,000',
  'R5,001 - R10,000',
  'R10,001 - R20,000',
  'R20,001 - R40,000',
  'R40,001+'
];

// Define South African provinces
const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape'
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  
  // User profile state
  const [profile, setProfile] = useState({
    name: '',
    householdSize: '',
    province: '',
    incomeRange: '',
    electricityProvider: '',
    tariff: '',
  });

  // Handle profile updates
  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Handle next step
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save profile data to storage/state management
      // Navigate to main app
      // @ts-ignore
      navigation.navigate('Main');
    }
  };

  // Handle previous step
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Render welcome screen
  const renderWelcome = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Welcome to HouseHoldHero AI</Text>
      <Text style={styles.subtitle}>Your Smart Household Data Companion</Text>
      
      <View style={styles.featureContainer}>
        <View style={styles.featureItem}>
          <Ionicons name="analytics-outline" size={32} color="#4F46E5" />
          <Text style={styles.featureText}>Transform manual data entry into actionable insights</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="search-outline" size={32} color="#4F46E5" />
          <Text style={styles.featureText}>Real-time grocery price comparisons</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="bulb-outline" size={32} color="#4F46E5" />
          <Text style={styles.featureText}>Personalized energy-saving tips</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="cash-outline" size={32} color="#4F46E5" />
          <Text style={styles.featureText}>Financial guidance tailored to South African households</Text>
        </View>
      </View>
      
      <Text style={styles.description}>
        Let's get started by setting up your household profile. This will help us provide 
        personalized recommendations and insights for your specific needs.
      </Text>
    </View>
  );

  // Render personal info screen
  const renderPersonalInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Personal Information</Text>
      <Text style={styles.description}>Tell us a bit about yourself and your household</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={profile.name}
          onChangeText={(value) => updateProfile('name', value)}
          placeholder="Enter your name"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Household Size</Text>
        <View style={styles.optionsContainer}>
          {HOUSEHOLD_SIZES.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.optionButton,
                profile.householdSize === size && styles.selectedOption
              ]}
              onPress={() => updateProfile('householdSize', size)}
            >
              <Text style={[
                styles.optionText,
                profile.householdSize === size && styles.selectedOptionText
              ]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Province</Text>
        <View style={styles.pickerContainer}>
          {PROVINCES.map((province) => (
            <TouchableOpacity
              key={province}
              style={[
                styles.provinceOption,
                profile.province === province && styles.selectedOption
              ]}
              onPress={() => updateProfile('province', province)}
            >
              <Text style={[
                styles.optionText,
                profile.province === province && styles.selectedOptionText
              ]}>
                {province}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  // Render financial info screen
  const renderFinancialInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Financial Information</Text>
      <Text style={styles.description}>
        This helps us provide relevant financial insights and budgeting recommendations
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Monthly Household Income Range</Text>
        <View style={styles.incomeContainer}>
          {INCOME_RANGES.map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.incomeOption,
                profile.incomeRange === range && styles.selectedOption
              ]}
              onPress={() => updateProfile('incomeRange', range)}
            >
              <Text style={[
                styles.optionText,
                profile.incomeRange === range && styles.selectedOptionText
              ]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  // Render electricity provider screen
  const renderElectricityInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Electricity Provider</Text>
      <Text style={styles.description}>
        Select your electricity provider and tariff to get accurate energy insights
      </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Electricity Provider</Text>
        <View style={styles.providersContainer}>
          {ELECTRICITY_PROVIDERS.map((provider) => (
            <TouchableOpacity
              key={provider.id}
              style={[
                styles.providerOption,
                profile.electricityProvider === provider.id && styles.selectedOption
              ]}
              onPress={() => updateProfile('electricityProvider', provider.id)}
            >
              <Text style={[
                styles.optionText,
                profile.electricityProvider === provider.id && styles.selectedOptionText
              ]}>
                {provider.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {profile.electricityProvider && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tariff</Text>
          <View style={styles.tariffsContainer}>
            {ELECTRICITY_PROVIDERS
              .find(p => p.id === profile.electricityProvider)?.tariffs
              .map((tariff) => (
                <TouchableOpacity
                  key={tariff}
                  style={[
                    styles.tariffOption,
                    profile.tariff === tariff && styles.selectedOption
                  ]}
                  onPress={() => updateProfile('tariff', tariff)}
                >
                  <Text style={[
                    styles.optionText,
                    profile.tariff === tariff && styles.selectedOptionText
                  ]}>
                    {tariff}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      )}
    </View>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return renderWelcome();
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderFinancialInfo();
      case 3:
        return renderElectricityInfo();
      default:
        return renderWelcome();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderStepContent()}
        
        <View style={styles.navigationContainer}>
          {step > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Ionicons name="arrow-back" size={24} color="#4F46E5" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
            <Text style={styles.nextButtonText}>
              {step === 3 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressContainer}>
          {[0, 1, 2, 3].map((i) => (
            <View 
              key={i} 
              style={[
                styles.progressDot,
                i === step ? styles.activeDot : (i < step ? styles.completedDot : {})
              ]} 
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
    lineHeight: 24,
  },
  featureContainer: {
    marginVertical: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 15,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  optionText: {
    fontSize: 16,
    color: '#4B5563',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  provinceOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    marginBottom: 10,
    minWidth: '45%',
  },
  incomeContainer: {
    flexDirection: 'column',
  },
  incomeOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  providersContainer: {
    flexDirection: 'column',
  },
  providerOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  tariffsContainer: {
    flexDirection: 'column',
  },
  tariffOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#4F46E5',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#4F46E5',
    width: 12,
    height: 12,
  },
  completedDot: {
    backgroundColor: '#A5B4FC',
  },
});

export default OnboardingScreen;
