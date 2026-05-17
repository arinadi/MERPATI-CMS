import { render, screen } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Avatar Components', () => {
  it('renders Avatar correctly', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByTestId('avatar')).toBeDefined();
    // The fallback should be in the DOM
    expect(screen.getByText('CN')).toBeDefined();
  });

  it('renders fallback when no image provided', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('AB')).toBeDefined();
  });
});
