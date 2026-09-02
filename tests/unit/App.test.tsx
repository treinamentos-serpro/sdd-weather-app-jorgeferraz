import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import App from '../../src/App';
import weatherData from '../../src/fixtures/weatherData';
import * as weatherService from '../../src/services/weatherService';

vi.mock('../../src/services/weatherService', () => ({
  getWeather: vi.fn(),
  searchCities: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.mocked(weatherService.searchCities).mockResolvedValue([weatherData.city]);
    vi.mocked(weatherService.getWeather).mockResolvedValue(weatherData);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('exibe a orientação inicial e não altera o estado para uma busca vazia', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole('heading', { name: 'Pesquise uma cidade' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByRole('heading', { name: 'Pesquise uma cidade' })).toBeInTheDocument();
  });

  it('mostra o carregamento enquanto aguarda a busca', async () => {
    const user = userEvent.setup();
    let resolveSearch: (value: typeof weatherData.city[]) => void;
    vi.mocked(weatherService.searchCities).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSearch = resolve;
        }),
    );

    render(<App />);

    await user.type(screen.getByLabelText('Pesquisar cidade'), 'São Paulo{Enter}');

    expect(screen.getByRole('status')).toBeInTheDocument();
    resolveSearch!([weatherData.city]);

    expect(await screen.findByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
  });

  it('exibe dados retornados pelo service após uma busca válida', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText('Pesquisar cidade'), 'São Paulo{Enter}');

    expect(await screen.findByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
  });

  it('exibe os estados vazio e erro, com nova tentativa', async () => {
    const user = userEvent.setup();
    vi.mocked(weatherService.searchCities).mockResolvedValueOnce([]).mockRejectedValueOnce(
      new Error('Falha de rede.'),
    );

    render(<App />);

    const input = screen.getByLabelText('Pesquisar cidade');
    await user.type(input, 'Cidade inexistente{Enter}');
    expect(
      await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada' }),
    ).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, 'Falha{Enter}');
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
  });

  it('converte a temperatura atual e da previsão ao trocar a unidade', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText('Pesquisar cidade'), 'Recife{Enter}');
    await screen.findByRole('heading', { name: 'São Paulo' });
    await user.click(screen.getByRole('button', { name: '°F' }));

    expect(screen.getByText('71 °F')).toBeInTheDocument();
    expect(screen.getByText('75 °F')).toBeInTheDocument();
  });
});
