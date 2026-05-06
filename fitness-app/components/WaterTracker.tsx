import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

const BOTTLE_HEIGHT = 200;
const MAX_WATER = 2000; // 2 Liters

export default function WaterTracker() {
  const { isDark } = useThemeContext();
  const [waterLevel, setWaterLevel] = useState(0);
  const fillAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  // Generate today's date key
  const todayDateKey = `water_${new Date().toISOString().split('T')[0]}`;

  useEffect(() => {
    loadWater();

    // Start continuous liquid movement animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const loadWater = async () => {
    try {
      const saved = await AsyncStorage.getItem(todayDateKey);
      if (saved) {
        const value = parseInt(saved, 10);
        setWaterLevel(value);
        const height = (value / MAX_WATER) * BOTTLE_HEIGHT;
        fillAnim.setValue(height);
      }
    } catch (e) {
      console.error('Failed to load water', e);
    }
  };

  const saveWater = async (value: number) => {
    try {
      await AsyncStorage.setItem(todayDateKey, value.toString());
    } catch (e) {
      console.error('Failed to save water', e);
    }
  };

  const handleMarkPress = (value: number) => {
    setWaterLevel(value);
    Animated.timing(fillAnim, {
      toValue: (value / MAX_WATER) * BOTTLE_HEIGHT,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  const waveTranslateY = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 5], // Sutil movimiento vertical de olas
  });
  
  const waveOpacity = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1], // Sutil cambio de opacidad
  });

  const marks = [
    { label: '2L', value: 2000 },
    { label: '1.5L', value: 1500 },
    { label: '1L', value: 1000 },
    { label: '500ml', value: 500 },
    { label: '0ml', value: 0 },
  ];

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <View style={styles.header}>
        <IconSymbol name="drop.fill" size={24} color="#4A90E2" />
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
            Hidratación Hoy
          </Text>
          <Text style={styles.subtitle}>
            {waterLevel}ml / {MAX_WATER}ml
          </Text>
        </View>
      </View>

      <View style={styles.bottleWrapper}>
        <View style={styles.bottleContainer}>
          <View style={styles.bottleNeckContainer}>
            <View style={[styles.bottleCap, isDark ? styles.bottleCapDark : styles.bottleCapLight]} />
            <View style={[styles.bottleNeck, isDark ? styles.bottleDark : styles.bottleLight]} />
          </View>
          <View style={[styles.bottle, isDark ? styles.bottleDark : styles.bottleLight]}>
            <Animated.View style={{ height: fillAnim, width: '100%', justifyContent: 'flex-end' }}>
              <Animated.View
                style={[
                  styles.waterFill,
                  {
                    height: '100%',
                    opacity: waveOpacity,
                    transform: [{ translateY: waveTranslateY }]
                  },
                ]}
              />
            </Animated.View>
          </View>
          <View style={styles.marksContainer}>
            {marks.map((mark) => (
              <Pressable
                key={mark.value}
                style={[
                  styles.mark,
                  { bottom: (mark.value / MAX_WATER) * BOTTLE_HEIGHT },
                ]}
                onPress={() => handleMarkPress(mark.value)}
              >
                <View style={[styles.markLine, isDark ? styles.markLineDark : styles.markLineLight, waterLevel >= mark.value && styles.markLineActive]} />
                <Text style={[styles.markLabel, isDark ? styles.markLabelDark : styles.markLabelLight, waterLevel >= mark.value && styles.markLabelActive]}>
                  {mark.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
      
      <Text style={[styles.instruction, isDark ? styles.instructionDark : styles.instructionLight]}>
        Toca las medidas para ajustar el nivel
      </Text>
      
      <Pressable style={styles.confirmButton} onPress={() => saveWater(waterLevel)}>
        <Text style={styles.confirmButtonText}>Confirmar Cantidad</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  containerLight: {
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
    marginTop: 2,
  },
  textLight: {
    color: '#1A1A1A',
  },
  textDark: {
    color: '#FFFFFF',
  },
  bottleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  bottleContainer: {
    width: 120,
    height: BOTTLE_HEIGHT + 30, // Extra height for neck
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bottleNeckContainer: {
    position: 'absolute',
    top: 0,
    left: 25, // Centered (80 width bottle, 30 width neck -> diff 50 -> 25)
    alignItems: 'center',
    zIndex: 2,
  },
  bottleCap: {
    width: 34,
    height: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: '#CCC',
  },
  bottleCapLight: {
    backgroundColor: '#E5E5E5',
  },
  bottleCapDark: {
    backgroundColor: '#555',
  },
  bottleNeck: {
    width: 30,
    height: 20,
    borderWidth: 3,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bottle: {
    width: 80,
    height: BOTTLE_HEIGHT,
    borderWidth: 3,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bottleLight: {
    borderColor: '#E5E5E5',
  },
  bottleDark: {
    borderColor: '#333333',
  },
  waterFill: {
    width: '100%',
    backgroundColor: '#007AFF', // Vibrant Blue
  },
  marksContainer: {
    position: 'absolute',
    left: 80,
    bottom: 0,
    height: BOTTLE_HEIGHT,
    width: 50,
  },
  mark: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  markLine: {
    width: 10,
    height: 2,
  },
  markLineLight: {
    backgroundColor: '#CCC',
  },
  markLineDark: {
    backgroundColor: '#666',
  },
  markLabel: {
    fontSize: 12,
    marginLeft: 4,
  },
  markLabelLight: {
    color: '#666',
  },
  markLabelDark: {
    color: '#AAA',
  },
  markLineActive: {
    backgroundColor: '#007AFF',
    height: 3,
  },
  markLabelActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  instruction: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
  },
  instructionLight: {
    color: '#888',
  },
  instructionDark: {
    color: '#888',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
