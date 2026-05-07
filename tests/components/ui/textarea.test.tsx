import { render, screen } from '@testing-library/react';
import { Textarea } from '@/components/ui/textarea';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Textarea Component', () => {
  it('renders correctly', () => {
    render(<Textarea placeholder="Type your message here." />);
    expect(screen.getByPlaceholderText('Type your message here.')).toBeDefined();
  });

  it('applies custom class names', () => {
    render(<Textarea data-testid="textarea" className="custom-textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea.className).toContain('custom-textarea');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Textarea disabled data-testid="textarea" />);
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeDisabled();
  });
});
