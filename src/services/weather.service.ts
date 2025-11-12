import axios from 'axios';
import type { CurrentWeather, DailyForecast, WeatherData } from '../types';
import { DEFAULT_CITIES, API_CONFIG } from '../constants';

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

  try {
    const city = DEFAULT_CITIES.find(c => c.id === cityId);
    if (!city) throw new Error('City not found');

    // Fetch current weather
    const currentResponse = await axios.get(
      `${API_CONFIG.BASE_URL}/weather`,
      {
        params: {
          lat: city.coordinates.lat,
          lon: city.coordinates.lon,
          appid: apiKey,
          units: 'metric',
          lang: 'pl'
        }
      }
    );

    const currentData = currentResponse.data;

    // Fetch 5-day forecast
    const forecastResponse = await axios.get(
      `${API_CONFIG.BASE_URL}/forecast`,
      {
        params: {
          lat: city.coordinates.lat,
          lon: city.coordinates.lon,
          appid: apiKey,
          units: 'metric',
          lang: 'pl'
        }
      }
    );

    const forecastData = forecastResponse.data;

    // Transform current weather data
    const current: CurrentWeather = {
      cityId: city.id,
      cityName: currentData.name || city.name,
      country: currentData.sys?.country || city.country,
      coordinates: {
        lat: currentData.coord.lat,
        lon: currentData.coord.lon
      },
      temperature: {
        current: currentData.main.temp,
        feelsLike: currentData.main.feels_like,
        min: currentData.main.temp_min,
        max: currentData.main.temp_max
      },
      condition: {
        id: currentData.weather[0].id,
        main: currentData.weather[0].main,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon
      },
      wind: {
        speed: currentData.wind.speed,
        direction: currentData.wind.deg || 0,
        gust: currentData.wind.gust
      },
      cloudiness: currentData.clouds.all,
      humidity: currentData.main.humidity,
      pressure: currentData.main.pressure,
      timestamp: currentData.dt
    };

    // Transform forecast data - group by day and get noon forecast
    const dailyForecasts: DailyForecast[] = [];
    const processedDays = new Set<string>();

    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      // Skip if we already have this day or if we have 5 days
      if (processedDays.has(dateKey) || dailyForecasts.length >= 5) return;
      
      // Get the item closest to noon (12:00)
      const hour = date.getHours();
      if (hour >= 11 && hour <= 14) {
        processedDays.add(dateKey);
        
        dailyForecasts.push({
          date: date.toISOString(),
          temperature: {
            min: item.main.temp_min,
            max: item.main.temp_max,
            day: item.main.temp
          },
          condition: {
            id: item.weather[0].id,
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon
          },
          precipitation: {
            probability: (item.pop || 0) * 100,
            type: item.rain ? 'rain' : item.snow ? 'snow' : 'none',
            amount: item.rain?.['3h'] || item.snow?.['3h'] || 0
          },
          wind: {
            speed: item.wind.speed,
            direction: item.wind.deg || 0,
            gust: item.wind.gust
          },
          cloudiness: item.clouds.all
        });
      }
    });

    // If we don't have 5 days, fill with remaining items
    if (dailyForecasts.length < 5) {
      forecastData.list.forEach((item: any) => {
        if (dailyForecasts.length >= 5) return;
        
        const date = new Date(item.dt * 1000);
        const dateKey = date.toISOString().split('T')[0];
        
        if (!processedDays.has(dateKey)) {
          processedDays.add(dateKey);
          
          dailyForecasts.push({
            date: date.toISOString(),
            temperature: {
              min: item.main.temp_min,
              max: item.main.temp_max,
              day: item.main.temp
            },
            condition: {
              id: item.weather[0].id,
              main: item.weather[0].main,
              description: item.weather[0].description,
              icon: item.weather[0].icon
            },
            precipitation: {
              probability: (item.pop || 0) * 100,
              type: item.rain ? 'rain' : item.snow ? 'snow' : 'none',
              amount: item.rain?.['3h'] || item.snow?.['3h'] || 0
            },
            wind: {
              speed: item.wind.speed,
              direction: item.wind.deg || 0,
              gust: item.wind.gust
            },
            cloudiness: item.clouds.all
          });
        }
      });
    }

    return { current, forecast: dailyForecasts };
  } catch (error) {
    console.error('Error fetching weather data from API:', error);
    // Fallback to mock data on error
    return generateMockWeather(cityId);
  }
};

export const searchCities = async (query: string) => {
  return DEFAULT_CITIES.filter(city =>
    city.name.toLowerCase().includes(query.toLowerCase())
  );
};
