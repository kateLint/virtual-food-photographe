import React from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity, Share } from 'react-native';
import { Dish } from '../types';
import LoaderIcon from './icons/LoaderIcon';
import RefreshIcon from './icons/RefreshIcon';
import Svg, { Path } from 'react-native-svg';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import * as FileSystem from 'expo-file-system';

interface ImageCardProps {
  dish: Dish;
  onRetry?: (dishId: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ dish, onRetry }) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const { favorites, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  // Calculate favorite status based on current favorites array
  const isCurrentlyFavorite = React.useMemo(() => {
    const isFav = favorites.some(fav => fav.id === dish.id);
    if (__DEV__) {
      console.log(`[ImageCard] Dish: ${dish.name}, ID: ${dish.id}, isFavorite: ${isFav}, Total favorites: ${favorites.length}`);
    }
    return isFav;
  }, [favorites, dish.id, dish.name]);

  const handleToggleFavorite = async () => {
    if (__DEV__) {
      console.log(`[ImageCard] ===== FAVORITE BUTTON PRESSED =====`);
      console.log(`[ImageCard] Dish: ${dish.name}, ID: ${dish.id}`);
      console.log(`[ImageCard] Current state - isCurrentlyFavorite: ${isCurrentlyFavorite}`);
      console.log(`[ImageCard] About to call toggleFavorite...`);
    }
    await toggleFavorite(dish);
    if (__DEV__) {
      console.log(`[ImageCard] toggleFavorite completed`);
    }
  };

  React.useEffect(() => {
    if (dish.status === 'generating' || dish.status === 'pending') {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [dish.status]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleShare = async () => {
    if (!dish.imageUrl) return;

    try {
      const fileUri = FileSystem.cacheDirectory + `${dish.name.replace(/\s+/g, '_')}.jpg`;
      await FileSystem.writeAsStringAsync(fileUri, dish.imageUrl.split(',')[1], {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Share.share({
        url: fileUri,
        message: `Check out this ${dish.name} photo!`,
      });
    } catch (error) {
      if (__DEV__) {
        console.error('Error sharing image:', error);
      }
      showToast('Failed to share image. Please try again.', 'error');
    }
  };

  const renderContent = () => {
    switch (dish.status) {
      case 'generating':
      case 'pending':
        return (
          <View style={styles.centerContent}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <LoaderIcon width={40} height={40} color="#F59E0B" />
            </Animated.View>
            {dish.status === 'generating' && (
              <Text style={styles.generatingText}>Generating...</Text>
            )}
          </View>
        );
      case 'completed':
        return (
          <>
            <Image
              source={{ uri: dish.imageUrl! }}
              style={styles.image}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
              activeOpacity={0.7}
            >
              {isCurrentlyFavorite ? (
                <Svg width={20} height={20} viewBox="0 0 24 24">
                  <Path
                    d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                    fill="#F59E0B"
                    stroke="#F59E0B"
                    strokeWidth="2"
                  />
                </Svg>
              ) : (
                <Svg width={20} height={20} viewBox="0 0 24 24">
                  <Path
                    d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2"
                  />
                </Svg>
              )}
            </TouchableOpacity>
          </>
        );
      case 'failed':
        return (
          <View style={styles.centerContent}>
            <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <Path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </Svg>
            <Text style={styles.failedText}>Image failed</Text>
            {onRetry && (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => onRetry(dish.id)}
                activeOpacity={0.7}
              >
                <RefreshIcon width={20} height={20} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {renderContent()}
      </View>
      <View style={styles.footer}>
        <Text
          style={styles.dishName}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {dish.name}
        </Text>
        {dish.status === 'completed' && dish.imageUrl && (
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
            </Svg>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#374151',
  },
  imageContainer: {
    aspectRatio: 4 / 3,
    backgroundColor: '#111827',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generatingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
  },
  failedText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1F2937',
  },
  dishName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#F3F4F6',
    marginRight: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  shareButton: {
    padding: 4,
  },
  retryButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EA580C',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ImageCard;
