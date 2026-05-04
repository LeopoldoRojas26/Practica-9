import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function InicioScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, Martha 👋</Text>
        <Text style={styles.subtitle}>Lista para tu próximo reto?</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Entrenos esta sem.</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>320</Text>
          <Text style={styles.statLabel}>Minutos activos</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Acceso Rápido</Text>

      <View style={styles.cardsContainer}>
        <Pressable style={[styles.card, styles.cardPrimary]} onPress={() => router.push('/entrenar')}>
          <IconSymbol name="figure.run" size={32} color="#fff" />
          <Text style={styles.cardTitleLight}>Empezar a Entrenar</Text>
          <Text style={styles.cardSubLight}>Día de Pierna - 45 min</Text>
        </Pressable>

        <View style={styles.rowCards}>
          <Pressable style={styles.cardSmall} onPress={() => router.push('/historial')}>
            <IconSymbol name="clock.fill" size={28} color="#4A90E2" />
            <Text style={styles.cardTitle}>Historial</Text>
            <Text style={styles.cardSub}>Último: Ayer</Text>
          </Pressable>

          <Pressable style={styles.cardSmall} onPress={() => router.push('/ejercicios')}>
            <IconSymbol name="list.bullet" size={28} color="#E24A75" />
            <Text style={styles.cardTitle}>Ejercicios</Text>
            <Text style={styles.cardSub}>Explorar</Text>
          </Pressable>
        </View>

        <Pressable style={styles.cardDescanso} onPress={() => router.push('/descanso')}>
          <View style={styles.descansoLeft}>
            <IconSymbol name="timer" size={28} color="#F39C12" />
            <View style={styles.descansoText}>
              <Text style={styles.cardTitle}>Descanso Actual</Text>
              <Text style={styles.cardSub}>Recuperación óptima</Text>
            </View>
          </View>
          <Text style={styles.descansoTime}>00:00</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
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
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
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
    backgroundColor: '#fff',
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
    color: '#1A1A1A',
    marginTop: 12,
  },
  cardSub: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  cardDescanso: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
});
