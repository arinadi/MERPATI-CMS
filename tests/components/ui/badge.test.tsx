import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText('Draft')).toBeDefined();
  });

  it('applies variant classes', () => {
    render(<Badge variant="destructive">Critical</Badge>);
    const badge = screen.getByText('Critical');
    expect(badge.className).toContain('bg-destructive');
  });

  it('renders as a custom element when asChild is used', () => {
    render(
      <Badge asChild>
        <a href="/">Link</a>
      </Badge>
    );
    const link = screen.getByRole('link');
    expect(link.className).toContain('bg-primary');
  });
});
