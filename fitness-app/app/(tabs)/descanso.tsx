import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions, ScrollView, Modal, TextInput } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppContext } from '@/app/context/AppContext';
import { useThemeContext } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function DescansoScreen() {
  const {
    timerTimeLeft,
    isTimerActive,
    startTimer,
    pauseTimer,
    resetTimer,
    addTimerTime,
    setTimerTime
  } = useAppContext();

  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customMin, setCustomMin] = useState('');
  const [customSec, setCustomSec] = useState('');

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSetCustomTime = () => {
    const m = parseInt(customMin) || 0;
    const s = parseInt(customSec) || 0;
    setTimerTime(m * 60 + s);
    setCustomModalVisible(false);
    setCustomMin('');
    setCustomSec('');
  };

  const PRESETS = [
    { label: '30s', value: 30 },
    { label: '60s', value: 60 },
    { label: '90s', value: 90 },
    { label: '2m', value: 120 },
    { label: '3m', value: 180 },
  ];

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
          <Text style={[styles.timerText, isDark && styles.textDark]}>{formatTime(timerTimeLeft)}</Text>
          <Text style={[styles.timerLabel, isDark && styles.subtitleDark]}>Restante</Text>
        </View>

        {/* Adjust Time Controls */}
        <View style={styles.controlsContainer}>
          <Pressable style={[styles.adjustButton, isDark && styles.adjustButtonDark]} onPress={() => addTimerTime(-30)}>
            <Text style={[styles.adjustText, isDark && styles.textDark]}>-30s</Text>
          </Pressable>
          <Pressable style={[styles.adjustButton, isDark && styles.adjustButtonDark]} onPress={() => addTimerTime(30)}>
            <Text style={[styles.adjustText, isDark && styles.textDark]}>+30s</Text>
          </Pressable>
          <Pressable style={[styles.adjustButton, isDark && styles.adjustButtonDark]} onPress={() => addTimerTime(60)}>
            <Text style={[styles.adjustText, isDark && styles.textDark]}>+1min</Text>
          </Pressable>
        </View>

        {/* Presets */}
        <View style={styles.presetsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsContent}>
            {PRESETS.map((preset) => (
              <Pressable
                key={preset.label}
                style={[styles.presetButton, isDark && styles.adjustButtonDark]}
                onPress={() => setTimerTime(preset.value)}
              >
                <Text style={[styles.presetText, isDark && styles.textDark]}>{preset.label}</Text>
              </Pressable>
            ))}
            <Pressable style={[styles.presetButton, isDark && styles.adjustButtonDark]} onPress={() => setCustomModalVisible(true)}>
              <Text style={[styles.presetText, isDark && styles.textDark]}>Personalizado</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Pressable
            style={[styles.mainButton, isTimerActive ? styles.pauseButton : styles.startButton]}
            onPress={() => isTimerActive ? pauseTimer() : startTimer()}
          >
            <IconSymbol name={isTimerActive ? "pause.fill" : "play.fill"} size={24} color="#fff" />
            <Text style={styles.mainButtonText}>{isTimerActive ? 'Pausar' : 'Iniciar'}</Text>
          </Pressable>
          <Pressable style={[styles.mainButton, styles.resetButton]} onPress={resetTimer}>
            <IconSymbol name="arrow.counterclockwise" size={24} color="#333" />
            <Text style={styles.resetButtonText}>Reiniciar</Text>
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

      {/* Custom Time Modal */}
      <Modal visible={customModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tiempo Personalizado</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="00"
                maxLength={2}
                value={customMin}
                onChangeText={setCustomMin}
              />
              <Text style={styles.colon}>:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="00"
                maxLength={2}
                value={customSec}
                onChangeText={setCustomSec}
              />
            </View>
            <View style={styles.modalActions}>
              <Pressable onPress={() => setCustomModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={handleSetCustomTime} style={[styles.modalButton, styles.modalButtonPrimary]}>
                <Text style={styles.modalButtonTextPrimary}>Aceptar</Text>
              </Pressable>
            </View>
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
  startButton: {
    backgroundColor: '#4A90E2',
  },
  pauseButton: {
    backgroundColor: '#F39C12',
  },
  resetButton: {
    backgroundColor: '#EAEAEA',
  },
  resetButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  presetsWrapper: {
    width: '100%',
    marginBottom: 30,
  },
  presetsContent: {
    gap: 12,
    paddingHorizontal: 4,
  },
  presetButton: {
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1A1A1A',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    fontSize: 24,
    padding: 12,
    width: 60,
    textAlign: 'center',
  },
  colon: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  modalButtonPrimary: {
    backgroundColor: '#4A90E2',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  modalButtonTextPrimary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
