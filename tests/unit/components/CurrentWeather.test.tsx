import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import CurrentWeather from '../../../src/components/CurrentWeather';
import weatherData from '../../../src/fixtures/weatherData';

describe('CurrentWeather', () => {
  it('exibe cidade, condição, temperatura em Celsius e métricas', () => {
    render(<CurrentWeather city={weatherData.city} current={weatherData.current} unit="celsius" />);

    expect(screen.getByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getByText('21 °C')).toBeInTheDocument();
    expect(screen.getByText('Nublado')).toBeInTheDocument();
    expect(screen.getByText('68 %')).toBeInTheDocument();
    expect(screen.getByText('12.5 km/h')).toBeInTheDocument();
    expect(screen.getByText('0 mm')).toBeInTheDocument();
    expect(screen.getByText('1017.2 hPa')).toBeInTheDocument();
  });

  it('converte a temperatura para Fahrenheit', () => {
    render(<CurrentWeather city={weatherData.city} current={weatherData.current} unit="fahrenheit" />);

    expect(screen.getByText('71 °F')).toBeInTheDocument();
  });

  it('não expõe códigos meteorológicos desconhecidos', () => {
    render(
      <CurrentWeather
        city={weatherData.city}
        current={{ ...weatherData.current, weatherCode: 999 }}
        unit="celsius"
      />,
    );

    expect(screen.getByText('Indisponível')).toBeInTheDocument();
    expect(screen.queryByText('999')).not.toBeInTheDocument();
  });
});