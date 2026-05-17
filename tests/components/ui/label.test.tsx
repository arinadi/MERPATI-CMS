import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Label Component', () => {
  it('renders children correctly', () => {
    render(<Label>Username</Label>);
    expect(screen.getByText('Username')).toBeDefined();
  });

  it('applies custom class names', () => {
    render(<Label className="custom-label">Password</Label>);
    const label = screen.getByText('Password');
    expect(label.className).toContain('custom-label');
  });

  it('applies peer-disabled styling', () => {
    render(<Label className="peer-disabled:cursor-not-allowed">Email</Label>);
    const label = screen.getByText('Email');
    expect(label.className).toContain('peer-disabled:cursor-not-allowed');
  });
});
