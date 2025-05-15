import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Svg, Path, Circle, G } from 'react-native-svg';

const AnimatedLogo = () => {
  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    
    // Scale animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      ])
    ).start();
    
    // Opacity animation
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // Text animation
    Animated.timing(textAnim, {
      toValue: 1,
      duration: 1500,
      delay: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Interpolate rotation value
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // Animated SVG components
  const AnimatedG = Animated.createAnimatedComponent(G);
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer, 
          { 
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },
            ]
          }
        ]}
      >
        <Svg width="120" height="120" viewBox="0 0 120 120">
          {/* Outer circle - represents the globe/earth */}
          <Circle cx="60" cy="60" r="50" fill="#0A1017" stroke="#0EA5E9" strokeWidth="2" />
          
          {/* Lightning bolt - represents electricity */}
          <AnimatedG
            style={{
              transform: [{ rotate: spin }]
            }}
          >
            <Path 
              d="M60 20 L45 60 L60 60 L40 100 L55 65 L40 65 Z" 
              fill="#0EA5E9" 
              stroke="#FFFFFF" 
              strokeWidth="1"
            />
          </AnimatedG>
          
          {/* House outline */}
          <Path 
            d="M40 70 L60 50 L80 70 L80 90 L40 90 Z" 
            fill="none" 
            stroke="#FFFFFF" 
            strokeWidth="2"
          />
          
          {/* Solar panel on roof */}
          <Path 
            d="M50 60 L70 60 L70 70 L50 70 Z" 
            fill="#4F46E5" 
            stroke="#FFFFFF" 
            strokeWidth="1"
          />
          
          {/* Pulsing energy point */}
          <AnimatedCircle 
            cx="60" 
            cy="60" 
            r="5" 
            fill="#F59E0B"
            style={{
              opacity: scaleAnim.interpolate({
                inputRange: [0.9, 1.1],
                outputRange: [0.5, 1]
              })
            }}
          />
        </Svg>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.textContainer,
          {
            opacity: textAnim,
            transform: [
              { 
                translateY: textAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }
            ]
          }
        ]}
      >
        <Text style={styles.appName}>HouseHoldHero</Text>
        <Text style={styles.tagline}>Smart Energy for South Africa</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 15,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 14,
    color: '#0EA5E9',
    fontStyle: 'italic',
  }
});

export default AnimatedLogo;
