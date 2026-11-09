import { describe, it, expect } from 'vitest';
import { POST_DISPLAY_PARTS, THEME_PART_SUPPORT, parsePostDisplay, postDisplayKey } from '@/lib/post-display';

describe('postDisplayKey', () => {
  it('names the option row after the part', () => {
    expect(postDisplayKey('date_reading')).toBe('post_display_date_reading');
    expect(postDisplayKey('credits')).toBe('post_display_credits');
  });
});

describe('parsePostDisplay', () => {
  it('shows every part when no setting was ever saved', () => {
    const settings = parsePostDisplay({});

    expect(settings).toEqual({ credits: true, writer: true, date_reading: true, share: true, terms: true });
  });

  it('hides only the part saved as "false" and keeps the others on', () => {
    const settings = parsePostDisplay({ post_display_share: 'false' });

    expect(settings.share).toBe(false);
    expect(POST_DISPLAY_PARTS.filter((part) => part !== 'share').every((part) => settings[part])).toBe(true);
  });

  it('shows a part saved as "true"', () => {
    expect(parsePostDisplay({ post_display_writer: 'true' }).writer).toBe(true);
  });
});

describe('THEME_PART_SUPPORT', () => {
  it('lists every part for every theme', () => {
    for (const theme of Object.values(THEME_PART_SUPPORT)) {
      expect(Object.keys(theme).sort()).toEqual([...POST_DISPLAY_PARTS].sort());
    }
  });

  it('marks the parts a theme only partly renders', () => {
    expect(THEME_PART_SUPPORT.default.date_reading).toBe('partial'); // no reading time
    expect(THEME_PART_SUPPORT.news.terms).toBe('partial'); // categories only, no tags
    expect(THEME_PART_SUPPORT.portfolio.terms).toBe('full');
  });
});
