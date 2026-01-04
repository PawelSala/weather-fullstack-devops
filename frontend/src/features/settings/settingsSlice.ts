import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TemperatureUnit } from '../../types';
import { STORAGE_KEYS } from '../../constants';

interface SettingsState {
  temperatureUnit: TemperatureUnit;
}

const loadSettings = (): SettingsState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return { temperatureUnit: 'celsius' };
};

const initialState: SettingsState = loadSettings();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTemperatureUnit: (state, action: PayloadAction<TemperatureUnit>) => {
      state.temperatureUnit = action.payload;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state));
    }
  }
});

export const { setTemperatureUnit } = settingsSlice.actions;
export default settingsSlice.reducer;
