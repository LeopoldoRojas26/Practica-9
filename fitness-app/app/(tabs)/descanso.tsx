import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

export default function DescansoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Descanso</Text>
        <Text style={styles.subtitle}>Recuperación entre series</Text>
      </View>

      <View style={styles.content}>
        
        {/* Timer Circle */}
        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>01:30</Text>
          <Text style={styles.timerLabel}>Restante</Text>
        </View>

        {/* Adjust Time Controls */}
        <View style={styles.controlsContainer}>
          <Pressable style={styles.adjustButton}>
            <Text style={styles.adjustText}>-30s</Text>
          </Pressable>
          <Pressable style={styles.adjustButton}>
            <Text style={styles.adjustText}>+30s</Text>
          </Pressable>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Pressable style={styles.mainButton}>
            <IconSymbol name="timer" size={24} color="#fff" />
            <Text style={styles.mainButtonText}>Pausar</Text>
          </Pressable>
          <Pressable style={[styles.mainButton, styles.skipButton]}>
            <Text style={styles.skipButtonText}>Omitir</Text>
          </Pressable>
        </View>

        {/* Upcoming */}
        <View style={styles.upcomingBox}>
          <Text style={styles.upcomingTitle}>Siguiente Serie</Text>
          <View style={styles.upcomingDetails}>
            <Text style={styles.upcomingExercise}>Sentadilla Libre</Text>
            <Text style={styles.upcomingReps}>100kg x 8 reps</Text>
          </View>
        </View>

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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  timerCircle: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    borderWidth: 8,
    borderColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 40,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginTop: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  adjustButton: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  adjustText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginBottom: 40,
  },
  mainButton: {
    flex: 1,
    backgroundColor: '#F39C12',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: '#EAEAEA',
  },
  skipButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  upcomingBox: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  upcomingTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  upcomingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upcomingExercise: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  upcomingReps: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
});
