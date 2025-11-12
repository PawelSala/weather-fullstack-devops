import type { DailyForecast, TemperatureUnit } from '../../types';
import { formatTemperature, formatDate, getWindDirection } from '../../utils';

interface ForecastCardProps {
  forecast: DailyForecast;
  unit: TemperatureUnit;
}

export const ForecastCard = ({ forecast, unit }: ForecastCardProps) => {
  const date = formatDate(new Date(forecast.date).getTime() / 1000);
  const iconUrl = `https://openweathermap.org/img/wn/${forecast.condition.icon}@2x.png`;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
      <p className="text-sm font-semibold text-gray-600 mb-2">{date}</p>
      
      <div className="flex items-center justify-center mb-3">
        <img 
          src={iconUrl} 
          alt={forecast.condition.description}
          className="w-16 h-16"
        />
      </div>
      
      <p className="text-center text-sm text-gray-600 capitalize mb-2">
        {forecast.condition.description}
      </p>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Max:</span>
        <span className="font-bold text-gray-800">
          {formatTemperature(forecast.temperature.max, unit)}
        </span>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Min:</span>
        <span className="font-bold text-gray-800">
          {formatTemperature(forecast.temperature.min, unit)}
        </span>
      </div>
      
      <div className="border-t pt-2 mt-2 space-y-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>💧 {Math.round(forecast.precipitation.probability)}%</span>
          <span>💨 {forecast.wind.speed.toFixed(1)} m/s</span>
        </div>
        
        <div className="flex justify-between text-xs text-gray-600">
          <span>☁️ {forecast.cloudiness}%</span>
          <span>🧭 {getWindDirection(forecast.wind.direction)}</span>
        </div>
      </div>
    </div>
  );
};
