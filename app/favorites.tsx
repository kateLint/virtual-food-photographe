import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Share, Alert } from 'react-native';
import { useFavorites } from '../contexts/FavoritesContext';
import ImageCard from '../components/ImageCard';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import Svg, { Path } from 'react-native-svg';

const FavoritesScreen: React.FC = () => {
  const { favorites } = useFavorites();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const handleDownload = async (imageUrl: string, dishName: string) => {
    try {
      if (permissionResponse?.status !== 'granted') {
        const permission = await requestPermission();
        if (!permission.granted) {
          Alert.alert('Permission Required', 'Please grant permission to save photos to your library.');
          return;
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

      Alert.alert('Success', 'Image saved to your photo library!');
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image. Please try again.');
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
                          style={styles.actionButton}
                          onPress={() => handleDownload(dish.imageUrl!, dish.name)}
                          activeOpacity={0.7}
                        >
                          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                          </Svg>
                          <Text style={styles.actionText}>Download</Text>
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
                            style={styles.actionButton}
                            onPress={() => handleDownload(favorites[index + 1].imageUrl!, favorites[index + 1].name)}
                            activeOpacity={0.7}
                          >
                            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </Svg>
                            <Text style={styles.actionText}>Download</Text>
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
});

export default FavoritesScreen;
