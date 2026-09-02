export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeather {
  temperatureC: number;
  weatherCode: number;
  observedAt: string;
  humidity: number | null;
  windSpeed: number | null;
  precipitation: number | null;
  pressure: number | null;
}

export interface ForecastDay {
  date: string;
  weatherCode: number | null;
  temperatureMaxC: number | null;
  temperatureMinC: number | null;
  precipitationProbability: number | null;
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  forecast: ForecastDay[];
}