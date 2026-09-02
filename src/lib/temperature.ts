import type { Unit } from '../types/weather';

export function celsiusToFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32;
}

export function formatTemperature(temperatureC: number | null, unit: Unit): string {
  if (temperatureC === null) {
    return 'Indisponível';
  }

  const temperature = unit === 'fahrenheit' ? celsiusToFahrenheit(temperatureC) : temperatureC;
  return `${Math.round(temperature)} ${unit === 'fahrenheit' ? '°F' : '°C'}`;
}