import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/input';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Input Component', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeDefined();
  });

  it('applies custom class names', () => {
    render(<Input data-testid="input" className="my-custom-class" />);
    const input = screen.getByTestId('input');
    expect(input.className).toContain('my-custom-class');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
  });
});
