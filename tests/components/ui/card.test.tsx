import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Card Components', () => {
  it('renders Card correctly', () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');
    expect(card.textContent).toBe('Content');
    expect(card.className).toContain('rounded-xl border');
  });

  it('renders CardHeader correctly', () => {
    render(<CardHeader data-testid="card-header">Header</CardHeader>);
    const header = screen.getByTestId('card-header');
    expect(header.className).toContain('grid auto-rows-min');
  });

  it('renders CardTitle correctly', () => {
    render(<CardTitle data-testid="card-title">Title</CardTitle>);
    const title = screen.getByTestId('card-title');
    expect(title.className).toContain('font-semibold');
  });

  it('renders CardDescription correctly', () => {
    render(<CardDescription data-testid="card-desc">Desc</CardDescription>);
    const desc = screen.getByTestId('card-desc');
    expect(desc.className).toContain('text-sm text-muted-foreground');
  });

  it('renders CardContent correctly', () => {
    render(<CardContent data-testid="card-content">Main</CardContent>);
    const content = screen.getByTestId('card-content');
    expect(content.className).toContain('px-6');
  });

  it('renders CardFooter correctly', () => {
    render(<CardFooter data-testid="card-footer">Footer</CardFooter>);
    const footer = screen.getByTestId('card-footer');
    expect(footer.className).toContain('flex items-center px-6');
  });
});
