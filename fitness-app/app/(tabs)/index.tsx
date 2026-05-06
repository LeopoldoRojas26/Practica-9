import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from '@/components/ui/icon-symbol';
import WaterTracker from '@/components/WaterTracker';
import { useThemeContext } from '@/context/ThemeContext';

export default function InicioScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useThemeContext();
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [userName, setUserName] = useState('Usuario');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await AsyncStorage.getItem('userProfile');
        if (profile) {
          const parsed = JSON.parse(profile);
          setUserName(parsed.name || 'Usuario');
        } else {
          setShowOnboarding(true);
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();
  }, []);

  const saveProfile = async () => {
    if (!name.trim()) return;
    try {
      const profile = { name, weight, age };
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      setUserName(name);
      setShowOnboarding(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, isDark ? styles.containerDark : styles.containerLight]} 
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, isDark ? styles.textDark : styles.textLight]}>
            Hola, {userName} 👋
          </Text>
          <Text style={[styles.subtitle, isDark ? styles.subtitleDark : styles.subtitleLight]}>
            Lista para tu próximo reto?
          </Text>
        </View>
        <Pressable onPress={toggleTheme} style={[styles.settingsButton, isDark ? styles.settingsButtonDark : styles.settingsButtonLight]}>
          <IconSymbol 
            name={isDark ? "moon.fill" : "sun.max.fill"} 
            size={24} 
            color={isDark ? "#F1F1F1" : "#F39C12"} 
          />
        </Pressable>
      </View>

      <WaterTracker />

      <View style={styles.statsContainer}>
        <View style={[styles.statBox, isDark ? styles.cardDark : styles.cardLight]}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={[styles.statLabel, isDark ? styles.subtitleDark : styles.subtitleLight]}>Entrenos esta sem.</Text>
        </View>
        <View style={[styles.statBox, isDark ? styles.cardDark : styles.cardLight]}>
          <Text style={styles.statNumber}>320</Text>
          <Text style={[styles.statLabel, isDark ? styles.subtitleDark : styles.subtitleLight]}>Minutos activos</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>Acceso Rápido</Text>

      <View style={styles.cardsContainer}>
        <Pressable style={[styles.card, styles.cardPrimary]} onPress={() => router.push('/entrenar')}>
          <IconSymbol name="figure.run" size={32} color="#fff" />
          <Text style={styles.cardTitleLight}>Empezar a Entrenar</Text>
          <Text style={styles.cardSubLight}>Día de Pierna - 45 min</Text>
        </Pressable>

        <View style={styles.rowCards}>
          <Pressable style={[styles.cardSmall, isDark ? styles.cardDark : styles.cardLight]} onPress={() => router.push('/historial')}>
            <IconSymbol name="clock.fill" size={28} color="#4A90E2" />
            <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLight]}>Historial</Text>
            <Text style={[styles.cardSub, isDark ? styles.subtitleDark : styles.subtitleLight]}>Último: Ayer</Text>
          </Pressable>

          <Pressable style={[styles.cardSmall, isDark ? styles.cardDark : styles.cardLight]} onPress={() => router.push('/ejercicios')}>
            <IconSymbol name="list.bullet" size={28} color="#E24A75" />
            <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLight]}>Ejercicios</Text>
            <Text style={[styles.cardSub, isDark ? styles.subtitleDark : styles.subtitleLight]}>Explorar</Text>
          </Pressable>
        </View>

        <Pressable style={[styles.cardDescanso, isDark ? styles.cardDark : styles.cardLight]} onPress={() => router.push('/descanso')}>
          <View style={styles.descansoLeft}>
            <IconSymbol name="timer" size={28} color="#F39C12" />
            <View style={styles.descansoText}>
              <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLight]}>Descanso Actual</Text>
              <Text style={[styles.cardSub, isDark ? styles.subtitleDark : styles.subtitleLight]}>Recuperación óptima</Text>
            </View>
          </View>
          <Text style={styles.descansoTime}>00:00</Text>
        </Pressable>
      </View>

      {/* Onboarding Modal */}
      <Modal
        visible={showOnboarding}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark ? styles.modalContentDark : styles.modalContentLight]}>
            <Text style={[styles.modalTitle, isDark ? styles.textDark : styles.textLight]}>¡Bienvenido!</Text>
            <Text style={[styles.modalSubtitle, isDark ? styles.subtitleDark : styles.subtitleLight]}>Cuéntanos un poco sobre ti</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, isDark ? styles.textDark : styles.textLight]}>Nombre</Text>
              <TextInput
                style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                placeholder="Ej. Martha"
                placeholderTextColor={isDark ? "#888" : "#999"}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.inputLabel, isDark ? styles.textDark : styles.textLight]}>Peso (kg)</Text>
                <TextInput
                  style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                  placeholder="Ej. 65"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 16 }]}>
                <Text style={[styles.inputLabel, isDark ? styles.textDark : styles.textLight]}>Edad</Text>
                <TextInput
                  style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
                  placeholder="Ej. 28"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Pressable 
              style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]} 
              onPress={saveProfile}
              disabled={!name.trim()}
            >
              <Text style={styles.saveButtonText}>Guardar Perfil</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#F7F9FC',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  settingsButton: {
    padding: 10,
    borderRadius: 20,
  },
  settingsButtonLight: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsButtonDark: {
    backgroundColor: '#1E1E1E',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  textLight: {
    color: '#1A1A1A',
  },
  textDark: {
    color: '#FFFFFF',
  },
  subtitleLight: {
    color: '#666',
  },
  subtitleDark: {
    color: '#AAA',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
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
  cardLight: {
    backgroundColor: '#fff',
  },
  cardDark: {
    backgroundColor: '#1E1E1E',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    marginTop: 12,
  },
  cardSub: {
    fontSize: 13,
    marginTop: 4,
  },
  cardDescanso: {
    flexDirection: 'row',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 24,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalContentLight: {
    backgroundColor: '#fff',
  },
  modalContentDark: {
    backgroundColor: '#1E1E1E',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputLight: {
    backgroundColor: '#F0F0F0',
    color: '#333',
  },
  inputDark: {
    backgroundColor: '#2A2A2A',
    color: '#FFF',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#A0C4E8',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
