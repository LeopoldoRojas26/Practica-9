import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Pressable, TextInput, Modal, Dimensions } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { height } = Dimensions.get('window');

type Suggestion = {
  principiante: string;
  profesional: string;
};

type Exercise = {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  description: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  benefits: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  tips?: string[];
  suggestedWeight?: Suggestion;
  suggestedReps?: Suggestion;
};

export const EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Press de Banca Plano',
    muscle: 'Pecho',
    equipment: 'Barra',
    description: 'Acuéstate en el banco, agarra la barra un poco más ancho que los hombros. Baja la barra hasta el pecho y empuja hacia arriba.',
    primaryMuscles: ['Pectoral mayor'],
    secondaryMuscles: ['Tríceps', 'Deltoides anterior'],
    benefits: 'Desarrolla la fuerza y el tamaño de la parte superior del cuerpo.',
    level: 'Intermedio',
    tips: ['Mantén los pies firmes en el suelo', 'Retrae las escápulas (junta los omóplatos)', 'La barra debe tocar la parte inferior del pecho'],
    suggestedWeight: {
      principiante: 'Hombres: 20-30kg | Mujeres: Barra sola (10-15kg)',
      profesional: 'Hombres: 80-100kg+ | Mujeres: 40-60kg+'
    },
    suggestedReps: {
      principiante: '3 series de 10-12 repeticiones',
      profesional: '4-5 series de 5-8 repeticiones'
    }
  },
  {
    id: '2',
    name: 'Flexiones',
    muscle: 'Pecho',
    equipment: 'Peso Corporal',
    description: 'En posición de plancha, baja el cuerpo flexionando los brazos hasta que el pecho casi toque el suelo y vuelve a subir.',
    primaryMuscles: ['Pectoral mayor'],
    secondaryMuscles: ['Tríceps', 'Deltoides anterior', 'Core'],
    benefits: 'Mejora la fuerza del tren superior sin necesidad de equipamiento.',
    level: 'Principiante',
    tips: ['Mantén el core apretado para no curvar la espalda baja', 'Los codos deben ir a unos 45 grados respecto a tu torso', 'Evita dejar caer la cabeza'],
    suggestedWeight: {
      principiante: 'Peso corporal (apoyando rodillas si es necesario)',
      profesional: 'Peso corporal con chaleco lastrado o discos'
    },
    suggestedReps: {
      principiante: '3 series de 5-10 repeticiones',
      profesional: '4 series de 20-30+ repeticiones'
    }
  },
  {
    id: '3',
    name: 'Dominadas',
    muscle: 'Espalda',
    equipment: 'Peso Corporal',
    description: 'Cuélgate de una barra con agarre prono. Tira de tu cuerpo hacia arriba hasta que la barbilla pase la barra.',
    primaryMuscles: ['Dorsal ancho'],
    secondaryMuscles: ['Bíceps', 'Romboides'],
    benefits: 'Excelente para desarrollar la amplitud y fuerza de la espalda.',
    level: 'Intermedio',
    tips: ['Usa un rango de movimiento completo, estirando bien los brazos al bajar', 'Inicia el movimiento tirando de los codos hacia abajo y atrás', 'Trata de llevar el pecho a la barra'],
    suggestedWeight: {
      principiante: 'Máquina asistida o bandas elásticas',
      profesional: 'Peso corporal + lastre (10-20kg)'
    },
    suggestedReps: {
      principiante: '3 series de 5-8 repeticiones',
      profesional: '4 series de 10-15 repeticiones'
    }
  },
  {
    id: '4',
    name: 'Remo con Barra',
    muscle: 'Espalda',
    equipment: 'Barra',
    description: 'Inclina el torso hacia adelante manteniendo la espalda recta. Tira de la barra hacia tu abdomen contrayendo la espalda.',
    primaryMuscles: ['Dorsal ancho', 'Romboides'],
    secondaryMuscles: ['Bíceps', 'Erectores espinales'],
    benefits: 'Añade grosor a la espalda y mejora la postura.',
    level: 'Intermedio',
    tips: ['Mantén la espalda recta casi paralela al suelo', 'Tira de los codos hacia atrás rozando las costillas', 'Controla el peso al bajar'],
    suggestedWeight: {
      principiante: 'Hombres: 20-30kg | Mujeres: 10-15kg',
      profesional: 'Hombres: 60-100kg+ | Mujeres: 40-60kg+'
    },
    suggestedReps: {
      principiante: '3 series de 10-12 repeticiones',
      profesional: '4 series de 6-10 repeticiones pesadas'
    }
  },
  {
    id: '5',
    name: 'Sentadilla Libre',
    muscle: 'Piernas',
    equipment: 'Barra',
    description: 'Con la barra en la espalda alta, desciende flexionando rodillas y caderas hasta romper el paralelo, luego sube.',
    primaryMuscles: ['Cuádriceps', 'Glúteos'],
    secondaryMuscles: ['Isquiotibiales', 'Core'],
    benefits: 'El ejercicio rey para el desarrollo general de las piernas y fuerza del core.',
    level: 'Intermedio',
    tips: ['Mantén la mirada al frente y el pecho levantado', 'Abre ligeramente las puntas de los pies y empuja las rodillas hacia afuera al bajar', 'El peso debe apoyarse en la parte media del pie y los talones'],
    suggestedWeight: {
      principiante: 'Hombres: 20-40kg | Mujeres: Barra sola o 20kg',
      profesional: 'Hombres: 100-140kg+ | Mujeres: 60-90kg+'
    },
    suggestedReps: {
      principiante: '3 series de 10-12 repeticiones',
      profesional: '4-5 series de 5-8 repeticiones'
    }
  },
  {
    id: '6',
    name: 'Prensa Inclinada',
    muscle: 'Piernas',
    equipment: 'Máquina',
    description: 'Siéntate en la máquina, coloca los pies en la plataforma y empuja el peso extendiendo las piernas sin bloquear las rodillas.',
    primaryMuscles: ['Cuádriceps'],
    secondaryMuscles: ['Glúteos', 'Isquiotibiales'],
    benefits: 'Permite mover mucho peso de forma segura para las piernas.',
    level: 'Principiante',
    tips: ['Baja hasta que tus rodillas formen un ángulo de 90 grados', 'NUNCA bloquees (hiperextiendas) las rodillas al estirar las piernas', 'Empuja principalmente con los talones'],
    suggestedWeight: {
      principiante: 'Hombres: 40-80kg | Mujeres: 20-40kg',
      profesional: 'Hombres: 200kg+ | Mujeres: 120kg+'
    },
    suggestedReps: {
      principiante: '3 series de 12-15 repeticiones',
      profesional: '4 series de 8-12 repeticiones pesadas'
    }
  },
  {
    id: '7',
    name: 'Press Militar',
    muscle: 'Hombros',
    equipment: 'Barra',
    description: 'De pie o sentado, empuja la barra desde la altura de las clavículas hasta extender los brazos por encima de la cabeza.',
    primaryMuscles: ['Deltoides anterior', 'Deltoides medio'],
    secondaryMuscles: ['Tríceps', 'Core'],
    benefits: 'Desarrolla hombros fuertes y mejora la fuerza de empuje vertical.',
    level: 'Intermedio',
    tips: ['Aprieta glúteos y abdomen para proteger tu zona lumbar', 'La barra debe subir en línea recta, pasando muy cerca de la cara', 'Mete ligeramente la cabeza debajo de la barra al finalizar el empuje'],
    suggestedWeight: {
      principiante: 'Hombres: 10-20kg | Mujeres: Mancuernas ligeras (2-4kg)',
      profesional: 'Hombres: 50-80kg+ | Mujeres: 30-40kg+'
    },
    suggestedReps: {
      principiante: '3 series de 10-12 repeticiones',
      profesional: '4 series de 6-8 repeticiones'
    }
  },
  {
    id: '8',
    name: 'Elevaciones Laterales',
    muscle: 'Hombros',
    equipment: 'Mancuernas',
    description: 'De pie, levanta las mancuernas hacia los lados hasta que los brazos estén paralelos al suelo, con una ligera flexión de codo.',
    primaryMuscles: ['Deltoides medio'],
    secondaryMuscles: ['Trapecio'],
    benefits: 'Aísla el hombro lateral para dar un aspecto más ancho.',
    level: 'Principiante',
    tips: ['Imagina que estás sirviendo agua de unas jarras en el punto más alto', 'Mantén una ligera flexión en los codos', 'No uses impulso con tu espalda, si balanceas baja el peso'],
    suggestedWeight: {
      principiante: 'Hombres: 5kg | Mujeres: 2-3kg',
      profesional: 'Hombres: 15-20kg | Mujeres: 8-12kg'
    },
    suggestedReps: {
      principiante: '3 series de 12-15 repeticiones',
      profesional: '4 series de 10-15 repeticiones (con dropsets)'
    }
  },
  {
    id: '9',
    name: 'Curl de Bíceps',
    muscle: 'Brazos',
    equipment: 'Mancuernas',
    description: 'De pie, con una mancuerna en cada mano, flexiona los codos para llevar el peso hacia los hombros y baja controlado.',
    primaryMuscles: ['Bíceps braquial'],
    secondaryMuscles: ['Braquial', 'Antebrazos'],
    benefits: 'Desarrolla el tamaño y fuerza de los bíceps.',
    level: 'Principiante',
    tips: ['Mantén los codos fijos a los lados de tu torso, no los subas', 'Controla mucho la fase de bajada (fase excéntrica)', 'Evita balancear el cuerpo hacia atrás al subir el peso'],
    suggestedWeight: {
      principiante: 'Hombres: 5-8kg | Mujeres: 3-5kg',
      profesional: 'Hombres: 18-25kg | Mujeres: 10-15kg'
    },
    suggestedReps: {
      principiante: '3 series de 10-12 repeticiones',
      profesional: '4 series de 8-10 repeticiones estricto'
    }
  },
  {
    id: '10',
    name: 'Extensión de Tríceps',
    muscle: 'Brazos',
    equipment: 'Polea',
    description: 'De pie frente a una polea alta, empuja el agarre hacia abajo extendiendo los codos por completo.',
    primaryMuscles: ['Tríceps braquial'],
    secondaryMuscles: [],
    benefits: 'Aísla el tríceps para mejorar el empuje y dar volumen al brazo.',
    level: 'Principiante',
    tips: ['Mantén los codos pegados a tus costillas en todo momento', 'Al final del recorrido (abajo), separa un poco los extremos de la cuerda si usas ese agarre', 'Sube lentamente resistiendo el peso'],
    suggestedWeight: {
      principiante: 'Hombres: 10-15kg | Mujeres: 5-10kg',
      profesional: 'Hombres: 35-50kg+ | Mujeres: 20-30kg+'
    },
    suggestedReps: {
      principiante: '3 series de 12-15 repeticiones',
      profesional: '4 series de 10-12 repeticiones'
    }
  },
  {
    id: '11',
    name: 'Plancha Abdominal',
    muscle: 'Core',
    equipment: 'Peso Corporal',
    description: 'Apoya los antebrazos y las puntas de los pies en el suelo, manteniendo el cuerpo en línea recta y el abdomen contraído.',
    primaryMuscles: ['Recto abdominal', 'Transverso abdominal'],
    secondaryMuscles: ['Hombros', 'Glúteos'],
    benefits: 'Mejora la estabilidad del core y la resistencia isométrica.',
    level: 'Principiante',
    tips: ['Mantén una línea recta desde la cabeza hasta los talones', 'No dejes caer la cadera ni la eleves demasiado', 'Respira de manera normal y constante, apretando fuerte el abdomen'],
    suggestedWeight: {
      principiante: 'Peso corporal (rodillas apoyadas si es necesario)',
      profesional: 'Disco de 10-20kg en la espalda'
    },
    suggestedReps: {
      principiante: '3 series de 20-30 segundos',
      profesional: '4 series de 1.5 - 2 minutos'
    }
  },
  {
    id: '12',
    name: 'Crunch Abdominal',
    muscle: 'Core',
    equipment: 'Peso Corporal',
    description: 'Acostado boca arriba con rodillas flexionadas, eleva ligeramente los hombros del suelo contrayendo el abdomen.',
    primaryMuscles: ['Recto abdominal'],
    secondaryMuscles: ['Oblicuos'],
    benefits: 'Ejercicio básico para la activación de la parte frontal del abdomen.',
    level: 'Principiante',
    tips: ['Concéntrate en apretar el abdomen, NO tires de tu cuello ni cabeza con las manos', 'Expulsa el aire al contraer y subir', 'No necesitas subir demasiado, solo lo suficiente para contraer el abdomen'],
    suggestedWeight: {
      principiante: 'Peso corporal',
      profesional: 'Sujetando disco de 10-15kg en el pecho'
    },
    suggestedReps: {
      principiante: '3 series de 15-20 repeticiones',
      profesional: '4 series de 20-30 repeticiones'
    }
  }
];

