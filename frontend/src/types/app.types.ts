export interface AppSettings {
  temperatureUnit: 'celsius' | 'fahrenheit' | 'kelvin';
}

export interface AppState {
  favorites: string[];
  settings: AppSettings;
}
