import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dish, PhotoStyle } from '../types';
import { parseMenu, generateFoodImage } from '../services/geminiService';
import MenuInput from '../components/MenuInput';
import StyleSelector from '../components/StyleSelector';
import ImageGrid from '../components/ImageGrid';
import SparklesIcon from '../components/icons/SparklesIcon';
import 'react-native-get-random-values';

// Simple UUID generator for React Native
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const App: React.FC = () => {
  const [menuText, setMenuText] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<PhotoStyle>(PhotoStyle.MODERN);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGeneratePhotos = useCallback(async () => {
    if (!menuText.trim()) {
      Alert.alert('Error', 'Please enter a menu.');
      return;
    }

    setIsLoading(true);
    setDishes([]);

    try {
      const dishNames = await parseMenu(menuText);
      if (!dishNames || dishNames.length === 0) {
        Alert.alert('Error', 'Could not find any dishes in the menu. Please check the format.');
        setIsLoading(false);
        return;
      }

      const initialDishes: Dish[] = dishNames.map(name => ({
        id: generateUUID(),
        name,
        imageUrl: null,
        status: 'pending'
      }));
      setDishes(initialDishes);

      for (const dish of initialDishes) {
        setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, status: 'generating' } : d));
        try {
          const base64Image = await generateFoodImage(dish.name, selectedStyle);
          const imageUrl = `data:image/jpeg;base64,${base64Image}`;
          setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, status: 'completed', imageUrl } : d));
        } catch (e) {
          console.error(`Failed to generate image for ${dish.name}:`, e);
          setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, status: 'failed' } : d));
        }
      }

    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [menuText, selectedStyle]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <LinearGradient
            colors={['#EA580C', '#F59E0B']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            locations={[0, 1]}
            style={styles.titleGradient}
          >
            <Text style={styles.title}>Virtual Food Photographer</Text>
          </LinearGradient>
          <Text style={styles.subtitle}>
            Turn your menu into a masterpiece. Generate stunning, professional food photos with AI.
          </Text>
        </View>

        <View style={styles.mainCard}>
          <MenuInput value={menuText} onChange={setMenuText} />
          <View style={styles.divider} />
          <StyleSelector selectedStyle={selectedStyle} onChange={setSelectedStyle} />

          <TouchableOpacity
            onPress={handleGeneratePhotos}
            disabled={isLoading}
            style={[styles.button, isLoading && styles.buttonDisabled]}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isLoading ? ['#6B7280', '#9CA3AF'] : ['#EA580C', '#F59E0B']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              locations={[0, 1]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Generating...' : 'Generate Photos'}
              </Text>
              <SparklesIcon width={24} height={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.resultsSection}>
          <ImageGrid dishes={dishes} isLoading={isLoading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  titleGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  mainCard: {
    backgroundColor: '#1F2937',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  divider: {
    height: 32,
  },
  button: {
    marginTop: 32,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resultsSection: {
    marginTop: 48,
  },
});

export default App;
