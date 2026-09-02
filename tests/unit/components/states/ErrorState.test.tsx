import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import ErrorState from '../../../../src/components/states/ErrorState';

describe('ErrorState', () => {
  it('exibe mensagem e chama a nova tentativa', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<ErrorState message="O serviço está indisponível." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('O serviço está indisponível.');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});