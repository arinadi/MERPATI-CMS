import { render, screen } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Dialog Components', () => {
  it('renders Dialog Trigger correctly', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button data-testid="trigger">Open</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByTestId('trigger')).toBeDefined();
  });
});
