import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Share, Alert, ActivityIndicator } from 'react-native';
import { useFavorites } from '../contexts/FavoritesContext';
import ImageCard from '../components/ImageCard';
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
          Alert.alert('Permission Required', 'Please grant permission to save photos to your library.');
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
        Alert.alert('Success', 'Image saved to your photo library!');
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
        Alert.alert('Error', 'Failed to save image. Please try again.');
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
      Alert.alert('Success', `All ${successCount} images saved to your photo library!`);
    } else if (successCount === 0) {
      Alert.alert('Error', 'Failed to download images. Please try again.');
    } else {
      Alert.alert('Partial Success', `${successCount} images saved, ${failCount} failed. Please try again for failed images.`);
    }
  };

  const handleShare = async (imageUrl: string, dishName: string) => {
    try {
      // Create a temporary file
      const fileUri = FileSystem.cacheDirectory + `${dishName.replace(/\s+/g, '_')}.jpg`;

      // Write base64 to file
      await FileSystem.writeAsStringAsync(fileUri, imageUrl.split(',')[1], {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share the file
      await Share.share({
        url: fileUri,
        message: `Check out this ${dishName} photo!`,
      });
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Error', 'Failed to share image. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[styles.actionButton, downloadingIds.has(dish.id) && styles.actionButtonDisabled]}
                          onPress={() => handleDownload(dish.imageUrl!, dish.name, dish.id)}
                          disabled={downloadingIds.has(dish.id)}
                          activeOpacity={0.7}
                        >
                          {downloadingIds.has(dish.id) ? (
                            <>
                              <ActivityIndicator size="small" color="#F59E0B" />
                              <Text style={styles.actionText}>Saving...</Text>
                            </>
                          ) : (
                            <>
                              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                              </Svg>
                              <Text style={styles.actionText}>Download</Text>
                            </>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleShare(dish.imageUrl!, dish.name)}
                          activeOpacity={0.7}
                        >
                          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                          </Svg>
                          <Text style={styles.actionText}>Share</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {favorites[index + 1] && (
                      <View style={styles.cardWrapper}>
                        <ImageCard dish={favorites[index + 1]} />
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={[styles.actionButton, downloadingIds.has(favorites[index + 1].id) && styles.actionButtonDisabled]}
                            onPress={() => handleDownload(favorites[index + 1].imageUrl!, favorites[index + 1].name, favorites[index + 1].id)}
                            disabled={downloadingIds.has(favorites[index + 1].id)}
                            activeOpacity={0.7}
                          >
                            {downloadingIds.has(favorites[index + 1].id) ? (
                              <>
                                <ActivityIndicator size="small" color="#F59E0B" />
                                <Text style={styles.actionText}>Saving...</Text>
                              </>
                            ) : (
                              <>
                                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                </Svg>
                                <Text style={styles.actionText}>Download</Text>
                              </>
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleShare(favorites[index + 1].imageUrl!, favorites[index + 1].name)}
                            activeOpacity={0.7}
                          >
                            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                            </Svg>
                            <Text style={styles.actionText}>Share</Text>
                          </TouchableOpacity>
                        </View>
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#374151',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F59E0B',
  },
  actionButtonDisabled: {
    opacity: 0.5,
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
