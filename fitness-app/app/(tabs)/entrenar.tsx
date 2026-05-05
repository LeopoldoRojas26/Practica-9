import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, TextInput, Modal, FlatList, Alert, Animated } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/app/context/AppContext';

const mockExercisesCatalog = [
  { id: 1, name: 'Press de Banca' },
  { id: 2, name: 'Sentadilla Libre' },
  { id: 3, name: 'Dominadas' },
  { id: 4, name: 'Press Militar' },
  { id: 5, name: 'Curl de Bíceps' },
  { id: 6, name: 'Extensión de Tríceps' },
  { id: 7, name: 'Prensa en Máquina' },
  { id: 8, name: 'Remo con Barra' },
];

export default function EntrenarScreen() {
  const router = useRouter();
  const { isWorkoutActive, workoutStartTime, startWorkout, endWorkout } = useAppContext();

  useEffect(() => {
    if (!isWorkoutActive) {
      startWorkout('Día de Pierna');
    }
  }, [isWorkoutActive]);

  const [exercises, setExercises] = useState([
    {
      id: 'e1',
      name: 'Sentadilla Libre',
      sets: [
        { id: 's1', setNumber: 1, weight: '80', reps: '12', completed: true },
        { id: 's2', setNumber: 2, weight: '90', reps: '10', completed: true },
        { id: 's3', setNumber: 3, weight: '100', reps: '8', completed: false },
      ]
    },
    {
      id: 'e2',
      name: 'Prensa en Máquina',
      sets: [
        { id: 's4', setNumber: 1, weight: '120', reps: '12', completed: false },
        { id: 's5', setNumber: 2, weight: '140', reps: '10', completed: false },
      ]
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  const addSet = (exerciseId: string) => {
    setExercises(prevExercises => prevExercises.map(ex => {
      if (ex.id === exerciseId) {
        const newSetNumber = ex.sets.length > 0 ? ex.sets[ex.sets.length - 1].setNumber + 1 : 1;
        const lastSet = ex.sets.length > 0 ? ex.sets[ex.sets.length - 1] : { weight: '', reps: '' };
        return {
          ...ex,
          sets: [...ex.sets, {
            id: Date.now().toString(),
            setNumber: newSetNumber,
            weight: lastSet.weight,
            reps: lastSet.reps,
            completed: false
          }]
        };
      }
      return ex;
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => {
    setExercises(prevExercises => prevExercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        };
      }
      return ex;
    }));
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    setExercises(prevExercises => prevExercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s)
        };
      }
      return ex;
    }));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(prevExercises => prevExercises.map(ex => {
      if (ex.id === exerciseId) {
        const newSets = ex.sets.filter(s => s.id !== setId).map((s, idx) => ({ ...s, setNumber: idx + 1 }));
        return { ...ex, sets: newSets };
      }
      return ex;
    }));
  };

  const addExercise = (exerciseName: string) => {
    setExercises(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: exerciseName,
        sets: [{ id: Date.now().toString() + 's', setNumber: 1, weight: '', reps: '', completed: false }]
      }
    ]);
    setModalVisible(false);
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const handleFinishWorkout = async () => {
    let totalVolume = 0;
    const completedExercises: any[] = [];

    exercises.forEach(ex => {
      const completedSets = ex.sets.filter(s => s.completed && s.weight && s.reps).map(s => {
        const weightNum = parseFloat(s.weight);
        const repsNum = parseInt(s.reps, 10);
        totalVolume += weightNum * repsNum;
        return {
          id: s.id,
          reps: repsNum,
          weight: weightNum,
          completed: true
        };
      });

      if (completedSets.length > 0) {
        completedExercises.push({
          id: ex.id,
          name: ex.name,
          sets: completedSets
        });
      }
    });

    if (completedExercises.length === 0) {
      Alert.alert("Error", "Debes completar al menos una serie para guardar el entrenamiento.");
      return;
    }

    const endTime = new Date();
    const durationSeconds = workoutStartTime ? Math.floor((endTime.getTime() - workoutStartTime.getTime()) / 1000) : 0;
    
    // Formatting the date nicely
    const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    const formattedDate = endTime.toLocaleDateString('es-ES', dateOptions);

    const workout = {
      id: Date.now().toString(),
      name: 'Día de Entrenamiento',
      date: formattedDate,
      duration: durationSeconds,
      volume: totalVolume,
      exercises: completedExercises,
      prs: Math.floor(Math.random() * 3) // Mocking PRs for now
    };

    try {
      // 1. Obtener sesiones existentes
      const storedWorkouts = await AsyncStorage.getItem('workouts');
      const parsedWorkouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];
      
      // 2. Agregar la nueva sesión sin borrar las anteriores
      const newWorkoutsList = [workout, ...parsedWorkouts];
      
      // 3. Guardar usando la clave "workouts"
      await AsyncStorage.setItem('workouts', JSON.stringify(newWorkoutsList));
      
      // Reset state
      setExercises([]);
      endWorkout();
      
      router.push('/historial');
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert("Error", "No se pudo guardar el entrenamiento.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Día de Pierna</Text>
        <Text style={styles.subtitle}>En progreso • 15:42</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Pressable onPress={() => removeExercise(exercise.id)} style={styles.removeExBtn}>
                <IconSymbol name="xmark.circle.fill" size={20} color="#FF3B30" />
              </Pressable>
            </View>

            <View style={styles.tableHeader}>
              <Text style={styles.colSet}>Serie</Text>
              <Text style={styles.colWeight}>kg</Text>
              <Text style={styles.colReps}>Reps</Text>
              <Text style={styles.colCheck}>✓</Text>
            </View>

            {exercise.sets.map((set) => {
              const renderRightActions = (progress: any, dragX: any) => {
                const trans = dragX.interpolate({
                  inputRange: [-80, 0],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                });
                return (
                  <Pressable style={styles.deleteAction} onPress={() => removeSet(exercise.id, set.id)}>
                    <Animated.View style={{ transform: [{ scale: trans }] }}>
                      <IconSymbol name="trash" size={24} color="#fff" />
                    </Animated.View>
                  </Pressable>
                );
              };

              return (
                <Swipeable
                  key={set.id}
                  renderRightActions={renderRightActions}
                  overshootRight={false}
                  friction={2}
                >
                  <View style={set.completed ? styles.rowCompleted : styles.rowPending}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={styles.cellSet}>{set.setNumber}</Text>
                    </View>

                    <TextInput
                      style={[styles.inputCell, styles.cellWeight, set.completed && styles.inputCompleted]}
                      value={set.weight}
                      onChangeText={(val) => updateSet(exercise.id, set.id, 'weight', val)}
                      keyboardType="numeric"
                      placeholder="-"
                      placeholderTextColor="#999"
                      editable={!set.completed}
                    />

                    <TextInput
                      style={[styles.inputCell, styles.cellReps, set.completed && styles.inputCompleted]}
                      value={set.reps}
                      onChangeText={(val) => updateSet(exercise.id, set.id, 'reps', val)}
                      keyboardType="numeric"
                      placeholder="-"
                      placeholderTextColor="#999"
                      editable={!set.completed}
                    />

                    <Pressable
                      style={set.completed ? styles.checkDone : styles.checkPending}
                      onPress={() => toggleSetComplete(exercise.id, set.id)}
                    >
                      <IconSymbol name={set.completed ? "checkmark" : "timer"} size={14} color={set.completed ? "#fff" : "#666"} />
                    </Pressable>
                  </View>
                </Swipeable>
              );
            })}

            <Pressable style={styles.addSetButton} onPress={() => addSet(exercise.id)}>
              <Text style={styles.addSetText}>+ Añadir serie</Text>
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.addExerciseButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addExerciseText}>+ Agregar Ejercicio</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.finishButton} onPress={handleFinishWorkout}>
          <Text style={styles.finishButtonText}>Finalizar Entrenamiento</Text>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Ejercicio</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <IconSymbol name="xmark" size={24} color="#333" />
              </Pressable>
            </View>
            <FlatList
              data={mockExercisesCatalog}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable style={styles.modalItem} onPress={() => addExercise(item.name)}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  <IconSymbol name="plus.circle" size={20} color="#4A90E2" />
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
  },
  removeExBtn: {
    padding: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    marginBottom: 8,
  },
  colSet: { flex: 1, color: '#666', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  colWeight: { flex: 2, color: '#666', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  colReps: { flex: 2, color: '#666', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  colCheck: { flex: 1, color: '#666', fontSize: 12, fontWeight: '600', textAlign: 'center' },

  rowCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#F0F8F1',
    borderRadius: 8,
    marginBottom: 4,
  },
  rowPending: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
  },

  cellSet: { color: '#666', fontWeight: '500', fontSize: 16 },
  inputCell: {
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    padding: 6,
    marginHorizontal: 4,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  inputCompleted: {
    backgroundColor: 'transparent',
    color: '#666',
  },
  cellWeight: { flex: 2 },
  cellReps: { flex: 2 },

  checkDone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    height: 28,
    maxWidth: 28,
    borderRadius: 14,
    marginHorizontal: 'auto',
  },
  checkPending: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAEAEA',
    height: 28,
    maxWidth: 28,
    borderRadius: 14,
    marginHorizontal: 'auto',
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },

  addSetButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addSetText: {
    color: '#4A90E2',
    fontWeight: '600',
    fontSize: 14,
  },
  addExerciseButton: {
    backgroundColor: '#F0F6FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderStyle: 'dashed',
  },
  addExerciseText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  finishButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
});

