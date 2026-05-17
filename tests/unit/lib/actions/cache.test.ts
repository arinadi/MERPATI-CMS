import { describe, it, expect, vi } from 'vitest';
import { clearGlobalCache } from '@/lib/actions/cache';
import { revalidatePath, revalidateTag } from 'next/cache';

describe('Cache Actions', () => {
  it('should call revalidateTag and revalidatePath', async () => {
    const result = await clearGlobalCache();
    
    expect(result.success).toBe(true);
    expect(revalidateTag).toHaveBeenCalledWith('site-options', 'default');
    expect(revalidateTag).toHaveBeenCalledWith('site-menus', 'default');
    expect(revalidateTag).toHaveBeenCalledWith('posts', 'default');
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
  });
});
