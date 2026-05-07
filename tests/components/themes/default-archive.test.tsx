import { render, screen } from '@testing-library/react';
import Archive from '@/themes/default/components/archive';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <div data-testid="icon-left" />,
  ChevronRight: () => <div data-testid="icon-right" />,
  Image: () => <div data-testid="icon-image" />,
  ImageIcon: () => <div data-testid="icon-image" />,
  Calendar: () => <div data-testid="icon-calendar" />,
  Clock: () => <div data-testid="icon-clock" />,
  User: () => <div data-testid="icon-user" />,
  ArrowRight: () => <div data-testid="icon-arrow" />,
}));

describe('Theme Default: Archive Component', () => {
  const mockPosts = [
    { id: '1', title: 'Post 1', slug: 'p1', excerpt: 'E1', createdAt: new Date(), featuredImage: null },
    { id: '2', title: 'Post 2', slug: 'p2', excerpt: 'E2', createdAt: new Date(), featuredImage: null },
  ];

  it('renders title and posts correctly', () => {
    render(<Archive title="News Archive" posts={mockPosts as any} />);
    
    expect(screen.getByText('News Archive')).toBeDefined();
    expect(screen.getByText('Post 1')).toBeDefined();
    expect(screen.getByText('Post 2')).toBeDefined();
  });

  it('shows empty message when no posts', () => {
    render(<Archive title="Empty" posts={[]} />);
    expect(screen.getByText(/Belum ada konten/i)).toBeDefined();
  });

  it('renders pagination when provided', () => {
    const pagination = { currentPage: 1, totalPages: 5, basePath: '/news' };
    render(<Archive title="News" posts={mockPosts as any} pagination={pagination} />);
    
    expect(screen.getByText('Hal 1 / 5')).toBeDefined();
  });
});
