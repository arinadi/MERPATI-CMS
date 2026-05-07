import { render, screen } from '@testing-library/react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('DropdownMenu Components', () => {
  it('renders DropdownMenu Trigger correctly', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByTestId('trigger')).toBeDefined();
  });
});
