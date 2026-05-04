import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EntrenarScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Día de Pierna</Text>
        <Text style={styles.subtitle}>En progreso • 15:42</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        
        {/* Ejercicio 1 */}
        <View style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>Sentadilla Libre</Text>
            <IconSymbol name="list.bullet" size={20} color="#666" />
          </View>
          
          <View style={styles.tableHeader}>
            <Text style={styles.colSet}>Serie</Text>
            <Text style={styles.colWeight}>kg</Text>
            <Text style={styles.colReps}>Reps</Text>
            <Text style={styles.colCheck}>✓</Text>
          </View>

          <View style={styles.rowCompleted}>
            <Text style={styles.cellSet}>1</Text>
            <Text style={styles.cellWeight}>80</Text>
            <Text style={styles.cellReps}>12</Text>
            <View style={styles.checkDone}>
              <IconSymbol name="timer" size={14} color="#fff" />
            </View>
          </View>

          <View style={styles.rowCompleted}>
            <Text style={styles.cellSet}>2</Text>
            <Text style={styles.cellWeight}>90</Text>
            <Text style={styles.cellReps}>10</Text>
            <View style={styles.checkDone}>
              <IconSymbol name="timer" size={14} color="#fff" />
            </View>
          </View>

          <View style={styles.rowActive}>
            <Text style={styles.cellSetActive}>3</Text>
            <Text style={styles.cellWeightActive}>100</Text>
            <Text style={styles.cellRepsActive}>8</Text>
            <View style={styles.checkPending}>
              <IconSymbol name="timer" size={14} color="#666" />
            </View>
          </View>
          
          <Pressable style={styles.addSetButton}>
            <Text style={styles.addSetText}>+ Añadir serie</Text>
          </Pressable>
        </View>

        {/* Ejercicio 2 */}
        <View style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>Prensa en Máquina</Text>
            <IconSymbol name="list.bullet" size={20} color="#666" />
          </View>
          
          <View style={styles.tableHeader}>
            <Text style={styles.colSet}>Serie</Text>
            <Text style={styles.colWeight}>kg</Text>
            <Text style={styles.colReps}>Reps</Text>
            <Text style={styles.colCheck}>✓</Text>
          </View>

          <View style={styles.rowPending}>
            <Text style={styles.cellSet}>1</Text>
            <Text style={styles.cellWeight}>120</Text>
            <Text style={styles.cellReps}>12</Text>
            <View style={styles.checkPending} />
          </View>

          <View style={styles.rowPending}>
            <Text style={styles.cellSet}>2</Text>
            <Text style={styles.cellWeight}>140</Text>
            <Text style={styles.cellReps}>10</Text>
            <View style={styles.checkPending} />
          </View>

          <Pressable style={styles.addSetButton}>
            <Text style={styles.addSetText}>+ Añadir serie</Text>
          </Pressable>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Finalizar Entrenamiento</Text>
        </Pressable>
      </View>
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
    paddingVertical: 12,
    backgroundColor: '#F0F8F1',
    borderRadius: 8,
    marginBottom: 4,
  },
  rowActive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#F0F6FF',
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  rowPending: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 4,
  },
  
  cellSet: { flex: 1, textAlign: 'center', color: '#666', fontWeight: '500' },
  cellWeight: { flex: 2, textAlign: 'center', fontSize: 16, fontWeight: '600' },
  cellReps: { flex: 2, textAlign: 'center', fontSize: 16, fontWeight: '600' },
  
  cellSetActive: { flex: 1, textAlign: 'center', color: '#4A90E2', fontWeight: 'bold' },
  cellWeightActive: { flex: 2, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  cellRepsActive: { flex: 2, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },

  checkDone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    height: 24,
    maxWidth: 24,
    borderRadius: 12,
    marginHorizontal: 'auto',
  },
  checkPending: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAEAEA',
    height: 24,
    maxWidth: 24,
    borderRadius: 12,
    marginHorizontal: 'auto',
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
});
