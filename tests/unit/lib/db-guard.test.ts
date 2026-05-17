import { describe, it, expect, vi } from 'vitest';
import { dbGuard } from '@/lib/db-guard';
import { redirect } from 'next/navigation';

describe('dbGuard', () => {
  it('should return result if no error', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await dbGuard(fn);
    expect(result).toBe('success');
  });

  it('should redirect to /setup on DB missing error', async () => {
    const error = new Error('relation "users" does not exist');
    const fn = vi.fn().mockRejectedValue(error);
    
    await expect(dbGuard(fn)).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/setup');
  });

  it('should throw other errors', async () => {
    const error = new Error('Network error');
    const fn = vi.fn().mockRejectedValue(error);
    
    await expect(dbGuard(fn)).rejects.toThrow('Network error');
  });
});
