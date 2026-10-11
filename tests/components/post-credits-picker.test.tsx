import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import React from 'react';
import { PostCreditsPicker } from '@/components/admin/post-credits-picker';
import { createCreditPerson } from '@/lib/actions/people';

vi.mock('@/lib/actions/people', () => ({ createCreditPerson: vi.fn() }));

// cmdk and the popover need these browser APIs, which jsdom does not have.
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as never;
  Element.prototype.scrollIntoView ??= () => {};
});

const people = [
  { id: 'user:rina', name: 'Rina Reporter', userId: 'rina' },
  { id: 'user:edo', name: 'Edo Editor', userId: 'edo' },
  { id: 'p:b1', name: 'Budi Kontributor', userId: null },
];

function setup(props: Partial<React.ComponentProps<typeof PostCreditsPicker>> = {}) {
  const onChange = vi.fn();
  render(<PostCreditsPicker people={people} reporterIds={[]} editorIds={[]} onChange={onChange} {...props} />);
  return { onChange };
}

describe('PostCreditsPicker', () => {
  it('shows the chosen people as badges and says when nobody is chosen', () => {
    setup({ reporterIds: ['p:b1', 'user:rina'], editorIds: [] });

    expect(screen.getByRole('button', { name: 'Remove Budi Kontributor' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Remove Rina Reporter' })).toBeDefined();
    expect(screen.getAllByText(/Nobody chosen/i)).toHaveLength(1);
  });

  it('removes a person when its badge is clicked, keeping the others and the other role', async () => {
    const { onChange } = setup({ reporterIds: ['p:b1', 'user:rina'], editorIds: ['user:edo'] });

    await userEvent.click(screen.getByRole('button', { name: 'Remove Budi Kontributor' }));

    expect(onChange).toHaveBeenCalledWith({ reporterIds: ['user:rina'], editorIds: ['user:edo'] });
  });

  it('adds a person from the list after the ones already chosen', async () => {
    const { onChange } = setup({ reporterIds: ['user:rina'] });

    await userEvent.click(screen.getByRole('combobox', { name: 'Add reporter' }));
    await userEvent.click(await screen.findByRole('option', { name: /Budi Kontributor/ }));

    expect(onChange).toHaveBeenCalledWith({ reporterIds: ['user:rina', 'p:b1'], editorIds: [] });
  });

  it('adds a new plain-text name when it is typed and Enter is pressed', async () => {
    vi.mocked(createCreditPerson).mockResolvedValue({ person: { id: 'p:new', name: 'Citra Baru', userId: null } } as never);
    const { onChange } = setup();

    await userEvent.click(screen.getByRole('combobox', { name: 'Add editor' }));
    await userEvent.type(screen.getByPlaceholderText(/Search or add/i), 'Citra Baru{Enter}');

    expect(createCreditPerson).toHaveBeenCalledWith('Citra Baru');
    expect(onChange).toHaveBeenCalledWith({ reporterIds: [], editorIds: ['p:new'] });
  });

  it('offers a name added in one role in the other role right away', async () => {
    vi.mocked(createCreditPerson).mockResolvedValue({ person: { id: 'p:new', name: 'Citra Baru', userId: null } } as never);
    setup();
    await userEvent.click(screen.getByRole('combobox', { name: 'Add reporter' }));
    await userEvent.type(screen.getByPlaceholderText(/Search or add/i), 'Citra Baru{Enter}');
    await userEvent.keyboard('{Escape}');

    await userEvent.click(screen.getByRole('combobox', { name: 'Add editor' }));

    expect(await screen.findByRole('option', { name: /Citra Baru/ })).toBeDefined();
  });

  it('selects the existing person instead of adding a duplicate when the name already exists', async () => {
    vi.mocked(createCreditPerson).mockClear();
    const { onChange } = setup();

    await userEvent.click(screen.getByRole('combobox', { name: 'Add reporter' }));
    await userEvent.type(screen.getByPlaceholderText(/Search or add/i), '  budi   kontributor {Enter}');

    expect(createCreditPerson).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith({ reporterIds: ['p:b1'], editorIds: [] });
  });

  it('shows the reason and selects nothing when the name cannot be added', async () => {
    vi.mocked(createCreditPerson).mockResolvedValue({ error: 'Unauthorized' } as never);
    const { onChange } = setup();

    await userEvent.click(screen.getByRole('combobox', { name: 'Add reporter' }));
    await userEvent.type(screen.getByPlaceholderText(/Search or add/i), 'Dewi{Enter}');

    expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'Unauthorized');
    expect(onChange).not.toHaveBeenCalled();
  });
});
