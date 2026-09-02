import { describe, expect, it } from 'vitest';

import weatherData from '../../../src/fixtures/weatherData';
import type { WeatherData } from '../../../src/types/weather';

describe('weatherData fixture', () => {
  it('satisfaz o contrato de WeatherData e contém o clima atual completo', () => {
    const typedWeatherData: WeatherData = weatherData;

    expect(typedWeatherData.city).toMatchObject({
      name: 'São Paulo',
      country: 'Brasil',
    });
    expect(typedWeatherData.current).toMatchObject({
      humidity: expect.any(Number),
      windSpeed: expect.any(Number),
      precipitation: expect.any(Number),
      pressure: expect.any(Number),
    });
  });

  it('contém cinco dias únicos em ordem cronológica', () => {
    const dates = weatherData.forecast.map((day) => day.date);

    expect(weatherData.forecast).toHaveLength(5);
    expect(new Set(dates).size).toBe(5);
    expect(dates).toEqual([...dates].sort());
  });
});
