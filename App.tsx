import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import LandingScreen from './src/screens/LandingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import FinancialScreen from './src/screens/FinancialScreen';
import EnergyScreen from './src/screens/EnergyScreen';
import StockScreen from './src/screens/StockScreen';
import KitchenScreen from './src/screens/KitchenScreen';
import WellnessScreen from './src/screens/WellnessScreen';

// Import store
import useStore from './src/store/useStore';

// Import types
import { MainTabParamList, RootStackParamList } from './src/types';

// Create navigation stacks
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Create a React Query client
const queryClient = new QueryClient();

// Main tab navigation
function MainTabs(): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: string = 'help-outline';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Financial') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Energy') {
            iconName = focused ? 'flash' : 'flash-outline';
          } else if (route.name === 'Stock') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Kitchen') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Wellness') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Financial" component={FinancialScreen} />
      <Tab.Screen name="Energy" component={EnergyScreen} />
      <Tab.Screen name="Stock" component={StockScreen} />
      <Tab.Screen name="Kitchen" component={KitchenScreen} />
      <Tab.Screen name="Wellness" component={WellnessScreen} />
    </Tab.Navigator>
  );
}

export default function App(): JSX.Element {
  // For testing purposes, we'll skip the onboarding screen
  // and set the user as authenticated
  const setAuthenticated = useStore((state: any) => state.setAuthenticated);
  const setUserProfile = useStore((state: any) => state.setUserProfile);
  
  // Set mock user profile data
  React.useEffect(() => {
    setAuthenticated(true);
    setUserProfile({
      uid: 'mock-user-id',
      name: 'Maria',
      householdSize: '3',
      province: 'Gauteng',
      incomeRange: 'R20,001 - R40,000',
      electricityProvider: 'city_power',
      tariff: 'Prepaid'
    });
  }, [setAuthenticated, setUserProfile]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Landing"
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: '#F9FAFB'
              }
            }}
          >
            <Stack.Screen 
              name="Landing" 
              component={LandingScreen} 
              options={{ 
                headerShown: false,
                contentStyle: {
                  backgroundColor: '#0A1017'
                }
              }}
            />
            <Stack.Screen 
              name="Onboarding" 
              component={OnboardingScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Main" 
              component={MainTabs} 
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
