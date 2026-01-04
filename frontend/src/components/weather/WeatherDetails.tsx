import type { CurrentWeather, TemperatureUnit } from '../../types';
import { formatTemperature, getWindDirection } from '../../utils';

interface WeatherDetailsProps {
  weather: CurrentWeather;
  unit: TemperatureUnit;
}

export const WeatherDetails = ({ weather, unit }: WeatherDetailsProps) => {
  const detailItems = [
    {
      label: 'Odczuwalna',
      value: formatTemperature(weather.temperature.feelsLike, unit),
      icon: '🌡️'
    },
    {
      label: 'Wilgotność',
      value: `${weather.humidity}%`,
      icon: '💧'
    },
    {
      label: 'Ciśnienie',
      value: `${weather.pressure} hPa`,
      icon: '📊'
    },
    {
      label: 'Wiatr',
      value: `${weather.wind.speed.toFixed(1)} m/s`,
      icon: '💨'
    },
    {
      label: 'Kierunek',
      value: getWindDirection(weather.wind.direction),
      icon: '🧭'
    },
    {
      label: 'Zachmurzenie',
      value: `${weather.cloudiness}%`,
      icon: '☁️'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Szczegóły</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {detailItems.map((item, index) => (
          <div 
            key={index}
            className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{item.icon}</span>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
            <p className="text-lg font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
