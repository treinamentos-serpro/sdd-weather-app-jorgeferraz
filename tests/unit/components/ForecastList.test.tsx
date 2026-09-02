import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ForecastList from '../../../src/components/ForecastList';
import weatherData from '../../../src/fixtures/weatherData';

describe('ForecastList', () => {
  it('renderiza cinco cards em ordem cronológica', () => {
    render(<ForecastList forecast={weatherData.forecast} unit="celsius" />);

    const cards = screen.getAllByRole('article');
    const dates = screen.getAllByRole('time').map((element) => element.getAttribute('dateTime'));

    expect(cards).toHaveLength(5);
    expect(dates).toEqual(weatherData.forecast.map((day) => day.date));
  });
});