export default function EjerciciosScreen() {
  const categories = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [suggestionLevel, setSuggestionLevel] = useState<'principiante' | 'profesional'>('principiante');

  const filteredExercises = EXERCISES.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || exercise.muscle === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getLevelColor = (level: string) => {
    if (level === 'Principiante') return '#4CAF50';
    if (level === 'Intermedio') return '#FF9800';
    return '#F44336';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ejercicios</Text>
        
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#999" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Buscar ejercicio..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark" size={16} color="#999" />
            </Pressable>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingRight: 20 }}>
          {categories.map((cat, index) => {
            const isActive = selectedCategory === cat;
            return (
              <Pressable 
                key={index} 
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {filteredExercises.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron ejercicios.</Text>
          </View>
        ) : (
          filteredExercises.map((exercise) => (
            <Pressable 
              key={exercise.id} 
              style={styles.exerciseCard}
              onPress={() => setSelectedExercise(exercise)}
            >
              <View style={styles.exerciseImagePlaceholder}>
                <IconSymbol name="figure.run" size={24} color="#A0A0A0" />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.exerciseTags}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{exercise.muscle}</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{exercise.equipment}</Text>
                  </View>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#C7C7CC" />
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Exercise Detail Modal */}
      <Modal
        visible={!!selectedExercise}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedExercise(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedExercise && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
                  <Pressable onPress={() => setSelectedExercise(null)} style={styles.closeButton}>
                    <IconSymbol name="xmark" size={24} color="#333" />
                  </Pressable>
                </View>

                <View style={styles.modalTags}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{selectedExercise.muscle}</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{selectedExercise.equipment}</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: getLevelColor(selectedExercise.level) + '20' }]}>
                    <Text style={[styles.tagText, { color: getLevelColor(selectedExercise.level) }]}>
                      {selectedExercise.level}
                    </Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Ejecución</Text>
                  <Text style={styles.sectionText}>{selectedExercise.description}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Músculos Principales</Text>
                  <Text style={styles.sectionText}>• {selectedExercise.primaryMuscles.join(', ')}</Text>
                </View>

                {selectedExercise.secondaryMuscles.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Músculos Secundarios</Text>
                    <Text style={styles.sectionText}>• {selectedExercise.secondaryMuscles.join(', ')}</Text>
                  </View>
                )}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Beneficios</Text>
                  <Text style={styles.sectionText}>{selectedExercise.benefits}</Text>
                </View>

                {selectedExercise.tips && selectedExercise.tips.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Consejos de Ejecución</Text>
                    {selectedExercise.tips.map((tip, index) => (
                      <Text key={index} style={styles.sectionText}>• {tip}</Text>
                    ))}
                  </View>
                )}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Sugerencias</Text>
                  <View style={styles.suggestionToggleContainer}>
                    <Pressable 
                      style={[styles.suggestionToggleButton, suggestionLevel === 'principiante' && styles.suggestionToggleButtonActive]}
                      onPress={() => setSuggestionLevel('principiante')}
                    >
                      <Text style={[styles.suggestionToggleText, suggestionLevel === 'principiante' && styles.suggestionToggleTextActive]}>Principiante</Text>
                    </Pressable>
                    <Pressable 
                      style={[styles.suggestionToggleButton, suggestionLevel === 'profesional' && styles.suggestionToggleButtonActive]}
                      onPress={() => setSuggestionLevel('profesional')}
                    >
                      <Text style={[styles.suggestionToggleText, suggestionLevel === 'profesional' && styles.suggestionToggleTextActive]}>Profesional</Text>
                    </Pressable>
                  </View>
                </View>

                {selectedExercise.suggestedWeight && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Peso Sugerido ({suggestionLevel === 'principiante' ? 'Principiante' : 'Profesional'})</Text>
                    <Text style={styles.sectionText}>{selectedExercise.suggestedWeight[suggestionLevel]}</Text>
                  </View>
                )}

                {selectedExercise.suggestedReps && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Repeticiones Sugeridas ({suggestionLevel === 'principiante' ? 'Principiante' : 'Profesional'})</Text>
                    <Text style={styles.sectionText}>{selectedExercise.suggestedReps[suggestionLevel]}</Text>
                  </View>
                )}

              </ScrollView>
            )}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
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
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
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
  filterChipActive: {
    backgroundColor: '#4A90E2',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
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
    paddingBottom: 40,
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
  exerciseImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F0F6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    paddingRight: 16,
  },
  closeButton: {
    padding: 4,
  },
  modalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 22,
  },
  suggestionToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 4,
    marginTop: 8,
  },
  suggestionToggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  suggestionToggleButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestionToggleText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  suggestionToggleTextActive: {
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
});
