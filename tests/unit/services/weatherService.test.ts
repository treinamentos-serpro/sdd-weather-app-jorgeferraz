import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getWeather,
  searchCities,
  WeatherServiceError,
} from '../../../src/services/weatherService';
import type { City } from '../../../src/types/weather';

const city: City = {
  id: 3448439,
  name: 'São Paulo',
  country: 'Brazil',
  latitude: -23.5475,
  longitude: -46.6361,
  timezone: 'America/Sao_Paulo',
};

describe('searchCities', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('retorna uma lista vazia sem chamar a rede para um nome vazio', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('   ')).resolves.toEqual([]);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('codifica o nome e mapeia os resultados para cidades', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            id: 3448439,
            name: 'São Paulo',
            admin1: 'São Paulo',
            country: 'Brazil',
            country_code: 'BR',
            latitude: -23.5475,
            longitude: -46.6361,
            timezone: 'America/Sao_Paulo',
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('São Paulo')).resolves.toEqual([
      {
        id: 3448439,
        name: 'São Paulo',
        admin1: 'São Paulo',
        country: 'Brazil',
        countryCode: 'BR',
        latitude: -23.5475,
        longitude: -46.6361,
        timezone: 'America/Sao_Paulo',
      },
    ]);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Paulo&count=5&language=pt&format=json',
    );
  });

  it('lança WeatherServiceError para uma resposta não-ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(searchCities('Recife')).rejects.toBeInstanceOf(WeatherServiceError);
  });
});

describe('getWeather', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('normaliza o clima atual e os cinco dias de previsão', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          time: '2026-09-02T14:00',
          temperature_2m: 21.4,
          weather_code: 3,
          relative_humidity_2m: 68,
          wind_speed_10m: 12.5,
          precipitation: 0,
          surface_pressure: 1017.2,
        },
        daily: {
          time: ['2026-09-02', '2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06'],
          weather_code: [3, 61, 2, 1, 0],
          temperature_2m_max: [24.1, 22, 25.3, 26, 27.1],
          temperature_2m_min: [15.2, 14.8, null, 16.5, 17],
          precipitation_probability_max: [10, 75, 25, 5, 0],
        },
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const weather = await getWeather(city);

    expect(weather.current).toMatchObject({ temperatureC: 21.4, weatherCode: 3 });
    expect(weather.forecast).toHaveLength(5);
    expect(weather.forecast[2]).toMatchObject({
      date: '2026-09-04',
      temperatureMinC: null,
    });
    expect(fetchMock.mock.calls[0][0]).toContain('forecast_days=5');
  });

  it('lança WeatherServiceError para uma resposta de previsão incompleta', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });
});