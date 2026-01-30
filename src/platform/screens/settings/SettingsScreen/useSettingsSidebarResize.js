/**
 * useSettingsSidebarResize Hook
 * Web: resizable settings sidebar width with localStorage persistence.
 * Per component-structure.mdc: logic in hooks
 */
import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'hms-settings-sidebar-width';
const DEFAULT_WIDTH = 220;
const MIN_WIDTH = 160;
const MAX_WIDTH = 320;

const clamp = (v, min, max) => Math.min(Math.max(Number(v), min), max);

export default function useSettingsSidebarResize() {
  const [width, setWidth] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_WIDTH;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? clamp(Number(stored), MIN_WIDTH, MAX_WIDTH) : DEFAULT_WIDTH;
    } catch {
      return DEFAULT_WIDTH;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(width));
    } catch {
      /* ignore */
    }
  }, [width]);

  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = width;
    const onMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      setWidth((w) => clamp(startW + delta, MIN_WIDTH, MAX_WIDTH));
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [width]);

  const handleResizeKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setWidth((w) => clamp(w - 12, MIN_WIDTH, MAX_WIDTH));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setWidth((w) => clamp(w + 12, MIN_WIDTH, MAX_WIDTH));
    }
  }, []);

  return {
    sidebarWidth: width,
    sidebarMinWidth: MIN_WIDTH,
    sidebarMaxWidth: MAX_WIDTH,
    handleResizeStart,
    handleResizeKeyDown,
  };
}
