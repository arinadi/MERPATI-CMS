import { render, screen } from '@testing-library/react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('Table Components', () => {
  it('renders Table correctly', () => {
    render(
      <Table data-testid="table">
        <TableHeader>
          <TableRow>
            <TableHead>Head 1</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByTestId('table')).toBeDefined();
    expect(screen.getByText('Head 1')).toBeDefined();
    expect(screen.getByText('Cell 1')).toBeDefined();
  });
});
