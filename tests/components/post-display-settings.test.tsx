import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PostDisplaySettings from '@/components/admin/settings/post-display-settings';
import { setOptions } from '@/lib/actions/options';

vi.mock('@/lib/actions/options', () => ({ setOptions: vi.fn(async () => ({ success: true })) }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const values = { credits: true, writer: true, date_reading: true, share: false, terms: true };

beforeEach(() => {
  vi.mocked(setOptions).mockClear();
});

describe('PostDisplaySettings', () => {
  it('shows one switch per part with its saved state', () => {
    render(<PostDisplaySettings values={values} theme="portfolio" />);

    expect(screen.getByRole('checkbox', { name: 'Credits (reporter and editor)' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('checkbox', { name: 'Writer (author)' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('checkbox', { name: 'Date and reading time' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('checkbox', { name: 'Share buttons' }).getAttribute('aria-checked')).toBe('false');
    expect(screen.getByRole('checkbox', { name: 'Categories and tags' }).getAttribute('aria-checked')).toBe('true');
  });

  it('marks only the switch that the active theme shows partly', () => {
    render(<PostDisplaySettings values={values} theme="default" />);

    const notes = screen.getAllByText(/partly shown in this theme/i);
    expect(notes).toHaveLength(1);
    expect(notes[0].closest('[data-part]')?.getAttribute('data-part')).toBe('date_reading');
  });

  it('saves all five switches with their on or off value, and nothing else', async () => {
    render(<PostDisplaySettings values={values} theme="portfolio" />);

    await userEvent.click(screen.getByRole('checkbox', { name: 'Share buttons' }));
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(setOptions).toHaveBeenCalledWith({
      post_display_credits: 'true',
      post_display_writer: 'true',
      post_display_date_reading: 'true',
      post_display_share: 'true',
      post_display_terms: 'true',
    });
  });
});
