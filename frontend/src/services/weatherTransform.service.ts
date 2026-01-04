/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CurrentWeather, DailyForecast } from '../types';

export const transformCurrentWeather = (apiData: any, cityId: string, cityName: string, country: string): CurrentWeather => {
  return {
    cityId,
    cityName: apiData.name || cityName,
    country: apiData.sys?.country || country,
    coordinates: {
      lat: apiData.coord.lat,
      lon: apiData.coord.lon
    },
    temperature: {
      current: apiData.main.temp,
      feelsLike: apiData.main.feels_like,
      min: apiData.main.temp_min,
      max: apiData.main.temp_max
    },
    condition: {
      id: apiData.weather[0].id,
      main: apiData.weather[0].main,
      description: apiData.weather[0].description,
      icon: apiData.weather[0].icon
    },
    wind: {
      speed: apiData.wind.speed,
      direction: apiData.wind.deg || 0,
      gust: apiData.wind.gust
    },
    cloudiness: apiData.clouds.all,
    humidity: apiData.main.humidity,
    pressure: apiData.main.pressure,
    timestamp: apiData.dt
  };
};

export const transformForecastData = (forecastList: any[]): DailyForecast[] => {
  const dailyForecasts: DailyForecast[] = [];
  const processedDays = new Set<string>();

  forecastList.forEach((item: any) => {
    if (dailyForecasts.length >= 5) return;

    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    
    if (processedDays.has(dateKey)) return;
    
    const hour = date.getHours();
    const isNoonTime = hour >= 11 && hour <= 14;
    
    if (isNoonTime || processedDays.size === 0) {
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

  return dailyForecasts;
};
