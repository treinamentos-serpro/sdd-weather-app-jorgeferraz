import { useRef, useState } from 'react';

import { getWeather, searchCities } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';
type LastOperation = { type: 'search'; name: string } | { type: 'select'; city: City };

interface UseWeatherResult {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Não foi possível consultar o clima.';
}

export default function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const requestIdRef = useRef(0);
  const lastOperationRef = useRef<LastOperation | null>(null);

  async function loadWeather(city: City, requestId: number) {
    try {
      const weather = await getWeather(city);
      if (requestId !== requestIdRef.current) {
        return;
      }

      setData(weather);
      setStatus('success');
    } catch (caughtError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(getErrorMessage(caughtError));
      setStatus('error');
    }
  }

  async function selectCity(city: City) {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    lastOperationRef.current = { type: 'select', city };
    setStatus('loading');
    setData(null);
    setError(null);

    await loadWeather(city, requestId);
  }

  async function search(name: string) {
    const normalizedName = name.trim();
    if (!normalizedName) {
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    lastOperationRef.current = { type: 'search', name: normalizedName };
    setQuery(normalizedName);
    setStatus('loading');
    setData(null);
    setError(null);

    try {
      const results = await searchCities(normalizedName);
      if (requestId !== requestIdRef.current) {
        return;
      }

      setCities(results);
      if (results.length === 0) {
        setStatus('empty');
        return;
      }

      await loadWeather(results[0], requestId);
    } catch (caughtError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(getErrorMessage(caughtError));
      setStatus('error');
    }
  }

  async function retry() {
    const lastOperation = lastOperationRef.current;
    if (!lastOperation) {
      return;
    }

    if (lastOperation.type === 'search') {
      await search(lastOperation.name);
      return;
    }

    await selectCity(lastOperation.city);
  }

  return { status, data, cities, error, query, search, selectCity, retry };
}