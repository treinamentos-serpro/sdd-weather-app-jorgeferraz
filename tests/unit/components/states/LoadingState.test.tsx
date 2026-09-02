import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LoadingState from '../../../../src/components/states/LoadingState';

describe('LoadingState', () => {
  it('anuncia o carregamento com texto visível', () => {
    render(<LoadingState label="Buscando previsão" />);

    expect(screen.getByRole('status')).toHaveTextContent('Buscando previsão');
  });
});
