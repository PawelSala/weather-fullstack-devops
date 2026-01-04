import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Input } from '../common';
import { searchCitiesByName, getLocalizedCityName } from '../../services/geocoding.service';
import type { City, GeocodingResult } from '../../types';

interface SearchBarProps {
  cities?: City[];
  onCitySelect?: (city: { name: string; country: string; coordinates: { lat: number; lon: number } }) => void;
  placeholder?: string;
}

export const SearchBar = ({ 
  cities = [],
  onCitySelect,
  placeholder = 'Szukaj miasta...' 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      const results = await searchCitiesByName(query, 5);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setIsLoading(false);
    }, 400);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleCityClick = useCallback((suggestion: GeocodingResult) => {
    const city = {
      name: getLocalizedCityName(suggestion),
      country: suggestion.country,
      coordinates: {
        lat: suggestion.lat,
        lon: suggestion.lon
      }
    };
    setQuery('');
    setIsOpen(false);
    setSuggestions([]);
    onCitySelect?.(city);
  }, [onCitySelect]);

  const filteredLocalCities = useMemo(() => {
    if (suggestions.length > 0 || !query.trim()) return [];
    
    return cities.filter(city =>
      city.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, [cities, query, suggestions]);

  return (
    <div className="relative w-full max-w-md">
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => {
          if (query.trim() && (suggestions.length > 0 || filteredLocalCities.length > 0)) {
            setIsOpen(true);
          }
        }}
        placeholder={placeholder}
        className="pr-10"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        {isLoading ? '⏳' : '🔍'}
      </span>

      {isOpen && (suggestions.length > 0 || filteredLocalCities.length > 0) && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-20 overflow-hidden">
            {suggestions.map((suggestion, idx) => {
              const localizedName = getLocalizedCityName(suggestion);
              const showOriginalName = localizedName !== suggestion.name;
              
              return (
                <button
                  key={`${suggestion.name}-${suggestion.country}-${idx}`}
                  onClick={() => handleCityClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{localizedName}</span>
                    {showOriginalName && (
                      <span className="text-xs text-gray-400">{suggestion.name}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>{suggestion.country}</span>
                    {suggestion.state && <span className="ml-1">({suggestion.state})</span>}
                  </div>
                </button>
              );
            })}
            
            {filteredLocalCities.map(city => (
              <button
                key={city.id}
                onClick={() => handleCityClick({
                  name: city.name,
                  lat: city.coordinates.lat,
                  lon: city.coordinates.lon,
                  country: city.country
                })}
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

