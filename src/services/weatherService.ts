import type { City } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export type WeatherServiceErrorKind = 'api' | 'network' | 'timeout';

export class WeatherServiceError extends Error {
  readonly kind: WeatherServiceErrorKind;

  constructor(message: string, kind: WeatherServiceErrorKind = 'api') {
    super(message);
    this.name = 'WeatherServiceError';
    this.kind = kind;
  }
}

interface GeocodingResult {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  country_code?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

export async function searchCities(name: string): Promise<City[]> {
  if (!name.trim()) {
    return [];
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=5&language=pt&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível buscar cidades.');
  }

  const payload = (await response.json()) as GeocodingResponse;

  return (payload.results ?? []).slice(0, 5).map((result) => ({
    id: result.id,
    name: result.name,
    admin1: result.admin1,
    country: result.country,
    countryCode: result.country_code,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  }));
}