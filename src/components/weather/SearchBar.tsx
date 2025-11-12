import { useState, useMemo, useCallback } from 'react';
import { Input } from '../common';
import type { City } from '../../types';

interface SearchBarProps {
  cities: City[];
  onCitySelect?: (city: City) => void;
  placeholder?: string;
}

export const SearchBar = ({ 
  cities, 
  onCitySelect,
  placeholder = 'Szukaj miasta...' 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCities = useMemo(() => {
    if (!query.trim()) return [];
    
    return cities.filter(city =>
      city.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, [cities, query]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  }, []);

  const handleCityClick = useCallback((city: City) => {
    setQuery('');
    setIsOpen(false);
    onCitySelect?.(city);
  }, [onCitySelect]);

  return (
    <div className="relative w-full max-w-md">
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="pr-10"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>

      {isOpen && filteredCities.length > 0 && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-20 overflow-hidden">
            {filteredCities.map(city => (
              <button
                key={city.id}
                onClick={() => handleCityClick(city)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between"
              >
                <span className="font-medium text-gray-800">{city.name}</span>
                <span className="text-sm text-gray-500">{city.country}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
