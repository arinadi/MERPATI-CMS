import { render, screen } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Accordion Components', () => {
  it('renders Accordion correctly', () => {
    render(
      <Accordion type="single" data-testid="accordion">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByTestId('accordion')).toBeDefined();
    expect(screen.getByText('Is it accessible?')).toBeDefined();
  });
});
