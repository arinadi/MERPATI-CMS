import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDefined();
  });

  it('applies default classes', () => {
    render(<Button>Button</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-primary');
  });

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-destructive');
  });

  it('is disabled when the disabled prop is passed', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
