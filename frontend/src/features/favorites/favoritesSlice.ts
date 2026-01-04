import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../constants';
import type { City } from '../../types';

interface FavoritesState {
  cityIds: string[];
  cities: City[];
}

const loadFavorites = (): FavoritesState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        cityIds: parsed.cityIds || [],
        cities: parsed.cities || []
      };
    }
  } catch (error) {
    console.error('Failed to load favorites:', error);
  }
  return { cityIds: [], cities: [] };
};

const initialState: FavoritesState = loadFavorites();

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<City>) => {
      const city = action.payload;
      const index = state.cityIds.indexOf(city.id);
      
      if (index >= 0) {
        state.cityIds.splice(index, 1);
        state.cities = state.cities.filter(c => c.id !== city.id);
      } else {
        state.cityIds.push(city.id);
        state.cities.push(city);
      }
      
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state));
    },
    
    addFavorite: (state, action: PayloadAction<City>) => {
      const city = action.payload;
      if (!state.cityIds.includes(city.id)) {
        state.cityIds.push(city.id);
        state.cities.push(city);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state));
      }
    },
    
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.cityIds = state.cityIds.filter(id => id !== action.payload);
      state.cities = state.cities.filter(c => c.id !== action.payload);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state));
    }
  }
});

export const { toggleFavorite, addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
