import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dish } from '../types';

interface FavoritesContextType {
  favorites: Dish[];
  addFavorite: (dish: Dish) => Promise<void>;
  removeFavorite: (dishId: string) => Promise<void>;
  isFavorite: (dishId: string) => boolean;
  toggleFavorite: (dish: Dish) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = '@favorites';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Dish[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (newFavorites: Dish[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavorite = async (dish: Dish) => {
    const newFavorites = [...favorites, { ...dish, isFavorite: true }];
    await saveFavorites(newFavorites);
  };

  const removeFavorite = async (dishId: string) => {
    const newFavorites = favorites.filter(fav => fav.id !== dishId);
    await saveFavorites(newFavorites);
  };

  const isFavorite = (dishId: string) => {
    return favorites.some(fav => fav.id === dishId);
  };

  const toggleFavorite = async (dish: Dish) => {
    if (isFavorite(dish.id)) {
      await removeFavorite(dish.id);
    } else {
      await addFavorite(dish);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
