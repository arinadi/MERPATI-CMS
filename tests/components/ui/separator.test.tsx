import { render, screen } from '@testing-library/react';
import { Separator } from '@/components/ui/separator';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Separator Component', () => {
  it('renders correctly', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toBeDefined();
  });

  it('applies horizontal styling by default', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator.className).toContain('data-[orientation=horizontal]:w-full');
  });

  it('applies vertical styling', () => {
    render(<Separator data-testid="separator" orientation="vertical" />);
    const separator = screen.getByTestId('separator');
    expect(separator.className).toContain('data-[orientation=vertical]:h-full');
  });
});
