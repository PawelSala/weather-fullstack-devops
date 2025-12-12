import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CityCard, SearchBar } from '../components/weather';
import { LoadingSpinner } from '../components/common';
import { DEFAULT_CITIES } from '../constants';
import { fetchWeatherData } from '../services';
import { useAppSelector } from '../hooks/useRedux';
import type { City, WeatherData } from '../types';

interface SearchedCity {
  name: string;
  country: string;
  coordinates: { lat: number; lon: number };
}

export const HomePage = () => {
  const navigate = useNavigate();
  const temperatureUnit = useAppSelector(state => state.settings.temperatureUnit);
  const [weatherData, setWeatherData] = useState<Map<string, WeatherData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchQuery] = useState('');

  useEffect(() => {
    const loadWeatherData = async () => {
      setLoading(true);
      try {
        const promises = DEFAULT_CITIES.map(city =>
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
  }, []);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return DEFAULT_CITIES;
    
    return DEFAULT_CITIES.filter(city =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleCitySelect = useCallback((city: City) => {
    navigate(`/city/${city.id}`);
  }, [navigate]);

  const handleSearchedCitySelect = useCallback((city: SearchedCity) => {
    // Navigate to city details with query params for dynamic city
    const searchParams = new URLSearchParams({
      name: city.name,
      lat: city.coordinates.lat.toString(),
      lon: city.coordinates.lon.toString(),
      country: city.country
    });
    navigate(`/city/search?${searchParams.toString()}`);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Prognoza Pogody
        </h1>
        <p className="text-gray-600">
          Wybierz miasto, aby zobaczyć szczegółową prognozę
        </p>
      </header>

      <div className="mb-8">
        <SearchBar
          cities={DEFAULT_CITIES}
          onCitySelect={handleSearchedCitySelect}
          placeholder="Szukaj miasta..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map(city => {
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

      {filteredCities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nie znaleziono miast pasujących do zapytania
          </p>
        </div>
      )}
    </div>
  );
};
