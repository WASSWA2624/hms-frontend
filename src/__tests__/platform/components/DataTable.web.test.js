/**
 * DataTable Component Web Tests
 * File: DataTable.web.test.js
 * @jest-environment jsdom
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import lightTheme from '@theme/light.theme';

jest.mock('@hooks', () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: 'en',
  }),
}));

const DataTableWeb = require('@platform/components/display/DataTable/DataTable.web').default;

const renderWebWithProviders = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

describe('DataTable Component - Web', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'slug', label: 'Slug' },
  ];

  const rows = [
    { id: 'tenant-1', name: 'Demo Tenant', slug: 'demo-tenant' },
  ];

  it('renders search/filter/pagination/navigation through centralized DataTable slots', () => {
    const { getByTestId, getByText } = renderWebWithProviders(
      <DataTableWeb
        testID="tenant-table"
        columns={columns}
        rows={rows}
        searchBar={<div>Search controls</div>}
        filterBar={<div>Filter controls</div>}
        pagination={<span>Page 1 of 1</span>}
        tableNavigation={<div>Prev Next</div>}
      />
    );

    expect(getByTestId('tenant-table-search-bar')).toBeTruthy();
    expect(getByTestId('tenant-table-filter-bar')).toBeTruthy();
    expect(getByTestId('tenant-table-pagination')).toBeTruthy();
    expect(getByTestId('tenant-table-navigation')).toBeTruthy();
    expect(getByText('Search controls')).toBeTruthy();
    expect(getByText('Filter controls')).toBeTruthy();
    expect(getByText('Page 1 of 1')).toBeTruthy();
    expect(getByText('Prev Next')).toBeTruthy();
  });

  it('supports render-function slots and can suppress default empty row', () => {
    const statusRenderer = jest.fn(({ rows: renderedRows }) => (
      <div>{`Custom status (${renderedRows.length})`}</div>
    ));

    const { getByText, queryByText } = renderWebWithProviders(
      <DataTableWeb
        testID="tenant-table"
        columns={columns}
        rows={[]}
        statusContent={statusRenderer}
        showDefaultEmptyRow={false}
      />
    );

    expect(statusRenderer).toHaveBeenCalled();
    expect(getByText('Custom status (0)')).toBeTruthy();
    expect(queryByText('listScaffold.emptyState.title')).toBeNull();
  });

  it('resizes a column by dragging the resize handle', () => {
    const onResize = jest.fn();

    const { getByTestId } = renderWebWithProviders(
      <DataTableWeb
        testID="tenant-table"
        columns={[
          { id: 'name', label: 'Name', width: 180 },
          { id: 'slug', label: 'Slug', width: 180 },
        ]}
        rows={rows}
        columnResize={{ onResize }}
      />
    );

    const headerCell = getByTestId('tenant-table-header-name');
    Object.defineProperty(headerCell, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        width: 180,
      }),
    });

    fireEvent.mouseDown(getByTestId('tenant-table-resize-name'), { button: 0, clientX: 180 });
    fireEvent.mouseMove(window, { clientX: 260 });
    fireEvent.mouseUp(window, { clientX: 260 });

    expect(onResize).toHaveBeenCalledWith(expect.objectContaining({
      columnId: 'name',
      width: 260,
    }));
  });

  it('allows resizing a column below the previous default minimum width', () => {
    const onResize = jest.fn();

    const { getByTestId } = renderWebWithProviders(
      <DataTableWeb
        testID="tenant-table"
        columns={[
          { id: 'name', label: 'Name', width: 180 },
          { id: 'slug', label: 'Slug', width: 180 },
        ]}
        rows={rows}
        columnResize={{ onResize }}
      />
    );

    const headerCell = getByTestId('tenant-table-header-name');
    Object.defineProperty(headerCell, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        width: 180,
      }),
    });

    fireEvent.mouseDown(getByTestId('tenant-table-resize-name'), { button: 0, clientX: 180 });
    fireEvent.mouseMove(window, { clientX: 20 });
    fireEvent.mouseUp(window, { clientX: 20 });

    expect(onResize).toHaveBeenLastCalledWith(expect.objectContaining({
      columnId: 'name',
      width: 20,
    }));
  });

  it('auto-fits a column on resize-handle double click', () => {
    const onResize = jest.fn();

    const { getByTestId } = renderWebWithProviders(
      <DataTableWeb
        testID="tenant-table"
        columns={[
          { id: 'name', label: 'Name', width: 80 },
          { id: 'slug', label: 'Slug', width: 120 },
        ]}
        rows={rows}
        columnResize={{ onResize }}
      />
    );

    const headerCell = getByTestId('tenant-table-header-name');
    Object.defineProperty(headerCell, 'scrollWidth', {
      configurable: true,
      value: 212,
    });
    Object.defineProperty(headerCell, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        width: 80,
      }),
    });

    const resizeHandle = getByTestId('tenant-table-resize-name');
    fireEvent(resizeHandle, new MouseEvent('dblclick', { bubbles: true, cancelable: true }));

    expect(onResize).toHaveBeenCalledWith(expect.objectContaining({
      columnId: 'name',
      width: 212,
    }));
  });

  it('can disable column resize handles', () => {
    const { queryByTestId } = renderWebWithProviders(
      <DataTableWeb
        testID="tenant-table"
        columns={columns}
        rows={rows}
        columnResize={{ enabled: false }}
      />
    );

    expect(queryByTestId('tenant-table-resize-name')).toBeNull();
  });
});
