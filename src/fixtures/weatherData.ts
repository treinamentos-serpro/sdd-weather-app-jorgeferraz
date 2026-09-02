import type { WeatherData } from '../types/weather';

const weatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    admin1: 'São Paulo',
    country: 'Brasil',
    countryCode: 'BR',
    latitude: -23.5505,
    longitude: -46.6333,
    timezone: 'America/Sao_Paulo',
  },
  current: {
    temperatureC: 21.4,
    weatherCode: 3,
    observedAt: '2026-09-02T14:00',
    humidity: 68,
    windSpeed: 12.5,
    precipitation: 0,
    pressure: 1017.2,
  },
  forecast: [
    {
      date: '2026-09-02',
      weatherCode: 3,
      temperatureMaxC: 24.1,
      temperatureMinC: 15.2,
      precipitationProbability: 10,
    },
    {
      date: '2026-09-03',
      weatherCode: 61,
      temperatureMaxC: 22,
      temperatureMinC: 14.8,
      precipitationProbability: 75,
    },
    {
      date: '2026-09-04',
      weatherCode: 2,
      temperatureMaxC: 25.3,
      temperatureMinC: 16,
      precipitationProbability: 25,
    },
    {
      date: '2026-09-05',
      weatherCode: 1,
      temperatureMaxC: 26,
      temperatureMinC: 16.5,
      precipitationProbability: 5,
    },
    {
      date: '2026-09-06',
      weatherCode: 0,
      temperatureMaxC: 27.1,
      temperatureMinC: 17,
      precipitationProbability: 0,
    },
  ],
} satisfies WeatherData;

export default weatherData;