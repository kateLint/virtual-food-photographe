import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFavorites } from '../contexts/FavoritesContext';
import ImageCard from '../components/ImageCard';
import Toast from '../components/Toast';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';

const FavoritesScreen: React.FC = () => {
  const { favorites } = useFavorites();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const handleDownload = async (imageUrl: string, dishName: string, dishId: string, showAlert = true) => {
    try {
      // Add to downloading set
      setDownloadingIds(prev => new Set(prev).add(dishId));

      if (permissionResponse?.status !== 'granted') {
        const permission = await requestPermission();
        if (!permission.granted) {
          setDownloadingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(dishId);
            return newSet;
          });
          Alert.alert('Permission Required', 'Please grant permission to save photos to your library.', [{ text: 'OK', style: 'default' }]);
          return false;
        }
      }

      // Create a file path
      const fileUri = FileSystem.cacheDirectory + `${dishName.replace(/\s+/g, '_')}_${Date.now()}.jpg`;

      // Download the base64 image to a file
      await FileSystem.writeAsStringAsync(fileUri, imageUrl.split(',')[1], {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('VirtualFoodPhotographer', asset, false);

      // Haptic feedback on success
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Remove from downloading set
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(dishId);
        return newSet;
      });

      if (showAlert) {
        setToast({ visible: true, message: 'Image saved to your photo library!', type: 'success' });
      }
      return true;
    } catch (error) {
      console.error('Error saving image:', error);

      // Remove from downloading set
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(dishId);
        return newSet;
      });

      if (showAlert) {
        setToast({ visible: true, message: 'Failed to save image. Please try again.', type: 'error' });
      }
      return false;
    }
  };

  const handleDownloadAll = async () => {
    if (favorites.length === 0 || isDownloadingAll) return;

    setIsDownloadingAll(true);
    setDownloadProgress({ current: 0, total: favorites.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < favorites.length; i++) {
      const dish = favorites[i];
      setDownloadProgress({ current: i + 1, total: favorites.length });

      const success = await handleDownload(dish.imageUrl!, dish.name, dish.id, false);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    setIsDownloadingAll(false);
    setDownloadProgress({ current: 0, total: 0 });

    // Show summary
    if (failCount === 0) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setToast({ visible: true, message: `All ${successCount} images saved successfully!`, type: 'success' });
    } else if (successCount === 0) {
      setToast({ visible: true, message: 'Failed to download images. Please try again.', type: 'error' });
    } else {
      setToast({ visible: true, message: `${successCount} saved, ${failCount} failed`, type: 'info' });
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>My Favorites</Text>
          <Text style={styles.subtitle}>
            {favorites.length} {favorites.length === 1 ? 'photo' : 'photos'} saved
          </Text>
          {favorites.length > 0 && (
            <TouchableOpacity
              style={[styles.downloadAllButton, isDownloadingAll && styles.downloadAllButtonDisabled]}
              onPress={handleDownloadAll}
              disabled={isDownloadingAll}
              activeOpacity={0.7}
            >
              {isDownloadingAll ? (
                <>
                  <ActivityIndicator size="small" color="#111827" />
                  <Text style={styles.downloadAllText}>
                    Downloading {downloadProgress.current}/{downloadProgress.total}
                  </Text>
                </>
              ) : (
                <>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </Svg>
                  <Text style={styles.downloadAllText}>Download All</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No favorites yet.</Text>
            <Text style={styles.emptySubtext}>
              Tap the heart icon on any photo to save it here.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {favorites.reduce<React.ReactNode[]>((rows, dish, index) => {
              if (index % 2 === 0) {
                rows.push(
                  <View key={dish.id} style={styles.row}>
                    <View style={styles.cardWrapper}>
                      <ImageCard dish={dish} />
                      <TouchableOpacity
                        style={[styles.downloadButton, downloadingIds.has(dish.id) && styles.downloadButtonDisabled]}
                        onPress={() => handleDownload(dish.imageUrl!, dish.name, dish.id)}
                        disabled={downloadingIds.has(dish.id)}
                        activeOpacity={0.7}
                      >
                        {downloadingIds.has(dish.id) ? (
                          <>
                            <ActivityIndicator size="small" color="#111827" />
                            <Text style={styles.downloadButtonText}>Downloading...</Text>
                          </>
                        ) : (
                          <>
                            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </Svg>
                            <Text style={styles.downloadButtonText}>Download</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                    {favorites[index + 1] && (
                      <View style={styles.cardWrapper}>
                        <ImageCard dish={favorites[index + 1]} />
                        <TouchableOpacity
                          style={[styles.downloadButton, downloadingIds.has(favorites[index + 1].id) && styles.downloadButtonDisabled]}
                          onPress={() => handleDownload(favorites[index + 1].imageUrl!, favorites[index + 1].name, favorites[index + 1].id)}
                          disabled={downloadingIds.has(favorites[index + 1].id)}
                          activeOpacity={0.7}
                        >
                          {downloadingIds.has(favorites[index + 1].id) ? (
                            <>
                              <ActivityIndicator size="small" color="#111827" />
                              <Text style={styles.downloadButtonText}>Downloading...</Text>
                            </>
                          ) : (
                            <>
                              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                              </Svg>
                              <Text style={styles.downloadButtonText}>Download</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              }
              return rows;
            }, [])}
          </View>
        )}
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
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: 80,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#374151',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  grid: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    gap: 6,
  },
  downloadButtonDisabled: {
    opacity: 0.5,
  },
  downloadButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  downloadAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  downloadAllButtonDisabled: {
    opacity: 0.7,
  },
  downloadAllText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
});

export default FavoritesScreen;
