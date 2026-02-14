import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_VISIBLE_COUNT = 2;
const DEFAULT_STEP_INTERVAL_MS = 15000;

const wrapIndex = (index, length) => {
  if (length <= 0) return 0;
  const wrapped = index % length;
  return wrapped < 0 ? wrapped + length : wrapped;
};

const useReasonCarousel = (
  items,
  {
    enabled = true,
    visibleCount = DEFAULT_VISIBLE_COUNT,
    stepIntervalMs = DEFAULT_STEP_INTERVAL_MS,
  } = {}
) => {
  const [startIndex, setStartIndex] = useState(0);
  const timerRef = useRef(null);

  const itemCount = items.length;
  const safeVisibleCount = Math.max(1, Math.min(visibleCount, Math.max(1, itemCount)));
  const isCarouselEnabled = enabled && itemCount > safeVisibleCount;

  const step = useCallback((direction) => {
    setStartIndex((current) => wrapIndex(current + direction, Math.max(1, itemCount)));
  }, [itemCount]);

  const clearTimer = useCallback(() => {
    if (!timerRef.current) return;
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (!isCarouselEnabled) return;
    timerRef.current = setInterval(() => {
      step(1);
    }, stepIntervalMs);
  }, [clearTimer, isCarouselEnabled, step, stepIntervalMs]);

  const goNext = useCallback(() => {
    if (!isCarouselEnabled) return;
    step(1);
    startTimer();
  }, [isCarouselEnabled, startTimer, step]);

  const goPrevious = useCallback(() => {
    if (!isCarouselEnabled) return;
    step(-1);
    startTimer();
  }, [isCarouselEnabled, startTimer, step]);

  useEffect(() => {
    setStartIndex((current) => wrapIndex(current, Math.max(1, itemCount)));
  }, [itemCount]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [clearTimer, startTimer]);

  const visibleItems = useMemo(() => {
    if (!isCarouselEnabled) return items;
    return Array.from({ length: safeVisibleCount }, (_, offset) => (
      items[wrapIndex(startIndex + offset, itemCount)]
    ));
  }, [isCarouselEnabled, itemCount, items, safeVisibleCount, startIndex]);

  return {
    isCarouselEnabled,
    visibleItems,
    goNext,
    goPrevious,
  };
};

export default useReasonCarousel;
