import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { PostCreditsFields } from '@/components/admin/post-credits-fields';

const users = [
  { id: 'rina', name: 'Rina Reporter', email: 'rina@example.com' },
  { id: 'edo', name: null, email: 'edo@example.com' },
];

describe('PostCreditsFields', () => {
  it('offers every user in both selects, showing the email when a user has no name', () => {
    render(<PostCreditsFields users={users} reporterId={null} editorId={null} onChange={vi.fn()} />);

    for (const label of ['Reporter', 'Editor']) {
      const select = screen.getByLabelText(label);
      const options = Array.from(select.querySelectorAll('option')).map((o) => o.textContent);
      expect(options).toEqual(['— None —', 'Rina Reporter', 'edo@example.com']);
    }
  });

  it('shows the credits the post already has', () => {
    render(<PostCreditsFields users={users} reporterId="rina" editorId="edo" onChange={vi.fn()} />);

    expect((screen.getByLabelText('Reporter') as HTMLSelectElement).value).toBe('rina');
    expect((screen.getByLabelText('Editor') as HTMLSelectElement).value).toBe('edo');
  });

  it('reports the new reporter and keeps the editor', async () => {
    const onChange = vi.fn();
    render(<PostCreditsFields users={users} reporterId={null} editorId="edo" onChange={onChange} />);

    await userEvent.selectOptions(screen.getByLabelText('Reporter'), 'rina');

    expect(onChange).toHaveBeenCalledWith({ reporterId: 'rina', editorId: 'edo' });
  });

  it('reports null when "None" is chosen for the editor', async () => {
    const onChange = vi.fn();
    render(<PostCreditsFields users={users} reporterId="rina" editorId="edo" onChange={onChange} />);

    await userEvent.selectOptions(screen.getByLabelText('Editor'), '');

    expect(onChange).toHaveBeenCalledWith({ reporterId: 'rina', editorId: null });
  });
});
