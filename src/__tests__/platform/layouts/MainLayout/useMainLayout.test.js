/**
 * useMainLayout Hook Tests
 * Per testing.mdc
 * File: useMainLayout.test.js
 */
import { renderHook } from '@testing-library/react-native';
import useMainLayout from '@platform/layouts/MainLayout/useMainLayout';

describe('useMainLayout', () => {
  it('returns hasSidebar true when sidebar is provided', () => {
    const { result } = renderHook(() =>
      useMainLayout({ sidebar: <div /> })
    );
    expect(result.current.hasSidebar).toBe(true);
  });

  it('returns hasSidebar false when sidebar is null', () => {
    const { result } = renderHook(() =>
      useMainLayout({ sidebar: null })
    );
    expect(result.current.hasSidebar).toBe(false);
  });

  it('returns hasSidebar false when sidebar is undefined', () => {
    const { result } = renderHook(() => useMainLayout({}));
    expect(result.current.hasSidebar).toBe(false);
  });

  it('returns hasHeader true when header is provided', () => {
    const { result } = renderHook(() =>
      useMainLayout({ header: <header /> })
    );
    expect(result.current.hasHeader).toBe(true);
  });

  it('returns hasFooter true when footer is provided', () => {
    const { result } = renderHook(() =>
      useMainLayout({ footer: <footer /> })
    );
    expect(result.current.hasFooter).toBe(true);
  });

  it('returns hasBreadcrumbs true when breadcrumbs is provided', () => {
    const { result } = renderHook(() =>
      useMainLayout({ breadcrumbs: <nav /> })
    );
    expect(result.current.hasBreadcrumbs).toBe(true);
  });

  it('returns all flags false when no slots provided', () => {
    const { result } = renderHook(() => useMainLayout({}));
    expect(result.current.hasHeader).toBe(false);
    expect(result.current.hasFooter).toBe(false);
    expect(result.current.hasSidebar).toBe(false);
    expect(result.current.hasBreadcrumbs).toBe(false);
  });

  it('returns all flags true when all slots provided', () => {
    const { result } = renderHook(() =>
      useMainLayout({
        header: <header />,
        footer: <footer />,
        sidebar: <aside />,
        breadcrumbs: <nav />,
      })
    );
    expect(result.current.hasHeader).toBe(true);
    expect(result.current.hasFooter).toBe(true);
    expect(result.current.hasSidebar).toBe(true);
    expect(result.current.hasBreadcrumbs).toBe(true);
  });

  it('memoizes result when props reference does not change', () => {
    const props = { header: <header /> };
    const { result, rerender } = renderHook(() => useMainLayout(props));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
