import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Dish, PhotoStyle } from '../types';
import { parseMenu, generateFoodImage, extractTextFromImage } from '../services/geminiService';
import MenuInput from '../components/MenuInput';
import StyleSelector from '../components/StyleSelector';
import ImageGrid from '../components/ImageGrid';
import SparklesIcon from '../components/icons/SparklesIcon';
import ConfirmDialog from '../components/ConfirmDialog';
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
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showClearDialog, setShowClearDialog] = useState<boolean>(false);

  const handleGeneratePhotos = useCallback(async () => {
    if (!menuText.trim()) {
      setErrorMessage('Please enter a menu.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setDishes([]);
  // Disable the generate button until the first image (success or failure) completes
  setIsButtonDisabled(true);

    try {
      const dishNames = await parseMenu(menuText);
      if (!dishNames || dishNames.length === 0) {
        setErrorMessage('Could not find any dishes in the menu. Please check the format.');
        setIsLoading(false);
        setIsButtonDisabled(false);
        return;
      }

      const initialDishes: Dish[] = dishNames.map(name => ({
        id: generateUUID(),
        name,
        imageUrl: null,
        status: 'generating'
      }));
      setDishes(initialDishes);
      setIsLoading(false);

      // Start generating images in parallel. We'll use Promise.race on the same
      // promises to detect the first completion (success or failure) so we can
      // re-enable the button as requested.
      const generationPromises = initialDishes.map(async (dish) => {
        try {
          const base64Image = await generateFoodImage(dish.name, selectedStyle);
          const imageUrl = `data:image/jpeg;base64,${base64Image}`;
          setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, status: 'completed', imageUrl } : d));
          return { id: dish.id, ok: true } as const;
        } catch (e) {
          if (__DEV__) {
            console.error(`Failed to generate image for ${dish.name}:`, e);
          }
          setDishes(prev => prev.map(d => d.id === dish.id ? { ...d, status: 'failed' } : d));
          return { id: dish.id, ok: false } as const;
        }
      });

      // Wait for the first promise to settle (either success or failure), then
      // re-enable the button. Promise.race will resolve when the first of the
      // provided promises resolves; since each generation promise always
      // resolves (we return an object in both try and catch), this works.
      try {
        await Promise.race(generationPromises);
      } catch (_) {
        // Not expected because the mapped promises resolve, but keep guard.
      } finally {
        setIsButtonDisabled(false);
      }

      // Wait for all to finish before moving on.
      await Promise.all(generationPromises);

    } catch (err: any) {
      if (__DEV__) {
        console.error(err);
      }
      setErrorMessage(err?.message || 'An unexpected error occurred. Please try again.');
      setIsButtonDisabled(false);
    } finally {
      setIsLoading(false);
    }
  }, [menuText, selectedStyle]);

  const handleCameraPress = useCallback(async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        setErrorMessage('Camera permission is required to scan menus.');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      setIsScanning(true);

      try {
        // Extract text from the captured image
        const extractedText = await extractTextFromImage(result.assets[0].uri);

        // Append the extracted text to existing menu text
        setMenuText(prevText => {
          if (prevText.trim()) {
            return `${prevText}\n\n${extractedText}`;
          }
          return extractedText;
        });

        // Success - no need to show a message, the text will appear in the input
      } catch (error: any) {
        if (__DEV__) {
          console.error('OCR Error:', error);
        }
        setErrorMessage(error?.message || 'Failed to extract text from the image. Please try again or type the menu manually.');
      } finally {
        setIsScanning(false);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Camera Error:', error);
      }
      setErrorMessage('Failed to open camera. Please try again.');
      setIsScanning(false);
    }
  }, []);

  const handleClearMenu = useCallback(() => {
    setShowClearDialog(true);
  }, []);

  const confirmClearMenu = useCallback(() => {
    setMenuText('');
    setDishes([]);
    setErrorMessage('');
  }, []);

  const handleRetryDish = useCallback(async (dishId: string) => {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;

    // Set status to generating
    setDishes(prev => prev.map(d => d.id === dishId ? { ...d, status: 'generating', imageUrl: null } : d));

    try {
      const base64Image = await generateFoodImage(dish.name, selectedStyle);
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      setDishes(prev => prev.map(d => d.id === dishId ? { ...d, status: 'completed', imageUrl } : d));
    } catch (e) {
      if (__DEV__) {
        console.error(`Failed to generate image for ${dish.name}:`, e);
      }
      setDishes(prev => prev.map(d => d.id === dishId ? { ...d, status: 'failed' } : d));
    }
  }, [dishes, selectedStyle]);

  return (
    <SafeAreaView style={styles.container}>
      <ConfirmDialog
        visible={showClearDialog}
        title="Clear Menu"
        message="Are you sure you want to clear the menu text and all generated photos?"
        confirmText="Clear"
        cancelText="Cancel"
        onConfirm={confirmClearMenu}
        onCancel={() => setShowClearDialog(false)}
        destructive={true}
      />
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

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <View style={styles.errorContent}>
              <Text style={styles.errorText}>{errorMessage}</Text>
              <TouchableOpacity onPress={() => setErrorMessage('')} style={styles.errorDismiss}>
                <Text style={styles.errorDismissText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={styles.mainCard}>
          <MenuInput
            value={menuText}
            onChange={(text) => {
              setMenuText(text);
              if (errorMessage) setErrorMessage('');
            }}
            onCameraPress={handleCameraPress}
            onClearPress={handleClearMenu}
            isScanning={isScanning}
          />
          <View style={styles.divider} />
          <StyleSelector selectedStyle={selectedStyle} onChange={setSelectedStyle} />

          <TouchableOpacity
            onPress={handleGeneratePhotos}
            disabled={isScanning || isButtonDisabled}
            style={[styles.button, (isScanning || isButtonDisabled) && styles.buttonDisabled]}
            activeOpacity={0.8}
            accessibilityLabel="Generate food photos"
            accessibilityHint="Creates AI-generated professional food photos from your menu text"
            accessibilityRole="button"
            accessibilityState={{ disabled: isScanning || isButtonDisabled }}
          >
            <LinearGradient
              colors={(isScanning || isButtonDisabled) ? ['#6B7280', '#9CA3AF'] : ['#EA580C', '#F59E0B']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              locations={[0, 1]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {isScanning ? 'Scanning Menu...' : (isButtonDisabled ? 'Generating...' : 'Generate Photos')}
              </Text>
              <SparklesIcon width={24} height={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.resultsSection}>
          <ImageGrid dishes={dishes} isLoading={isLoading} onRetryDish={handleRetryDish} />
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
  errorBanner: {
    backgroundColor: '#7F1D1D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#991B1B',
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#FEE2E2',
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  errorDismiss: {
    padding: 4,
    borderRadius: 4,
  },
  errorDismissText: {
    color: '#FEE2E2',
    fontSize: 20,
    fontWeight: '600',
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
