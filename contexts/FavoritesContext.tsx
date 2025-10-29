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

  const saveFavoritesToStorage = async (newFavorites: Dish[]) => {
    try {
      console.log(`[FavoritesContext] Saving ${newFavorites.length} favorites to storage`);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      console.log(`[FavoritesContext] Favorites saved to storage`);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavorite = async (dish: Dish) => {
    setFavorites(prevFavorites => {
      const newFavorites = [...prevFavorites, dish];
      saveFavoritesToStorage(newFavorites);
      return newFavorites;
    });
  };

  const removeFavorite = async (dishId: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(fav => fav.id !== dishId);
      saveFavoritesToStorage(newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (dishId: string) => {
    return favorites.some(fav => fav.id === dishId);
  };

  const toggleFavorite = async (dish: Dish) => {
    console.log(`[FavoritesContext] Toggle favorite for: ${dish.name}, ID: ${dish.id}`);

    setFavorites(prevFavorites => {
      const isCurrentlyFavorite = prevFavorites.some(fav => fav.id === dish.id);
      console.log(`[FavoritesContext] Current favorites count: ${prevFavorites.length}`);
      console.log(`[FavoritesContext] Is currently favorite: ${isCurrentlyFavorite}`);

      let newFavorites: Dish[];
      if (isCurrentlyFavorite) {
        console.log(`[FavoritesContext] Removing from favorites`);
        newFavorites = prevFavorites.filter(fav => fav.id !== dish.id);
      } else {
        console.log(`[FavoritesContext] Adding to favorites`);
        newFavorites = [...prevFavorites, dish];
      }

      saveFavoritesToStorage(newFavorites);
      return newFavorites;
    });
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
