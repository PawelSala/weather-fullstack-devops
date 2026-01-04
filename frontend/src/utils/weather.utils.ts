import type { TemperatureUnit } from '../types';

export const convertTemperature = (
  celsius: number,
  unit: TemperatureUnit
): number => {
  switch (unit) {
    case 'fahrenheit':
      return (celsius * 9/5) + 32;
    case 'kelvin':
      return celsius + 273.15;
    default:
      return celsius;
  }
};

export const formatTemperature = (
  celsius: number,
  unit: TemperatureUnit
): string => {
  const converted = convertTemperature(celsius, unit);
  const rounded = Math.round(converted);
  
  const symbols: Record<TemperatureUnit, string> = {
    celsius: '°C',
    fahrenheit: '°F',
    kelvin: 'K'
  };
  
  return `${rounded}${symbols[unit]}`;
};

export const getWindDirection = (degrees: number): string => {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('pl-PL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};
