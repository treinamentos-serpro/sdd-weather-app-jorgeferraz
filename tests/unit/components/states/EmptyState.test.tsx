import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import EmptyState from '../../../../src/components/states/EmptyState';

describe('EmptyState', () => {
  it('exibe título e dica', () => {
    render(<EmptyState title="Nenhuma cidade encontrada" hint="Tente outro termo." />);

    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeInTheDocument();
    expect(screen.getByText('Tente outro termo.')).toBeInTheDocument();
  });
});