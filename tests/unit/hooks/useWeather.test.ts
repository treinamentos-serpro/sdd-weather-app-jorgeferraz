import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import useWeather from '../../../src/hooks/useWeather';
import * as weatherService from '../../../src/services/weatherService';
import type { City, WeatherData } from '../../../src/types/weather';

vi.mock('../../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

const city: City = {
  id: 3448439,
  name: 'São Paulo',
  country: 'Brazil',
  latitude: -23.5475,
  longitude: -46.6361,
  timezone: 'America/Sao_Paulo',
};

const weather: WeatherData = {
  city,
  current: {
    temperatureC: 21.4,
    weatherCode: 3,
    observedAt: '2026-09-02T14:00',
    humidity: 68,
    windSpeed: 12.5,
    precipitation: 0,
    pressure: 1017.2,
  },
  forecast: [],
};

describe('useWeather', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('busca cidades e carrega automaticamente o clima da primeira', async () => {
    vi.mocked(weatherService.searchCities).mockResolvedValue([city]);
    vi.mocked(weatherService.getWeather).mockResolvedValue(weather);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search(' São Paulo ');
    });

    expect(result.current).toMatchObject({
      status: 'success',
      data: weather,
      cities: [city],
      error: null,
      query: 'São Paulo',
    });
    expect(weatherService.getWeather).toHaveBeenCalledWith(city);
  });

  it('expõe empty quando a busca não encontra cidades', async () => {
    vi.mocked(weatherService.searchCities).mockResolvedValue([]);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('Cidade inexistente');
    });

    expect(result.current.status).toBe('empty');
    expect(weatherService.getWeather).not.toHaveBeenCalled();
  });

  it('repete a última busca ao tentar novamente', async () => {
    vi.mocked(weatherService.searchCities)
      .mockRejectedValueOnce(new Error('Falha de rede.'))
      .mockResolvedValueOnce([city]);
    vi.mocked(weatherService.getWeather).mockResolvedValue(weather);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.search('São Paulo');
    });
    expect(result.current.status).toBe('error');

    await act(async () => {
      await result.current.retry();
    });

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(weatherService.searchCities).toHaveBeenCalledTimes(2);
  });
});
