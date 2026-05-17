import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBaseUrl } from '@/lib/get-base-url';
import { headers } from 'next/headers';

describe('getBaseUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '');
    vi.stubEnv('VERCEL_URL', '');
  });

  it('should use NEXT_PUBLIC_SITE_URL if defined', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://mycms.com');
    const url = await getBaseUrl();
    expect(url).toBe('https://mycms.com');
  });

  it('should use VERCEL_PROJECT_PRODUCTION_URL if defined', async () => {
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'prod.com');
    const url = await getBaseUrl();
    expect(url).toBe('https://prod.com');
  });

  it('should use VERCEL_URL if defined', async () => {
    vi.stubEnv('VERCEL_URL', 'preview.vercel.app');
    const url = await getBaseUrl();
    expect(url).toBe('https://preview.vercel.app');
  });

  it('should use headers if available', async () => {
    const h = new Map([['host', 'myhost.local']]);
    vi.mocked(headers).mockResolvedValueOnce(h as any);
    
    const url = await getBaseUrl();
    expect(url).toBe('https://myhost.local');
  });

  it('should use http for localhost in headers', async () => {
    const h = new Map([['host', 'localhost:3000']]);
    vi.mocked(headers).mockResolvedValueOnce(h as any);
    
    const url = await getBaseUrl();
    expect(url).toBe('http://localhost:3000');
  });

  it('should fallback to localhost:3000', async () => {
    vi.mocked(headers).mockRejectedValueOnce(new Error('no context'));
    const url = await getBaseUrl();
    expect(url).toBe('http://localhost:3000');
  });
});
