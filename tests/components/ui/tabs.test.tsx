import { render, screen } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Tabs Components', () => {
  it('renders Tabs correctly', () => {
    render(
      <Tabs defaultValue="tab1" data-testid="tabs">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );
    expect(screen.getByTestId('tabs')).toBeDefined();
    expect(screen.getByText('Tab 1')).toBeDefined();
    expect(screen.getByText('Content 1')).toBeDefined();
  });
});
