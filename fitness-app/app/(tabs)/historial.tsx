import { StyleSheet, ScrollView, View, Text, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HistorialScreen() {
  const mockHistory = [
    { id: 1, name: 'Día de Pecho y Tríceps', date: 'Ayer, 18:30', duration: '1h 15m', volume: '4,520 kg', prs: 2 },
    { id: 2, name: 'Espalda y Bíceps', date: '2 Mayo, 19:00', duration: '1h 5m', volume: '3,800 kg', prs: 0 },
    { id: 3, name: 'Pierna Completa', date: '30 Abril, 17:45', duration: '1h 30m', volume: '6,100 kg', prs: 1 },
    { id: 4, name: 'Hombro y Core', date: '28 Abril, 08:00', duration: '55m', volume: '2,900 kg', prs: 0 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tu Historial</Text>
        <Text style={styles.subtitle}>Mayo 2026</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {mockHistory.map((workout) => (
          <Pressable key={workout.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIcon}>
                <IconSymbol name="figure.run" size={24} color="#4A90E2" />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{workout.name}</Text>
                <Text style={styles.cardDate}>{workout.date}</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#C7C7CC" />
            </View>
            
            <View style={styles.cardStats}>
              <View style={styles.statItem}>
                <IconSymbol name="timer" size={16} color="#666" />
                <Text style={styles.statText}>{workout.duration}</Text>
              </View>
              <View style={styles.statItem}>
                <IconSymbol name="list.bullet" size={16} color="#666" />
                <Text style={styles.statText}>{workout.volume}</Text>
              </View>
              {workout.prs > 0 && (
                <View style={styles.prBadge}>
                  <Text style={styles.prText}>{workout.prs} PRs 🏆</Text>
                </View>
              )}
            </View>
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
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 13,
    color: '#666',
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  prBadge: {
    marginLeft: 'auto',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  prText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: 'bold',
  },
});
