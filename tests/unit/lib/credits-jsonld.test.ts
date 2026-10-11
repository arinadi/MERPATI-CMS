import { describe, it, expect } from 'vitest';
import { creditsJsonLd } from '@/lib/utils/credits-jsonld';

describe('creditsJsonLd', () => {
  it('uses the reporters as authors and the editors as editors', () => {
    const result = creditsJsonLd({
      reporters: [{ name: 'Rina Reporter' }, { name: 'Budi Kontributor' }],
      editors: [{ name: 'Edo Editor' }],
      postAuthorName: 'Wati Writer',
      baseUrl: 'https://example.com',
    });

    expect(result.author).toEqual([
      { '@type': 'Person', name: 'Rina Reporter', url: 'https://example.com' },
      { '@type': 'Person', name: 'Budi Kontributor', url: 'https://example.com' },
    ]);
    expect(result.editor).toEqual([{ '@type': 'Person', name: 'Edo Editor' }]);
  });

  it('falls back to the person who created the post when there is no reporter', () => {
    const result = creditsJsonLd({ reporters: [], editors: [], postAuthorName: 'Wati Writer', baseUrl: 'https://example.com' });

    expect(result.author).toEqual([{ '@type': 'Person', name: 'Wati Writer', url: 'https://example.com' }]);
  });

  it('falls back to "Editor" when there is no reporter and the post has no author name', () => {
    const result = creditsJsonLd({ reporters: [], editors: [], postAuthorName: null, baseUrl: 'https://example.com' });

    expect(result.author).toEqual([{ '@type': 'Person', name: 'Editor', url: 'https://example.com' }]);
  });

  it('leaves out the editor property when there are no editors', () => {
    const result = creditsJsonLd({ reporters: [], editors: [], postAuthorName: null, baseUrl: 'https://example.com' });

    expect('editor' in result).toBe(false);
  });
});
