import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ForecastCard from '../../../src/components/ForecastCard';
import weatherData from '../../../src/fixtures/weatherData';

describe('ForecastCard', () => {
  it('exibe a condição, temperaturas e probabilidade de chuva', () => {
    render(<ForecastCard day={weatherData.forecast[0]!} unit="celsius" />);

    expect(screen.getByText('Nublado')).toBeInTheDocument();
    expect(screen.getByText('24 °C')).toBeInTheDocument();
    expect(screen.getByText('15 °C')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  it('converte a temperatura e comunica valores ausentes', () => {
    render(
      <ForecastCard
        day={{ ...weatherData.forecast[0]!, temperatureMinC: null, precipitationProbability: null }}
        unit="fahrenheit"
      />,
    );

    expect(screen.getByText('75 °F')).toBeInTheDocument();
    expect(screen.getAllByText('Indisponível')).toHaveLength(2);
  });
});