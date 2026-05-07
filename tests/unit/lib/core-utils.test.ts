import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Core Utilities (cn)', () => {
  it('should merge tailwind classes correctly', () => {
    expect(cn('p-4', 'bg-red-500')).toBe('p-4 bg-red-500');
    // Overriding classes
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('should handle conditional classes', () => {
    expect(cn('p-4', true && 'bg-blue-500', false && 'text-white')).toBe('p-4 bg-blue-500');
  });

  it('should handle undefined and null', () => {
    expect(cn('p-4', undefined, null)).toBe('p-4');
  });
});
