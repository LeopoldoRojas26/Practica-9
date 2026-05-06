import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HistorialDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const storedWorkouts = await AsyncStorage.getItem('workouts');
        if (storedWorkouts) {
          const parsed = JSON.parse(storedWorkouts);
          const found = parsed.find((w: any) => w.id === id);
          setWorkout(found || null);
        }
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Entrenamiento no encontrado</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{workout.name}</Text>
          <Text style={styles.date}>{workout.date}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <IconSymbol name="timer" size={20} color="#4A90E2" />
              <Text style={styles.statBoxText}>{formatDuration(workout.duration)}</Text>
              <Text style={styles.statBoxLabel}>Duración</Text>
            </View>
            <View style={styles.statBox}>
              <IconSymbol name="list.bullet" size={20} color="#4A90E2" />
              <Text style={styles.statBoxText}>{workout.volume.toLocaleString()} kg</Text>
              <Text style={styles.statBoxLabel}>Volumen</Text>
            </View>
            <View style={styles.statBox}>
              <IconSymbol name="figure.run" size={20} color="#4A90E2" />
              <Text style={styles.statBoxText}>{workout.exercises.length}</Text>
              <Text style={styles.statBoxLabel}>Ejercicios</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ejercicios Realizados</Text>

        {workout.exercises.map((ex, index) => (
          <View key={ex.id} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{index + 1}. {ex.name}</Text>
            
            <View style={styles.tableHeader}>
              <Text style={styles.colSet}>Serie</Text>
              <Text style={styles.colWeight}>kg</Text>
              <Text style={styles.colReps}>Reps</Text>
            </View>

            {ex.sets.map((set, sIndex) => (
              <View key={set.id} style={styles.row}>
                <Text style={styles.cellSet}>{sIndex + 1}</Text>
                <Text style={styles.cellWeight}>{set.weight}</Text>
                <Text style={styles.cellReps}>{set.reps}</Text>
              </View>
            ))}
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 20,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statBoxText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 8,
  },
  statBoxLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 8,
  },
  colSet: { flex: 1, color: '#666', fontSize: 13, fontWeight: '600' },
  colWeight: { flex: 2, color: '#666', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  colReps: { flex: 2, color: '#666', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  cellSet: { flex: 1, color: '#666', fontSize: 14, fontWeight: '500' },
  cellWeight: { flex: 2, color: '#1A1A1A', fontSize: 15, fontWeight: '600', textAlign: 'center' },
  cellReps: { flex: 2, color: '#1A1A1A', fontSize: 15, fontWeight: '600', textAlign: 'center' },
});
