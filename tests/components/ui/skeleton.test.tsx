import { render, screen } from '@testing-library/react';
import { Skeleton } from '@/components/ui/skeleton';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Skeleton Component', () => {
  it('renders correctly', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.className).toContain('animate-pulse');
  });

  it('applies custom class names', () => {
    render(<Skeleton data-testid="skeleton" className="h-4 w-4" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton.className).toContain('h-4 w-4');
  });
});
