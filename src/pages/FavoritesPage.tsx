import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common';
import { CityCard } from '../components/weather';
import { LoadingSpinner } from '../components/common';
import { useAppSelector } from '../hooks/useRedux';
import { DEFAULT_CITIES } from '../constants';
import { fetchWeatherData } from '../services';
import type { WeatherData } from '../types';

export const FavoritesPage = () => {
  const favorites = useAppSelector(state => state.favorites.cityIds);
  const [weatherData, setWeatherData] = useState<Map<string, WeatherData>>(new Map());
  const [loading, setLoading] = useState(true);

  const favoriteCities = useMemo(() => 
    DEFAULT_CITIES.filter(city => favorites.includes(city.id)),
    [favorites]
  );

  useEffect(() => {
    const loadWeatherData = async () => {
      if (favoriteCities.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const promises = favoriteCities.map(city =>
          fetchWeatherData(city.id).then(data => ({ cityId: city.id, data }))
        );
        
        const results = await Promise.all(promises);
        const newMap = new Map<string, WeatherData>();
        results.forEach(({ cityId, data }) => newMap.set(cityId, data));
        setWeatherData(newMap);
      } catch (error) {
        console.error('Failed to load weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [favoriteCities]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">← Powrót</Button>
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Ulubione Miasta
        </h1>
        <p className="text-gray-600">
          {favoriteCities.length > 0
            ? `Masz ${favoriteCities.length} ${favoriteCities.length === 1 ? 'ulubione miasto' : 'ulubionych miast'}`
            : 'Nie masz jeszcze żadnych ulubionych miast'}
        </p>
      </header>

      {favoriteCities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-gray-600 text-lg mb-6">
            Dodaj miasta do ulubionych, aby szybko sprawdzać ich pogodę
          </p>
          <Link to="/">
            <Button>Przejdź do listy miast</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCities.map(city => {
            const data = weatherData.get(city.id);
            return (
              <CityCard
                key={city.id}
                city={city}
                temperature={data?.current.temperature.current}
                condition={data?.current.condition.main}
                icon={data?.current.condition.icon}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
