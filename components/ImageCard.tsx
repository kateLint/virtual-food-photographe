import React from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { Dish } from '../types';
import LoaderIcon from './icons/LoaderIcon';
import Svg, { Path } from 'react-native-svg';

interface ImageCardProps {
  dish: Dish;
}

const ImageCard: React.FC<ImageCardProps> = ({ dish }) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

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
          <Image
            source={{ uri: dish.imageUrl! }}
            style={styles.image}
            resizeMode="cover"
          />
        );
      case 'failed':
        return (
          <View style={styles.centerContent}>
            <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <Path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </Svg>
            <Text style={styles.failedText}>Image failed</Text>
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
        <Text style={styles.dishName} numberOfLines={1}>{dish.name}</Text>
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
    padding: 16,
    backgroundColor: '#1F2937',
  },
  dishName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F3F4F6',
  },
});

export default ImageCard;
