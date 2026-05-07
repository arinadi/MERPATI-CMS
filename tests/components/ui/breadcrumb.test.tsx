import { render, screen } from '@testing-library/react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbList } from '@/components/ui/breadcrumb';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Breadcrumb Components', () => {
  it('renders Breadcrumb correctly', () => {
    render(
      <Breadcrumb data-testid="breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(screen.getByTestId('breadcrumb')).toBeDefined();
    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Current')).toBeDefined();
  });
});
