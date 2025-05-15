import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface BackButtonProps {
  destination?: string;
}

const BackButton = ({ destination = 'Landing' }: BackButtonProps) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(destination as never);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Ionicons name="arrow-back" size={24} color="#4F46E5" />
      <Text style={styles.text}>Back to Home</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    marginLeft: 5,
    color: '#4F46E5',
    fontWeight: '500',
  },
});

export default BackButton;
