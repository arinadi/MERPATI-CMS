import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/check-init/route';
import { checkInitialized } from '@/lib/actions/setup';
import { NextResponse } from 'next/server';

vi.mock('@/lib/actions/setup', () => ({
  checkInitialized: vi.fn(),
}));

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn((url) => ({ url })),
    json: vi.fn((data) => ({ data })),
  },
}));

describe('API: /api/check-init', () => {
  const mockRequest = {
    url: 'http://localhost:3000/api/check-init',
  } as Request;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to /login if initialized', async () => {
    vi.mocked(checkInitialized).mockResolvedValueOnce(true);
    
    const response = await GET(mockRequest);
    
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/login'
    }));
  });

  it('should redirect to /setup if not initialized', async () => {
    vi.mocked(checkInitialized).mockResolvedValueOnce(false);
    
    const response = await GET(mockRequest);
    
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/setup'
    }));
  });
});
