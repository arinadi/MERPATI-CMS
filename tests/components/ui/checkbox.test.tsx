import { render, screen } from '@testing-library/react';
import { Checkbox } from '@/components/ui/checkbox';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Checkbox Component', () => {
  it('renders correctly', () => {
    render(<Checkbox data-testid="checkbox" />);
    expect(screen.getByTestId('checkbox')).toBeDefined();
  });

  it('applies custom class names', () => {
    render(<Checkbox data-testid="checkbox" className="custom-checkbox" />);
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox.className).toContain('custom-checkbox');
  });
});
