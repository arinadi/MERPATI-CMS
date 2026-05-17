import { describe, it, expect } from 'vitest';
import { activeTheme } from '@/lib/themes';

describe('Theme Resolution', () => {
  it('should have a ThemeLayout', () => {
    expect(activeTheme).toBeDefined();
    expect(activeTheme.ThemeLayout).toBeDefined();
    expect(activeTheme.SinglePost).toBeDefined();
    expect(activeTheme.Archive).toBeDefined();
  });

  it('should have a NotFound component', () => {
    expect(activeTheme.NotFound).toBeDefined();
  });
});
