import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, Pressable, TextInput, ScrollView, Dimensions, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { LineChart } from 'react-native-chart-kit';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width, height } = Dimensions.get('window');

type ProgressRecord = {
  id: string;
  date: string;
  weight: string;
  waist: string;
  chest: string;
  hips: string;
};

type ProgressPhoto = {
  id: string;
  uri: string;
  date: string;
};

type ProgresoModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function ProgresoModal({ visible, onClose }: ProgresoModalProps) {
  const [activeTab, setActiveTab] = useState<'registrar' | 'graficas' | 'fotos'>('registrar');
  
  // Data State
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);

  // Form State
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [hips, setHips] = useState('');

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    try {
      const storedRecords = await AsyncStorage.getItem('progress_records');
      const storedPhotos = await AsyncStorage.getItem('progress_photos');
      
      if (storedRecords) setRecords(JSON.parse(storedRecords));
      if (storedPhotos) setPhotos(JSON.parse(storedPhotos));
    } catch (e) {
      console.error('Error loading progress data', e);
    }
  };

  const handleSaveRecord = async () => {
    if (!weight) {
      Alert.alert('Atención', 'Por favor ingresa al menos tu peso.');
      return;
    }

    const newRecord: ProgressRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      weight,
      waist,
      chest,
      hips,
    };

    const newRecords = [...records, newRecord];
    setRecords(newRecords);
    
    try {
      await AsyncStorage.setItem('progress_records', JSON.stringify(newRecords));
      Alert.alert('Éxito', 'Registro guardado correctamente.');
      setWeight('');
      setWaist('');
      setChest('');
      setHips('');
      setActiveTab('graficas'); // Move to charts to see progress
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el registro.');
    }
  };

  const handleAddPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para añadir fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newPhoto: ProgressPhoto = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        date: new Date().toLocaleDateString('es-ES'),
      };

      const newPhotos = [newPhoto, ...photos];
      setPhotos(newPhotos);

      try {
        await AsyncStorage.setItem('progress_photos', JSON.stringify(newPhotos));
      } catch (e) {
        Alert.alert('Error', 'No se pudo guardar la foto.');
      }
    }
  };

  const renderRegistrar = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.formTitle}>Nuevo Registro</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Peso (kg)</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          placeholder="Ej. 75.5" 
          value={weight}
          onChangeText={setWeight}
        />
      </View>

      <Text style={styles.sectionDivider}>Medidas Opcionales (cm)</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cintura</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          placeholder="Ej. 80" 
          value={waist}
          onChangeText={setWaist}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Pecho</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          placeholder="Ej. 100" 
          value={chest}
          onChangeText={setChest}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cadera</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          placeholder="Ej. 95" 
          value={hips}
          onChangeText={setHips}
        />
      </View>

      <Pressable style={styles.saveButton} onPress={handleSaveRecord}>
        <Text style={styles.saveButtonText}>Guardar Registro</Text>
      </Pressable>
    </ScrollView>
  );

  const renderGraficas = () => {
    if (records.length < 2) {
      return (
        <View style={styles.emptyState}>
          <IconSymbol name="chart.xyaxis.line" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Necesitas al menos 2 registros para ver tu gráfica de progreso.</Text>
        </View>
      );
    }

    // Get last 6 records for the chart
    const chartData = records.slice(-6);
    const labels = chartData.map(r => r.date);
    const data = chartData.map(r => parseFloat(r.weight) || 0);

    return (
      <View style={styles.tabContent}>
        <Text style={styles.formTitle}>Evolución de Peso</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels,
              datasets: [{ data }]
            }}
            width={width - 48} // from padding
            height={220}
            yAxisSuffix=" kg"
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '6', strokeWidth: '2', stroke: '#4A90E2' }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <Text style={styles.historyTitle}>Historial Reciente</Text>
        <ScrollView style={styles.historyList}>
          {records.slice().reverse().map(record => (
            <View key={record.id} style={styles.historyCard}>
              <Text style={styles.historyDate}>{record.date}</Text>
              <Text style={styles.historyWeight}>{record.weight} kg</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderFotos = () => (
    <View style={styles.tabContent}>
      <Pressable style={styles.addPhotoButton} onPress={handleAddPhoto}>
        <IconSymbol name="camera.fill" size={24} color="#fff" />
        <Text style={styles.addPhotoText}>Añadir Foto</Text>
      </Pressable>

      {photos.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="camera.fill" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Aún no has añadido fotos de tu progreso.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.photoGrid}>
          {photos.map(photo => (
            <View key={photo.id} style={styles.photoContainer}>
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              <View style={styles.photoDateBadge}>
                <Text style={styles.photoDateText}>{photo.date}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Mi Progreso</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <IconSymbol name="xmark" size={24} color="#333" />
            </Pressable>
          </View>

          <View style={styles.tabsContainer}>
            <Pressable 
              style={[styles.tab, activeTab === 'registrar' && styles.activeTab]} 
              onPress={() => setActiveTab('registrar')}
            >
              <Text style={[styles.tabText, activeTab === 'registrar' && styles.activeTabText]}>Registrar</Text>
            </Pressable>
            <Pressable 
              style={[styles.tab, activeTab === 'graficas' && styles.activeTab]} 
              onPress={() => setActiveTab('graficas')}
            >
              <Text style={[styles.tabText, activeTab === 'graficas' && styles.activeTabText]}>Gráficas</Text>
            </Pressable>
            <Pressable 
              style={[styles.tab, activeTab === 'fotos' && styles.activeTab]} 
              onPress={() => setActiveTab('fotos')}
            >
              <Text style={[styles.tabText, activeTab === 'fotos' && styles.activeTabText]}>Fotos</Text>
            </Pressable>
          </View>

          {activeTab === 'registrar' && renderRegistrar()}
          {activeTab === 'graficas' && renderGraficas()}
          {activeTab === 'fotos' && renderFotos()}

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F7F9FC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.9,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  closeBtn: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#4A90E2',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#333',
  },
  sectionDivider: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 10,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingRight: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  chart: {
    borderRadius: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  historyList: {
    flex: 1,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  historyDate: {
    fontSize: 16,
    color: '#666',
  },
  historyWeight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  addPhotoButton: {
    flexDirection: 'row',
    backgroundColor: '#E24A75',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    marginTop: 8,
  },
  addPhotoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 40,
  },
  photoContainer: {
    width: (width - 60) / 2, // 2 columns, 24 padding each side (48) + 12 gap = 60
    height: (width - 60) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoDateBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  photoDateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
