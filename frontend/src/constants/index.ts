export * from './cities';
export * from './weather';

export const STORAGE_KEYS = {
  FAVORITES: 'weather_app_favorites',
  SETTINGS: 'weather_app_settings'
} as const;

export const API_CONFIG = {
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  ICON_URL: 'https://openweathermap.org/img/wn'
} as const;
