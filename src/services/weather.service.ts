import type { CurrentWeather, DailyForecast, WeatherData } from '../types';
import { DEFAULT_CITIES } from '../constants';

// Mock data generator for fallback when no API key
const generateMockWeather = (cityId: string): WeatherData => {
  const city = DEFAULT_CITIES.find(c => c.id === cityId);
  if (!city) throw new Error('City not found');

  const randomTemp = Math.floor(Math.random() * 30) - 5;
  const conditions = ['Clear', 'Clouds', 'Rain', 'Snow'];
  const icons = ['01d', '02d', '09d', '13d'];
  const randomCondition = Math.floor(Math.random() * conditions.length);

  const current: CurrentWeather = {
    cityId: city.id,
    cityName: city.name,
    country: city.country,
    coordinates: city.coordinates,
    temperature: {
      current: randomTemp,
      feelsLike: randomTemp - 2,
      min: randomTemp - 3,
      max: randomTemp + 3
    },
    condition: {
      id: 800 + randomCondition,
      main: conditions[randomCondition],
      description: conditions[randomCondition].toLowerCase(),
      icon: icons[randomCondition]
    },
    wind: {
      speed: Math.random() * 15,
      direction: Math.floor(Math.random() * 360)
    },
    cloudiness: Math.floor(Math.random() * 100),
    humidity: Math.floor(Math.random() * 100),
    pressure: 1000 + Math.floor(Math.random() * 50),
    timestamp: Date.now() / 1000
  };

  const forecast: DailyForecast[] = Array.from({ length: 5 }, (_, i) => ({
    date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
    temperature: {
      min: randomTemp - 5 + i,
      max: randomTemp + 5 + i,
      day: randomTemp + i
    },
    condition: {
      id: 800 + Math.floor(Math.random() * 4),
      main: conditions[Math.floor(Math.random() * conditions.length)],
      description: 'partly cloudy',
      icon: icons[Math.floor(Math.random() * icons.length)]
    },
    precipitation: {
      probability: Math.random() * 100,
      type: Math.random() > 0.5 ? 'rain' : 'none',
      amount: Math.random() * 10
    },
    wind: {
      speed: Math.random() * 15,
      direction: Math.floor(Math.random() * 360)
    },
    cloudiness: Math.floor(Math.random() * 100)
  }));

  return { current, forecast };
};

export const fetchWeatherData = async (cityId: string): Promise<WeatherData> => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  // If no API key, return mock data
  if (!apiKey || apiKey === 'your_api_key_here') {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockWeather(cityId);
  }

  // Real API implementation will go here
  // For now, return mock data
  return generateMockWeather(cityId);
};

export const searchCities = async (query: string) => {
  return DEFAULT_CITIES.filter(city =>
    city.name.toLowerCase().includes(query.toLowerCase())
  );
};
