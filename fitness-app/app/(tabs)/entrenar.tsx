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

const WORKOUT_TEMPLATES = [
  {
    id: 't1',
    name: 'Rutina Torso',
    icon: 'figure.run',
    color: '#4A90E2',
    exercises: [
      { name: 'Press de Banca', setsCount: 4 },
      { name: 'Dominadas', setsCount: 4 },
      { name: 'Press Militar', setsCount: 3 },
      { name: 'Remo con Barra', setsCount: 3 },
    ]
  },
  {
    id: 't2',
    name: 'Rutina Pierna',
    icon: 'figure.run',
    color: '#F39C12',
    exercises: [
      { name: 'Sentadilla Libre', setsCount: 4 },
      { name: 'Prensa en Máquina', setsCount: 3 },
      { name: 'Curl Femoral', setsCount: 3 },
      { name: 'Elevación de Talones', setsCount: 4 },
    ]
  },
  {
    id: 't3',
    name: 'Rutina Push',
    icon: 'figure.run',
    color: '#E24A75',
    exercises: [
      { name: 'Press Inclinado', setsCount: 4 },
      { name: 'Aperturas', setsCount: 3 },
      { name: 'Elevaciones Laterales', setsCount: 4 },
      { name: 'Extensión de Tríceps', setsCount: 3 },
    ]
  },
  {
    id: 't4',
    name: 'Rutina Pull',
    icon: 'figure.run',
    color: '#9B59B6',
    exercises: [
      { name: 'Peso Muerto', setsCount: 4 },
      { name: 'Jalón al Pecho', setsCount: 3 },
      { name: 'Remo Gironda', setsCount: 3 },
      { name: 'Curl de Bíceps', setsCount: 4 },
    ]
  },
  {
    id: 't5',
    name: 'Full Body',
    icon: 'figure.run',
    color: '#34C759',
    exercises: [
      { name: 'Sentadilla Libre', setsCount: 3 },
      { name: 'Press de Banca', setsCount: 3 },
      { name: 'Remo con Barra', setsCount: 3 },
      { name: 'Press Militar', setsCount: 3 },
    ]
  }
];

