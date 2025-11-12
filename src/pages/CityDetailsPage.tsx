import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LoadingSpinner, Button } from '../components/common';
import { WeatherDetails, ForecastCard } from '../components/weather';
import { fetchWeatherData } from '../services';
import { DEFAULT_CITIES } from '../constants';
import { formatTemperature } from '../utils';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { toggleFavorite } from '../features/favorites/favoritesSlice';
import type { WeatherData } from '../types';

export const CityDetailsPage = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const temperatureUnit = useAppSelector(state => state.settings.temperatureUnit);
  const favorites = useAppSelector(state => state.favorites.cityIds);

  const city = DEFAULT_CITIES.find(c => c.id === cityId);
  const isFavorite = city ? favorites.includes(city.id) : false;

  useEffect(() => {
    if (!cityId) {
      navigate('/');
      return;
    }

    const loadWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWeatherData(cityId);
        setWeatherData(data);
      } catch (err) {
        setError('Nie udało się załadować danych pogodowych');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [cityId, navigate]);

  const handleToggleFavorite = () => {
    if (city) {
      dispatch(toggleFavorite(city.id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !weatherData || !city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'Miasto nie znalezione'}</p>
          <Link to="/">
            <Button>Powrót do strony głównej</Button>
          </Link>
        </div>
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

      <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-1">
              {weatherData.current.cityName}
            </h1>
            <p className="text-gray-600">{weatherData.current.country}</p>
          </div>
          <button
            onClick={handleToggleFavorite}
            className="text-3xl hover:scale-110 transition-transform"
            aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
        </div>

        <div className="flex items-center gap-6 mb-8">
          <span className="text-8xl">
            {weatherData.current.condition.icon || '☀️'}
          </span>
          <div>
            <p className="text-6xl font-bold text-gray-800">
              {formatTemperature(weatherData.current.temperature.current, temperatureUnit)}
            </p>
            <p className="text-xl text-gray-600 capitalize mt-2">
              {weatherData.current.condition.description}
            </p>
            <p className="text-gray-500 mt-1">
              Min: {formatTemperature(weatherData.current.temperature.min, temperatureUnit)} • 
              Max: {formatTemperature(weatherData.current.temperature.max, temperatureUnit)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <WeatherDetails weather={weatherData.current} unit={temperatureUnit} />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Prognoza na 5 dni
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {weatherData.forecast.map((day, index) => (
            <ForecastCard key={index} forecast={day} unit={temperatureUnit} />
          ))}
        </div>
      </div>
    </div>
  );
};
