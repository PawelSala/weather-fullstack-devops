export type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin';

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Temperature {
  current: number;
  feelsLike: number;
  min: number;
  max: number;
}

export interface Wind {
  speed: number;
  direction: number;
  gust?: number;
}

export interface Precipitation {
  probability: number;
  type: 'rain' | 'snow' | 'none';
  amount: number;
}

export interface CurrentWeather {
  cityId: string;
  cityName: string;
  country: string;
  coordinates: Coordinates;
  temperature: Temperature;
  condition: WeatherCondition;
  wind: Wind;
  cloudiness: number;
  humidity: number;
  pressure: number;
  timestamp: number;
}

export interface DailyForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
    day: number;
  };
  condition: WeatherCondition;
  precipitation: Precipitation;
  wind: Wind;
  cloudiness: number;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: DailyForecast[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  coordinates: Coordinates;
}
