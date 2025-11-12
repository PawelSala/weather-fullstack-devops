import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { setTemperatureUnit } from '../../features/settings/settingsSlice';
import type { TemperatureUnit } from '../../types';

export const Navbar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const temperatureUnit = useAppSelector(state => state.settings.temperatureUnit);
  const favoritesCount = useAppSelector(state => state.favorites.cityIds.length);

  const handleUnitChange = (unit: TemperatureUnit) => {
    dispatch(setTemperatureUnit(unit));
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🌤️</span>
              <span className="text-xl font-bold text-gray-800">Pogoda</span>
            </Link>

            <div className="hidden md:flex gap-4">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/')
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Miasta
              </Link>
              <Link
                to="/favorites"
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  isActive('/favorites')
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Ulubione
                {favoritesCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            {(['celsius', 'fahrenheit', 'kelvin'] as TemperatureUnit[]).map(unit => (
              <button
                key={unit}
                onClick={() => handleUnitChange(unit)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  temperatureUnit === unit
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {unit === 'celsius' ? '°C' : unit === 'fahrenheit' ? '°F' : 'K'}
              </button>
            ))}
          </div>
        </div>

        <div className="md:hidden pb-3 flex gap-2">
          <Link
            to="/"
            className={`flex-1 text-center px-4 py-2 rounded-lg transition-colors ${
              isActive('/')
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Miasta
          </Link>
          <Link
            to="/favorites"
            className={`flex-1 text-center px-4 py-2 rounded-lg transition-colors ${
              isActive('/favorites')
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Ulubione {favoritesCount > 0 && `(${favoritesCount})`}
          </Link>
        </div>
      </div>
    </nav>
  );
};