export default function EntrenarScreen() {
  const router = useRouter();
  const { isWorkoutActive, workoutName, workoutStartTime, startWorkout, endWorkout } = useAppContext();

  const [exercises, setExercises] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleStartTemplate = (template: typeof WORKOUT_TEMPLATES[0]) => {
    const loadedExercises = template.exercises.map((ex, i) => ({
      id: `ex_${Date.now()}_${i}`,
      name: ex.name,
      sets: Array.from({ length: ex.setsCount }).map((_, j) => ({
        id: `s_${Date.now()}_${i}_${j}`,
        setNumber: j + 1,
        weight: '',
        reps: '',
        completed: false
      }))
    }));
    setExercises(loadedExercises);
    startWorkout(template.name);
  };

  const handleStartEmpty = () => {
    setExercises([]);
    startWorkout('Entrenamiento Libre');
  };

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
      name: workoutName,
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

  const getWorkoutTimeStr = () => {
    if (!workoutStartTime) return '0:00';
    const now = new Date();
    const diffSecs = Math.floor((now.getTime() - workoutStartTime.getTime()) / 1000);
    const m = Math.floor(diffSecs / 60);
    const s = diffSecs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleChangeWorkout = () => {
    Alert.alert(
      "Cambiar entrenamiento",
      "¿Estás seguro de que quieres cancelar este entrenamiento? Se perderá el progreso actual.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cambiar",
          style: "destructive",
          onPress: () => {
            setExercises([]);
            endWorkout();
          }
        }
      ]
    );
  };

  if (!isWorkoutActive) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Entrenar</Text>
          <Text style={styles.subtitle}>Elige una plantilla o inicia libre</Text>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.templatesContent}>
          <Pressable style={styles.emptyWorkoutBtn} onPress={handleStartEmpty}>
            <IconSymbol name="plus" size={24} color="#fff" />
            <Text style={styles.emptyWorkoutText}>Entrenamiento Libre</Text>
          </Pressable>

          <Text style={styles.templatesSectionTitle}>Plantillas Sugeridas</Text>

          <View style={styles.templatesGrid}>
            {WORKOUT_TEMPLATES.map((template) => (
              <Pressable
                key={template.id}
                style={styles.templateCard}
                onPress={() => handleStartTemplate(template)}
              >
                <View style={[styles.templateIconBox, { backgroundColor: template.color }]}>
                  <IconSymbol name={template.icon as any} size={24} color="#fff" />
                </View>
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDetails}>{template.exercises.length} Ejercicios</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View>
          <Text style={styles.title}>{workoutName}</Text>
          <Text style={styles.subtitle}>En progreso • {getWorkoutTimeStr()}</Text>
        </View>
        <Pressable onPress={handleChangeWorkout} style={styles.changeBtn}>
          <Text style={styles.changeBtnText}>Cambiar</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {exercises.map((exercise) => (
          <View key={exercise.id} style={[styles.exerciseCard, isDark && styles.cardDark]}>
            <View style={styles.exerciseHeader}>
              <Text style={[styles.exerciseName, isDark && styles.textDark]}>{exercise.name}</Text>
              <Pressable onPress={() => removeExercise(exercise.id)} style={styles.removeExBtn}>
                <IconSymbol name="xmark.circle.fill" size={20} color="#FF3B30" />
              </Pressable>
            </View>

            <View style={[styles.tableHeader, isDark && styles.borderDark]}>
              <Text style={[styles.colSet, isDark && styles.colDark]}>Serie</Text>
              <Text style={[styles.colWeight, isDark && styles.colDark]}>kg</Text>
              <Text style={[styles.colReps, isDark && styles.colDark]}>Reps</Text>
              <Text style={[styles.colCheck, isDark && styles.colDark]}>✓</Text>
            </View>

            {exercise.sets.map((set: any) => {
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
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && styles.textDark]}>Seleccionar Ejercicio</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <IconSymbol name="xmark" size={24} color={isDark ? "#FFF" : "#333"} />
              </Pressable>
            </View>
            <FlatList
              data={mockExercisesCatalog}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable style={[styles.modalItem, isDark && styles.borderDark]} onPress={() => addExercise(item.name)}>
                  <Text style={[styles.modalItemText, isDark && styles.textDark]}>{item.name}</Text>
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
  headerDark: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  textDark: {
    color: '#FFFFFF',
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
  cardDark: {
    backgroundColor: '#1E1E1E',
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
  borderDark: {
    borderBottomColor: '#333333',
  },
  colSet: { flex: 1, color: '#666', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  colWeight: { flex: 2, color: '#666', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  colReps: { flex: 2, color: '#666', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  colCheck: { flex: 1, color: '#666', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  colDark: { color: '#AAA' },

  rowCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#F0F8F1',
    borderRadius: 8,
    marginBottom: 4,
  },
  rowCompletedDark: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  rowPending: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  rowPendingDark: {
    backgroundColor: '#2A2A2A',
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
  inputCellDark: {
    backgroundColor: '#333',
    color: '#FFF',
  },
  inputCompleted: {
    backgroundColor: 'transparent',
    color: '#666',
  },
  inputCompletedDark: {
    backgroundColor: 'transparent',
    color: '#888',
  },
  cellWeight: { flex: 2 },
  cellReps: { flex: 2 },

  changeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
  },
  changeBtnText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: 'bold',
  },

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
  footerDark: {
    backgroundColor: '#1E1E1E',
    borderTopColor: '#333',
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
  modalContentDark: {
    backgroundColor: '#1E1E1E',
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
  templatesContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyWorkoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyWorkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  templatesSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  templateCard: {
    backgroundColor: '#fff',
    width: '47%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  templateIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  templateName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  templateDetails: {
    fontSize: 12,
    color: '#666',
  },
});

