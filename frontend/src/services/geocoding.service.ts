import axios from 'axios';
import type { GeocodingResult } from '../types';
import { API_CONFIG } from '../constants';

const GEOCODING_BASE_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export const getLocalizedCityName = (result: GeocodingResult): string => {
  return result.local_names?.pl || result.name;
};

export const searchCitiesByName = async (query: string, limit: number = 5): Promise<GeocodingResult[]> => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    return [];
  }

  try {
    const response = await axios.get<GeocodingResult[]>(GEOCODING_BASE_URL, {
      params: {
        q: query,
        limit,
        appid: apiKey,
        lang: 'pl'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error searching cities via geocoding API:', error);
    return [];
  }
};

export const getWeatherByCoordinates = async (lat: number, lon: number) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  try {
    const weatherUrl = `${API_CONFIG.BASE_URL}/weather`;
    const forecastUrl = `${API_CONFIG.BASE_URL}/forecast`;

    const params = {
      lat,
      lon,
      appid: apiKey,
      units: 'metric',
      lang: 'pl'
    };

    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(weatherUrl, { params }),
      axios.get(forecastUrl, { params })
    ]);

    return {
      current: currentResponse.data,
      forecast: forecastResponse.data.list
    };
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    throw error;
  }
};
