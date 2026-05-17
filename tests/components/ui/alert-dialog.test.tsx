import { render, screen } from '@testing-library/react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('AlertDialog Components', () => {
  it('renders Trigger correctly', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger data-testid="trigger">Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );
    
    const trigger = screen.getByTestId('trigger');
    expect(trigger).toBeDefined();
    expect(trigger.textContent).toBe('Open Dialog');
  });
});
