import axios from 'axios';
import type { WeatherData } from '../types';
import { DEFAULT_CITIES, API_CONFIG } from '../constants';
import { transformCurrentWeather, transformForecastData } from './weatherTransform.service';

export const fetchWeatherData = async (cityId: string): Promise<WeatherData> => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('API key is required. Please set VITE_OPENWEATHER_API_KEY in .env file');
  }

  const city = DEFAULT_CITIES.find(c => c.id === cityId);
  if (!city) throw new Error('City not found');

  const weatherUrl = `${API_CONFIG.BASE_URL}/weather`;
  const forecastUrl = `${API_CONFIG.BASE_URL}/forecast`;
  
  const params = {
    lat: city.coordinates.lat,
    lon: city.coordinates.lon,
    appid: apiKey,
    units: 'metric',
    lang: 'pl'
  };

  const [currentResponse, forecastResponse] = await Promise.all([
    axios.get(weatherUrl, { params }),
    axios.get(forecastUrl, { params })
  ]);

  const current = transformCurrentWeather(
    currentResponse.data,
    city.id,
    city.name,
    city.country
  );

  const forecast = transformForecastData(forecastResponse.data.list);

  return { current, forecast };
};

export const searchCities = async (query: string) => {
  return DEFAULT_CITIES.filter(city =>
    city.name.toLowerCase().includes(query.toLowerCase())
  );
};
