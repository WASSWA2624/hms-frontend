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
    const { getByTestId, getByText, queryByTestId } = renderWebWithProviders(
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

    expect(queryByTestId('tenant-table-search-bar')).toBeNull();
    expect(queryByTestId('tenant-table-filter-bar')).toBeNull();
    fireEvent.click(getByTestId('tenant-table-filter-tools-show'));
    expect(getByTestId('tenant-table-search-bar')).toBeTruthy();
    expect(getByTestId('tenant-table-filter-bar')).toBeTruthy();
    expect(getByTestId('tenant-table-pagination')).toBeTruthy();
    expect(getByTestId('tenant-table-navigation')).toBeTruthy();
    expect(getByText('Search controls')).toBeTruthy();
    expect(getByText('Filter controls')).toBeTruthy();
    expect(getByText('Page 1 of 1')).toBeTruthy();
    expect(getByText('Prev Next')).toBeTruthy();
  });

  it('keeps filter/export sections collapsed by default and can collapse again', () => {
    const { getByTestId, queryByTestId } = renderWebWithProviders(
      <DataTableWeb
        testID="tenant-table"
        columns={columns}
        rows={rows}
        searchBar={<div>Search controls</div>}
        filterBar={<div>Filter controls</div>}
      />
    );

    expect(queryByTestId('tenant-table-filter-bar')).toBeNull();
    expect(queryByTestId('tenant-table-search-bar')).toBeNull();
    fireEvent.click(getByTestId('tenant-table-filter-tools-show'));
    expect(getByTestId('tenant-table-filter-bar')).toBeTruthy();
    expect(getByTestId('tenant-table-search-bar')).toBeTruthy();
    expect(getByTestId('tenant-table-export-trigger')).toBeTruthy();

    fireEvent.click(getByTestId('tenant-table-filter-tools-collapse'));
    expect(queryByTestId('tenant-table-filter-bar')).toBeNull();
    expect(queryByTestId('tenant-table-search-bar')).toBeNull();
    expect(queryByTestId('tenant-table-export-trigger')).toBeNull();
    expect(getByTestId('tenant-table-filter-tools-show')).toBeTruthy();
  });

  it('starts expanded when hasActiveFilters is true', () => {
    const { getByTestId, queryByTestId } = renderWebWithProviders(
      <DataTableWeb
        testID="tenant-table"
        columns={columns}
        rows={rows}
        searchBar={<div>Search controls</div>}
        filterBar={<div>Filter controls</div>}
        hasActiveFilters
      />
    );

    expect(getByTestId('tenant-table-search-bar')).toBeTruthy();
    expect(getByTestId('tenant-table-filter-bar')).toBeTruthy();
    expect(getByTestId('tenant-table-filter-tools-collapse')).toBeTruthy();
    expect(queryByTestId('tenant-table-filter-tools-show')).toBeNull();
  });

  it('auto-opens filter tools when active filters exist and does not auto-collapse later', () => {
    const { getByTestId, queryByTestId, rerender } = renderWebWithProviders(
      <DataTableWeb
        testID="tenant-table"
        columns={columns}
        rows={rows}
        searchBar={<div>Search controls</div>}
        filterBar={<div>Filter controls</div>}
        hasActiveFilters={false}
      />
    );

    expect(queryByTestId('tenant-table-search-bar')).toBeNull();

    rerender(
      <ThemeProvider theme={lightTheme}>
        <DataTableWeb
          testID="tenant-table"
          columns={columns}
          rows={rows}
          searchBar={<div>Search controls</div>}
          filterBar={<div>Filter controls</div>}
          hasActiveFilters
        />
      </ThemeProvider>
    );

    expect(getByTestId('tenant-table-search-bar')).toBeTruthy();
    expect(getByTestId('tenant-table-filter-bar')).toBeTruthy();

    rerender(
      <ThemeProvider theme={lightTheme}>
        <DataTableWeb
          testID="tenant-table"
          columns={columns}
          rows={rows}
          searchBar={<div>Search controls</div>}
          filterBar={<div>Filter controls</div>}
          hasActiveFilters={false}
        />
      </ThemeProvider>
    );

    expect(getByTestId('tenant-table-search-bar')).toBeTruthy();
    expect(getByTestId('tenant-table-filter-bar')).toBeTruthy();
  });

  it('opens export modal with basic options first and advanced options behind a toggle', () => {
    const { getByTestId, queryByTestId } = renderWebWithProviders(
      <DataTableWeb
        testID="tenant-table"
        columns={columns}
        rows={rows}
      />
    );

    fireEvent.click(getByTestId('tenant-table-filter-tools-show'));
    fireEvent.click(getByTestId('tenant-table-export-trigger'));

    expect(getByTestId('tenant-table-export-modal')).toBeTruthy();
    expect(getByTestId('tenant-table-export-format')).toBeTruthy();
    expect(getByTestId('tenant-table-export-scope')).toBeTruthy();
    expect(queryByTestId('tenant-table-export-file-name')).toBeNull();
    expect(queryByTestId('tenant-table-export-include-headers')).toBeNull();
    expect(queryByTestId('tenant-table-export-include-row-numbers')).toBeNull();
    expect(queryByTestId('tenant-table-export-include-metadata')).toBeNull();

    fireEvent.click(getByTestId('tenant-table-export-advanced-toggle'));

    expect(getByTestId('tenant-table-export-file-name')).toBeTruthy();
    expect(getByTestId('tenant-table-export-include-headers')).toBeTruthy();
    expect(getByTestId('tenant-table-export-include-row-numbers')).toBeTruthy();
    expect(getByTestId('tenant-table-export-include-metadata')).toBeTruthy();
    expect(getByTestId('tenant-table-export-apply')).toBeTruthy();
  });

  it('supports printing from export modal', () => {
    const mockPrintWindow = {
      document: {
        open: jest.fn(),
        write: jest.fn(),
        close: jest.fn(),
      },
      focus: jest.fn(),
      print: jest.fn(),
    };
    const windowOpenSpy = jest.spyOn(window, 'open').mockReturnValue(mockPrintWindow);

    try {
      const { getByTestId } = renderWebWithProviders(
        <DataTableWeb
          testID="tenant-table"
          columns={columns}
          rows={rows}
        />
      );

      fireEvent.click(getByTestId('tenant-table-filter-tools-show'));
      fireEvent.click(getByTestId('tenant-table-export-trigger'));
      fireEvent.click(getByTestId('tenant-table-export-format'));
      fireEvent.click(getByTestId('tenant-table-export-format-option-3'));
      fireEvent.click(getByTestId('tenant-table-export-apply'));

      expect(windowOpenSpy).toHaveBeenCalled();
      expect(mockPrintWindow.document.write).toHaveBeenCalled();
      expect(mockPrintWindow.print).toHaveBeenCalled();
    } finally {
      windowOpenSpy.mockRestore();
    }
  });

  it('removes search scope labels from searchBar slot content', () => {
    const MockControlLabel = ({ children }) => <span>{children}</span>;
    MockControlLabel.styledComponentId = 'StyledControlLabel';

    const MockSearchScopeSelect = ({ label }) => (
      <div data-testid="mock-search-scope-label">{label || 'label-removed'}</div>
    );

    const { queryByText, getByTestId } = renderWebWithProviders(
      <DataTableWeb
        testID="tenant-table"
        columns={columns}
        rows={rows}
        searchBar={(
          <div>
            <MockControlLabel>Search field</MockControlLabel>
            <MockSearchScopeSelect
              label="Search field"
              testID="tenant-list-search-scope"
            />
          </div>
        )}
      />
    );

    fireEvent.click(getByTestId('tenant-table-filter-tools-show'));
    expect(queryByText('Search field')).toBeNull();
    expect(getByTestId('mock-search-scope-label').textContent).toBe('label-removed');
  });

  it('renders row numbers for each table row', () => {
    const { getByText, getAllByText } = renderWebWithProviders(
      <DataTableWeb
        testID="tenant-table"
        columns={columns}
        rows={[
          { id: 'tenant-1', name: 'Demo Tenant', slug: 'demo-tenant' },
          { id: 'tenant-2', name: 'Second Tenant', slug: 'second-tenant' },
        ]}
      />
    );

    expect(getByText('#')).toBeTruthy();
    expect(getAllByText('1').length).toBeGreaterThan(0);
    expect(getAllByText('2').length).toBeGreaterThan(0);
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
