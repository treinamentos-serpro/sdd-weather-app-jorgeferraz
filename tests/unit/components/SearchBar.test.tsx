import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import SearchBar from '../../../src/components/SearchBar';

describe('SearchBar', () => {
  it('envia o termo tratado ao pressionar Enter', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByLabelText('Pesquisar cidade');
    await user.type(input, '  São Paulo  {Enter}');

    expect(onSearch).toHaveBeenCalledOnce();
    expect(onSearch).toHaveBeenCalledWith('São Paulo');
  });

  it('envia o termo ao clicar no botão', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByLabelText('Pesquisar cidade'), 'Recife');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledWith('Recife');
  });

  it('não envia valores vazios e não pesquisa durante a digitação', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByLabelText('Pesquisar cidade');
    await user.type(input, '   ');
    expect(onSearch).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('desabilita os controles e impede a busca', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar disabled onSearch={onSearch} />);

    const input = screen.getByLabelText('Pesquisar cidade');
    const button = screen.getByRole('button', { name: 'Buscar' });
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onSearch).not.toHaveBeenCalled();
  });
});