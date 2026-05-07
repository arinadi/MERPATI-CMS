import { describe, it, expect } from 'vitest';
import { getCacheTimestamp } from '@/lib/queries/cache-timestamp';

describe('Cache Timestamp Query', () => {
  it('should return an ISO date string', async () => {
    const result = await getCacheTimestamp();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });
});
