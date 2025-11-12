import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../constants';

interface FavoritesState {
  cityIds: string[];
}

const loadFavorites = (): FavoritesState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load favorites:', error);
  }
  return { cityIds: [] };
};

const initialState: FavoritesState = loadFavorites();

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const cityId = action.payload;
      const index = state.cityIds.indexOf(cityId);
      
      if (index >= 0) {
        state.cityIds.splice(index, 1);
      } else {
        state.cityIds.push(cityId);
      }
      
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state));
    },
    
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.cityIds.includes(action.payload)) {
        state.cityIds.push(action.payload);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state));
      }
    },
    
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.cityIds = state.cityIds.filter(id => id !== action.payload);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state));
    }
  }
});

export const { toggleFavorite, addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
