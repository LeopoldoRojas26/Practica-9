import { StyleSheet, ScrollView, View, Text, Pressable, TextInput } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeContext } from '@/context/ThemeContext';

export default function EjerciciosScreen() {
  const { isDark } = useThemeContext();
  const categories = ['Todos', 'Pecho', 'Espalda', 'Pierna', 'Hombro', 'Bíceps', 'Tríceps', 'Core'];
  
  const mockExercises = [
    { id: 1, name: 'Press de Banca', muscle: 'Pecho', equipment: 'Barra' },
    { id: 2, name: 'Sentadilla Libre', muscle: 'Pierna', equipment: 'Barra' },
    { id: 3, name: 'Dominadas', muscle: 'Espalda', equipment: 'Peso Corporal' },
    { id: 4, name: 'Press Militar', muscle: 'Hombro', equipment: 'Mancuernas' },
    { id: 5, name: 'Curl de Bíceps', muscle: 'Bíceps', equipment: 'Mancuernas' },
    { id: 6, name: 'Extensión de Tríceps', muscle: 'Tríceps', equipment: 'Polea' },
    { id: 7, name: 'Prensa en Máquina', muscle: 'Pierna', equipment: 'Máquina' },
    { id: 8, name: 'Remo con Barra', muscle: 'Espalda', equipment: 'Barra' },
  ];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Text style={[styles.title, isDark && styles.textDark]}>Ejercicios</Text>
        
        <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
          <IconSymbol name="list.bullet" size={20} color="#999" />
          <TextInput 
            style={[styles.searchInput, isDark && styles.searchInputDark]}
            placeholder="Buscar ejercicio..."
            placeholderTextColor={isDark ? "#888" : "#999"}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {categories.map((cat, index) => (
            <Pressable 
              key={index} 
              style={[
                styles.filterChip, 
                isDark && styles.filterChipDark,
                index === 0 ? styles.filterChipActive : null
              ]}
            >
              <Text style={[
                styles.filterText,
                isDark && styles.filterTextDark,
                index === 0 ? styles.filterTextActive : null
              ]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {mockExercises.map((exercise) => (
          <Pressable key={exercise.id} style={[styles.exerciseCard, isDark && styles.cardDark]}>
            <View style={[styles.exerciseImagePlaceholder, isDark && styles.exerciseImagePlaceholderDark]}>
              <IconSymbol name="figure.run" size={24} color={isDark ? "#888" : "#A0A0A0"} />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={[styles.exerciseName, isDark && styles.textDark]}>{exercise.name}</Text>
              <View style={styles.exerciseTags}>
                <View style={[styles.tag, isDark && styles.tagDark]}>
                  <Text style={styles.tagText}>{exercise.muscle}</Text>
                </View>
                <View style={[styles.tag, isDark && styles.tagDark]}>
                  <Text style={styles.tagText}>{exercise.equipment}</Text>
                </View>
              </View>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#C7C7CC" />
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
  headerDark: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  textDark: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchContainerDark: {
    backgroundColor: '#333',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  searchInputDark: {
    color: '#FFF',
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  filterChipDark: {
    backgroundColor: '#333',
  },
  filterChipActive: {
    backgroundColor: '#4A90E2',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterTextDark: {
    color: '#AAA',
  },
  filterTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1E1E1E',
  },
  exerciseImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  exerciseImagePlaceholderDark: {
    backgroundColor: '#333',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  exerciseTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F0F6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagDark: {
    backgroundColor: '#2A3A4A',
  },
  tagText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
});
