import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Dish } from '../types';
import ImageCard from './ImageCard';
import LoaderIcon from './icons/LoaderIcon';

interface ImageGridProps {
  dishes: Dish[];
  isLoading: boolean;
  onRetryDish?: (dishId: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ dishes, isLoading, onRetryDish }) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const showGrid = dishes.length > 0;

  React.useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isLoading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (isLoading && dishes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <LoaderIcon width={48} height={48} color="#F59E0B" />
        </Animated.View>
        <Text style={styles.loadingText}>Parsing your menu...</Text>
      </View>
    );
  }

  if (!showGrid) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your generated food photos will appear here.</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.grid}>
        {dishes.reduce<React.ReactNode[]>((rows, dish, index) => {
          if (index % 2 === 0) {
            rows.push(
              <View key={dish.id} style={styles.row}>
                <View style={styles.cardWrapper}>
                  <ImageCard dish={dish} onRetry={onRetryDish} />
                </View>
                {dishes[index + 1] && (
                  <View style={styles.cardWrapper}>
                    <ImageCard dish={dishes[index + 1]} onRetry={onRetryDish} />
                  </View>
                )}
              </View>
            );
          }
          return rows;
        }, [])}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#9CA3AF',
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
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
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
});

export default ImageGrid;
