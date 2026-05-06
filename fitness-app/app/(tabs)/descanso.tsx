import { StyleSheet, View, Text, Pressable, Dimensions } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeContext } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function DescansoScreen() {
  const { isDark } = useThemeContext();

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textDark]}>Descanso</Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>Recuperación entre series</Text>
      </View>

      <View style={styles.content}>
        
        {/* Timer Circle */}
        <View style={[styles.timerCircle, isDark && styles.timerCircleDark]}>
          <Text style={[styles.timerText, isDark && styles.textDark]}>01:30</Text>
          <Text style={[styles.timerLabel, isDark && styles.subtitleDark]}>Restante</Text>
        </View>

        {/* Adjust Time Controls */}
        <View style={styles.controlsContainer}>
          <Pressable style={[styles.adjustButton, isDark && styles.adjustButtonDark]}>
            <Text style={[styles.adjustText, isDark && styles.textDark]}>-30s</Text>
          </Pressable>
          <Pressable style={[styles.adjustButton, isDark && styles.adjustButtonDark]}>
            <Text style={[styles.adjustText, isDark && styles.textDark]}>+30s</Text>
          </Pressable>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Pressable style={styles.mainButton}>
            <IconSymbol name="timer" size={24} color="#fff" />
            <Text style={styles.mainButtonText}>Pausar</Text>
          </Pressable>
          <Pressable style={[styles.mainButton, styles.skipButton, isDark && styles.skipButtonDark]}>
            <Text style={[styles.skipButtonText, isDark && styles.textDark]}>Omitir</Text>
          </Pressable>
        </View>

        {/* Upcoming */}
        <View style={[styles.upcomingBox, isDark && styles.upcomingBoxDark]}>
          <Text style={[styles.upcomingTitle, isDark && styles.subtitleDark]}>Siguiente Serie</Text>
          <View style={styles.upcomingDetails}>
            <Text style={[styles.upcomingExercise, isDark && styles.textDark]}>Sentadilla Libre</Text>
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
  containerDark: {
    backgroundColor: '#121212',
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
  textDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  subtitleDark: {
    color: '#AAA',
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
  timerCircleDark: {
    backgroundColor: '#1E1E1E',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.1,
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
  adjustButtonDark: {
    backgroundColor: '#333',
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
  skipButtonDark: {
    backgroundColor: '#333',
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
  upcomingBoxDark: {
    backgroundColor: '#1E1E1E',
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
