import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { PostCredits } from '@/components/post-credits';

describe('PostCredits', () => {
  it('shows the reporter and the editor by name', () => {
    render(<PostCredits reporter={{ name: 'Rina Reporter' }} editor={{ name: 'Edo Editor' }} />);

    expect(screen.getByText('Reporter: Rina Reporter')).toBeDefined();
    expect(screen.getByText('Editor: Edo Editor')).toBeDefined();
  });

  it('shows only the credit that is set', () => {
    render(<PostCredits reporter={{ name: 'Rina Reporter' }} editor={null} />);

    expect(screen.getByText('Reporter: Rina Reporter')).toBeDefined();
    expect(screen.queryByText(/Editor:/)).toBeNull();
  });

  it('renders nothing when there are no credits', () => {
    const { container } = render(<PostCredits reporter={null} editor={null} />);

    expect(container.innerHTML).toBe('');
  });

  it('renders nothing for a credited user who has no name', () => {
    const { container } = render(<PostCredits reporter={{ name: null }} editor={undefined} />);

    expect(container.innerHTML).toBe('');
  });
});
