import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PostWriter } from '@/components/admin/post-writer';

describe('PostWriter', () => {
  it('shows the post author as penulis', () => {
    render(<PostWriter name="Wati Writer" />);

    expect(screen.getByText('Penulis: Wati Writer')).toBeDefined();
  });

  it('gives no way to change the writer', () => {
    render(<PostWriter name="Wati Writer" />);

    expect(screen.queryByRole('combobox')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows a dash when the author has no name, never an email', () => {
    render(<PostWriter name={null} />);

    expect(screen.getByText('Penulis: —')).toBeDefined();
  });
});
