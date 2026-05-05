import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppContext } from '@/app/context/AppContext';
import { EXERCISES } from '@/app/(tabs)/ejercicios';
import { ProgresoModal } from '@/components/ProgresoModal';

export default function InicioScreen() {
  const router = useRouter();
  const { timerTimeLeft, isTimerActive, isWorkoutActive, workoutName, workoutStartTime } = useAppContext();
  
  const [workoutsCount, setWorkoutsCount] = useState(0);
  const [activeMinutes, setActiveMinutes] = useState(0);
  const [lastWorkoutDate, setLastWorkoutDate] = useState('Ninguno');
  const [progresoVisible, setProgresoVisible] = useState(false);

  const loadStats = async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem('workouts');
      if (storedWorkouts) {
        const parsedWorkouts = JSON.parse(storedWorkouts);
        
        const totalSeconds = parsedWorkouts.reduce((acc: number, w: any) => acc + (w.duration || 0), 0);
        setActiveMinutes(Math.floor(totalSeconds / 60));
        
        setWorkoutsCount(parsedWorkouts.length);

        if (parsedWorkouts.length > 0) {
          setLastWorkoutDate(parsedWorkouts[0].date);
        } else {
          setLastWorkoutDate('Ninguno');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getWorkoutTimeStr = () => {
    if (!workoutStartTime) return '';
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - workoutStartTime.getTime()) / 60000);
    return `${diffMins} min`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, Martha 👋</Text>
        <Text style={styles.subtitle}>Lista para tu próximo reto?</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{workoutsCount}</Text>
          <Text style={styles.statLabel}>Entrenos totales</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{activeMinutes}</Text>
          <Text style={styles.statLabel}>Minutos activos</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Acceso Rápido</Text>

      <View style={styles.cardsContainer}>
        <Pressable style={[styles.card, styles.cardPrimary]} onPress={() => router.push('/entrenar')}>
          <IconSymbol name="figure.run" size={32} color="#fff" />
          <Text style={styles.cardTitleLight}>{isWorkoutActive ? 'Entrenamiento Activo' : 'Empezar a Entrenar'}</Text>
          <Text style={styles.cardSubLight}>
            {isWorkoutActive ? `${workoutName} - ${getWorkoutTimeStr()}` : 'Explorar Rutinas'}
          </Text>
        </Pressable>

        <View style={styles.rowCards}>
          <Pressable style={styles.cardSmall} onPress={() => router.push('/historial')}>
            <IconSymbol name="clock.fill" size={28} color="#4A90E2" />
            <Text style={styles.cardTitle}>Historial</Text>
            <Text style={styles.cardSub} numberOfLines={1}>Último: {lastWorkoutDate}</Text>
          </Pressable>

          <Pressable style={styles.cardSmall} onPress={() => router.push('/ejercicios')}>
            <IconSymbol name="list.bullet" size={28} color="#E24A75" />
            <Text style={styles.cardTitle}>Ejercicios</Text>
            <Text style={styles.cardSub}>{EXERCISES.length} disponibles</Text>
          </Pressable>
        </View>

        <Pressable style={styles.cardDescanso} onPress={() => router.push('/descanso')}>
          <View style={styles.descansoLeft}>
            <IconSymbol name="timer" size={28} color="#F39C12" />
            <View style={styles.descansoText}>
              <Text style={styles.cardTitle}>Descanso {isTimerActive ? 'Activo' : 'Actual'}</Text>
              <Text style={styles.cardSub}>{isTimerActive ? 'Cuenta regresiva...' : 'Recuperación óptima'}</Text>
            </View>
          </View>
          <Text style={[styles.descansoTime, isTimerActive && { color: '#E74C3C' }]}>{formatTime(timerTimeLeft)}</Text>
        </Pressable>

        <Pressable style={styles.cardProgreso} onPress={() => setProgresoVisible(true)}>
          <View style={styles.progresoLeft}>
            <IconSymbol name="chart.xyaxis.line" size={28} color="#9B59B6" />
            <View style={styles.progresoText}>
              <Text style={styles.cardTitle}>Tu Progreso</Text>
              <Text style={styles.cardSub}>Peso, medidas y fotos</Text>
            </View>
          </View>
          <IconSymbol name="chevron.right" size={24} color="#ccc" />
        </Pressable>

      </View>

      <ProgresoModal 
        visible={progresoVisible} 
        onClose={() => setProgresoVisible(false)} 
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    padding: 24,
    borderRadius: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardPrimary: {
    backgroundColor: '#4A90E2',
    height: 140,
  },
  cardTitleLight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  cardSubLight: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  rowCards: {
    flexDirection: 'row',
    gap: 16,
  },
  cardSmall: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 12,
  },
  cardSub: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  cardDescanso: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  descansoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  descansoText: {
    justifyContent: 'center',
  },
  descansoTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F39C12',
  },
  cardProgreso: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progresoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progresoText: {
    justifyContent: 'center',
  },
});
