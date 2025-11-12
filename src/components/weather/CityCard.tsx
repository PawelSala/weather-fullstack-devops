import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { City } from '../../types';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { toggleFavorite } from '../../features/favorites/favoritesSlice';
import { formatTemperature } from '../../utils';

interface CityCardProps {
  city: City;
  temperature?: number;
  condition?: string;
  icon?: string;
}

export const CityCard = ({ city, temperature, condition, icon }: CityCardProps) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.cityIds);
  const temperatureUnit = useAppSelector(state => state.settings.temperatureUnit);
  
  const isFavorite = useMemo(() => 
    favorites.includes(city.id), 
    [favorites, city.id]
  );

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(toggleFavorite(city.id));
  };
  
  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null;

  return (
    <Link
      to={`/city/${city.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-xl 
        transition-all duration-300 transform hover:-translate-y-1 p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{city.name}</h3>
          <p className="text-sm text-gray-500">{city.country}</p>
        </div>
        <button
          onClick={handleToggleFavorite}
          className="text-2xl hover:scale-110 transition-transform"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>

      {temperature !== undefined && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {iconUrl ? (
              <img 
                src={iconUrl} 
                alt={condition || 'weather'} 
                className="w-16 h-16"
              />
            ) : (
              <span className="text-4xl">☀️</span>
            )}
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {temperature !== undefined && formatTemperature(temperature, temperatureUnit)}
              </p>
              <p className="text-sm text-gray-600 capitalize">{condition}</p>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
};
