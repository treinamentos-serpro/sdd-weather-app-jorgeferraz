import { afterEach, describe, expect, it, vi } from 'vitest';

import { searchCities, WeatherServiceError } from '../../../src/services/weatherService';

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