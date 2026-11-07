import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { PostCredits } from '@/components/post-credits';

describe('PostCredits', () => {
  it('lists every reporter and every editor by name', () => {
    render(
      <PostCredits
        reporters={[{ name: 'Rina Reporter' }, { name: 'Budi Kontributor' }]}
        editors={[{ name: 'Edo Editor' }, { name: 'Eka Editor' }]}
      />
    );

    expect(screen.getByText('Reporter: Rina Reporter, Budi Kontributor')).toBeDefined();
    expect(screen.getByText('Editor: Edo Editor, Eka Editor')).toBeDefined();
  });

  it('shows only the role that has people', () => {
    render(<PostCredits reporters={[{ name: 'Rina Reporter' }]} editors={[]} />);

    expect(screen.getByText('Reporter: Rina Reporter')).toBeDefined();
    expect(screen.queryByText(/Editor:/)).toBeNull();
  });

  it('renders nothing when there are no credits', () => {
    const { container } = render(<PostCredits reporters={[]} editors={undefined} />);

    expect(container.innerHTML).toBe('');
  });
});
