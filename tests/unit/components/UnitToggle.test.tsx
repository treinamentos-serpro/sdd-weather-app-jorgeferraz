import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import UnitToggle from '../../../src/components/UnitToggle';

describe('UnitToggle', () => {
  it('expõe o grupo e a unidade ativa com aria-pressed', () => {
    render(<UnitToggle onChange={vi.fn()} unit="celsius" />);

    expect(screen.getByRole('group', { name: 'Unidade de temperatura' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '°C' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '°F' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('altera a unidade por clique, Enter e Espaço', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<UnitToggle onChange={onChange} unit="celsius" />);

    const fahrenheit = screen.getByRole('button', { name: '°F' });
    await user.click(fahrenheit);
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith('fahrenheit');
  });

  it('marca uma nova unidade quando a prop muda', () => {
    const { rerender } = render(<UnitToggle onChange={vi.fn()} unit="celsius" />);

    rerender(<UnitToggle onChange={vi.fn()} unit="fahrenheit" />);

    expect(screen.getByRole('button', { name: '°C' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: '°F' })).toHaveAttribute('aria-pressed', 'true');
  });
});