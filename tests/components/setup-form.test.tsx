import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetupForm } from '@/app/setup/setup-form';
import { bootstrapDatabase } from '@/lib/actions/setup';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

vi.mock('@/lib/actions/setup', () => ({
  bootstrapDatabase: vi.fn(),
}));

describe('SetupForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<SetupForm />);
    expect(screen.getByLabelText('Judul Situs')).toBeDefined();
  });

  it('shows loading overlay when submitting', async () => {
    const user = userEvent.setup();
    vi.mocked(bootstrapDatabase).mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 500)));
    
    render(<SetupForm />);
    
    await user.type(screen.getByLabelText('Judul Situs'), 'Test');
    await user.type(screen.getByLabelText('Tagline'), 'Tag');
    await user.click(screen.getByRole('button', { name: /Install & Initialize/i }));
    
    // Check for loading text
    expect(await screen.findByText('Menginstal Database...')).toBeDefined();
  });

  it('shows error message if bootstrap fails', async () => {
    const user = userEvent.setup();
    vi.mocked(bootstrapDatabase).mockRejectedValueOnce(new Error('Auth failed'));
    
    render(<SetupForm />);
    
    await user.type(screen.getByLabelText('Judul Situs'), 'Test');
    await user.type(screen.getByLabelText('Tagline'), 'Tag');
    await user.click(screen.getByRole('button', { name: /Install & Initialize/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Instalasi Gagal')).toBeDefined();
      expect(screen.getByText('Auth failed')).toBeDefined();
    });
  });
});
