import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import App from '../../src/App';

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exibe a orientação inicial e não altera o estado para uma busca vazia', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole('heading', { name: 'Pesquise uma cidade' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByRole('heading', { name: 'Pesquise uma cidade' })).toBeInTheDocument();
  });

  it('usa o fixture após uma busca válida sem acessar a rede', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    await user.type(screen.getByLabelText('Pesquisar cidade'), 'São Paulo{Enter}');

    expect(await screen.findByRole('heading', { name: 'São Paulo' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('exibe os estados vazio e erro, com nova tentativa', async () => {
    const user = userEvent.setup();

    render(<App />);

    const input = screen.getByLabelText('Pesquisar cidade');
    await user.type(input, 'vazio{Enter}');
    expect(await screen.findByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, 'erro{Enter}');
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
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