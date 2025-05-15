import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ImageBackground, 
  SafeAreaView,
  Dimensions,
  Platform,
  Animated
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedLogo from '../components/AnimatedLogo';

const LandingScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <AnimatedLogo />
          <Text style={styles.title}>Your Home's{'\n'}AI-Powered{'\n'}Command{'\n'}Center</Text>
          <Text style={styles.subtitle}>
            Manage finances, energy, inventory, and wellness in one intelligent dashboard
          </Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.rightContent}>
          <View style={styles.phoneContainer}>
            <View style={styles.phone}>
              <View style={styles.phoneHeader}>
                <Text style={styles.dashboardTitle}>Dashboard</Text>
              </View>
              
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Smart Savings</Text>
                <View style={styles.graphContainer}>
                  <View style={styles.graph}></View>
                </View>
                <Text style={styles.amount}>R7,820</Text>
              </View>
              
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Energy Usage</Text>
                <View style={styles.circleContainer}>
                  <View style={styles.circle}>
                    <Text style={styles.percentage}>52%</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Budget Overview</Text>
                <Text style={styles.budgetAmount}>R13,500</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1017',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  leftContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  rightContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    lineHeight: 56,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0EA5E9',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  phoneContainer: {
    width: 280,
    height: 560,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '5deg'}],
  },
  phone: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0F1824',
    borderRadius: 40,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 10,
    borderColor: '#1A2634',
  },
  phoneHeader: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  dashboardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1A2634',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '500',
  },
  graphContainer: {
    height: 40,
    justifyContent: 'center',
  },
  graph: {
    height: 30,
    backgroundColor: 'transparent',
    borderColor: '#0EA5E9',
    borderWidth: 2,
    borderRadius: 15,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'right',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#0EA5E9',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '45deg'}],
  },
  percentage: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    transform: [{rotate: '-45deg'}],
  },
  budgetAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LandingScreen;
