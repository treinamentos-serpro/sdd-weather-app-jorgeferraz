import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10_000;

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

interface ForecastResponse {
  current?: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    relative_humidity_2m?: number | null;
    wind_speed_10m?: number | null;
    precipitation?: number | null;
    surface_pressure?: number | null;
  };
  daily?: {
    time: string[];
    weather_code?: Array<number | null>;
    temperature_2m_max?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
    precipitation_probability_max?: Array<number | null>;
  };
}

export async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new WeatherServiceError('A requisição demorou demais.', 'timeout');
    }

    throw new WeatherServiceError('Falha de rede.', 'network');
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function searchCities(name: string): Promise<City[]> {
  if (!name.trim()) {
    return [];
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=5&language=pt&format=json`;
  const response = await fetchWithTimeout(url);

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

export async function getWeather(city: City): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current:
      'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '5',
  });
  const response = await fetchWithTimeout(`${FORECAST_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível obter a previsão do tempo.');
  }

  const payload = (await response.json()) as ForecastResponse;
  if (!payload.current || !payload.daily) {
    throw new WeatherServiceError('A resposta da previsão está incompleta.');
  }

  const current: CurrentWeather = {
    temperatureC: payload.current.temperature_2m,
    weatherCode: payload.current.weather_code,
    observedAt: payload.current.time,
    humidity: payload.current.relative_humidity_2m ?? null,
    windSpeed: payload.current.wind_speed_10m ?? null,
    precipitation: payload.current.precipitation ?? null,
    pressure: payload.current.surface_pressure ?? null,
  };
  const forecast: ForecastDay[] = payload.daily.time.slice(0, 5).map((date, index) => ({
    date,
    weatherCode: payload.daily?.weather_code?.[index] ?? null,
    temperatureMaxC: payload.daily?.temperature_2m_max?.[index] ?? null,
    temperatureMinC: payload.daily?.temperature_2m_min?.[index] ?? null,
    precipitationProbability: payload.daily?.precipitation_probability_max?.[index] ?? null,
  }));

  return { city, current, forecast };
}