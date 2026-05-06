import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { useThemeContext } from '@/context/ThemeContext';

export default function HistorialScreen() {
  const { isDark } = useThemeContext();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const router = useRouter();

  const loadWorkouts = async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem('workouts');
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [])
  );

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('workouts');
      setWorkouts([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Tu Historial</Text>
          {workouts.length > 0 && (
            <Pressable onPress={clearHistory}>
              <Text style={styles.clearText}>Limpiar</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.subtitle}>{workouts.length} entrenamientos</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {workouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tienes entrenamientos guardados aún.</Text>
          </View>
        ) : workouts.map((workout) => (
          <Pressable
            key={workout.id}
            style={styles.card}
            onPress={() => router.push(`/historial/${workout.id}`)}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, isDark && styles.cardIconDark]}>
                <IconSymbol name="figure.run" size={24} color="#4A90E2" />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={[styles.cardTitle, isDark && styles.textDark]}>{workout.name}</Text>
                <Text style={[styles.cardDate, isDark && styles.subtitleDark]}>{workout.date}</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#C7C7CC" />
            </View>

            <View style={[styles.cardStats, isDark && styles.borderDark]}>
              <View style={styles.statItem}>
                <IconSymbol name="timer" size={16} color="#666" />
                <Text style={styles.statText}>{formatDuration(workout.duration)}</Text>
              </View>
              <View style={styles.statItem}>
                <IconSymbol name="list.bullet" size={16} color="#666" />
                <Text style={styles.statText}>{workout.volume.toLocaleString()} kg</Text>
              </View>
              {workout.prs > 0 && (
                <View style={styles.prBadge}>
                  <Text style={styles.prText}>{workout.prs} PRs 🏆</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textDark: {
    color: '#FFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  clearText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  subtitleDark: {
    color: '#AAA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1E1E1E',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardIconDark: {
    backgroundColor: '#2A3A4A',
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 13,
    color: '#666',
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  borderDark: {
    borderTopColor: '#333',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  statTextDark: {
    color: '#CCC',
  },
  prBadge: {
    marginLeft: 'auto',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  prText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: 'bold',
  },
});
