/**
 * Tooltip Component - Web
 * Contextual help on hover/focus
 * File: Tooltip.web.jsx
 */

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { StyledTooltip, StyledTooltipText } from './Tooltip.web.styles';
import { useI18n } from '@hooks';
import { POSITIONS } from './types';

const VIEWPORT_MARGIN = 8;
const TOOLTIP_OFFSET = 8;
const POSITION_PRIORITY = [POSITIONS.RIGHT, POSITIONS.LEFT, POSITIONS.BOTTOM, POSITIONS.TOP];

const isValidPosition = (value) => POSITION_PRIORITY.includes(value);
const normalizePosition = (value) => (isValidPosition(value) ? value : POSITIONS.TOP);

const resolveAnchorElement = (anchorRef) => {
  if (!anchorRef) return null;
  if (typeof window === 'undefined' || typeof Element === 'undefined') return null;

  const directCandidate = anchorRef;
  const refCandidate = anchorRef?.current;

  if (directCandidate instanceof Element) return directCandidate;
  if (refCandidate instanceof Element) return refCandidate;

  if (typeof directCandidate?.getBoundingClientRect === 'function') return directCandidate;
  if (typeof refCandidate?.getBoundingClientRect === 'function') return refCandidate;

  return null;
};

const clamp = (value, min, max) => {
  if (!Number.isFinite(value)) return min;
  if (max < min) return min;
  return Math.min(max, Math.max(min, value));
};

const resolveCandidateCoordinates = (candidate, anchorRect, tooltipRect) => {
  const centerX = anchorRect.left + (anchorRect.width / 2);
  const centerY = anchorRect.top + (anchorRect.height / 2);

  if (candidate === POSITIONS.TOP) {
    return {
      left: centerX - (tooltipRect.width / 2),
      top: anchorRect.top - tooltipRect.height - TOOLTIP_OFFSET,
    };
  }

  if (candidate === POSITIONS.BOTTOM) {
    return {
      left: centerX - (tooltipRect.width / 2),
      top: anchorRect.bottom + TOOLTIP_OFFSET,
    };
  }

  if (candidate === POSITIONS.LEFT) {
    return {
      left: anchorRect.left - tooltipRect.width - TOOLTIP_OFFSET,
      top: centerY - (tooltipRect.height / 2),
    };
  }

  return {
    left: anchorRect.right + TOOLTIP_OFFSET,
    top: centerY - (tooltipRect.height / 2),
  };
};

const resolveOverflowScore = (coordinates, tooltipRect, viewport) => {
  const overLeft = Math.max(0, VIEWPORT_MARGIN - coordinates.left);
  const overTop = Math.max(0, VIEWPORT_MARGIN - coordinates.top);
  const overRight = Math.max(0, (coordinates.left + tooltipRect.width) - (viewport.width - VIEWPORT_MARGIN));
  const overBottom = Math.max(0, (coordinates.top + tooltipRect.height) - (viewport.height - VIEWPORT_MARGIN));
  return overLeft + overTop + overRight + overBottom;
};

/**
 * Tooltip component for Web
 * @param {Object} props - Tooltip props
 * @param {string} props.position - Tooltip position (top, bottom, left, right)
 * @param {boolean} props.visible - Visibility state
 * @param {string|React.ReactNode} props.text - Tooltip text
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.id - ID for aria-describedby association with trigger element
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.style - Additional styles
 * @param {Object|HTMLElement} props.anchorRef - Trigger ref/element for anchored placement
 */
const TooltipWeb = ({
  position = POSITIONS.TOP,
  visible = false,
  text,
  accessibilityLabel,
  id,
  testID,
  className,
  style,
  anchorRef,
  ...rest
}) => {
  const { t } = useI18n();
  const tooltipRef = useRef(null);
  const textString = typeof text === 'string' && text ? text : null;
  const defaultAccessibilityLabel = accessibilityLabel || textString || t('common.tooltip');
  const preferredPosition = normalizePosition(position);
  const anchorElement = resolveAnchorElement(anchorRef);

  const [anchoredState, setAnchoredState] = useState({
    left: 0,
    top: 0,
    resolvedPosition: preferredPosition,
    isReady: false,
  });

  useEffect(() => {
    if (!visible) return;
    if (typeof window === 'undefined') return;
    if (!anchorElement) return;

    let rafId = 0;

    const updatePosition = () => {
      if (!tooltipRef.current || !anchorElement) return;

      try {
        const anchorRect = anchorElement.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const docElement = typeof document !== 'undefined' ? document.documentElement : null;
        const viewport = {
          width: window.innerWidth || docElement?.clientWidth || 0,
          height: window.innerHeight || docElement?.clientHeight || 0,
        };

        const candidateOrder = [preferredPosition, ...POSITION_PRIORITY]
          .filter((candidate, index, array) => array.indexOf(candidate) === index);

        const rankedCandidates = candidateOrder.map((candidate, priorityIndex) => {
          const coordinates = resolveCandidateCoordinates(candidate, anchorRect, tooltipRect);
          const overflowScore = resolveOverflowScore(coordinates, tooltipRect, viewport);
          return { candidate, priorityIndex, overflowScore, coordinates };
        });

        rankedCandidates.sort((left, right) => {
          if (left.overflowScore !== right.overflowScore) {
            return left.overflowScore - right.overflowScore;
          }
          return left.priorityIndex - right.priorityIndex;
        });

        const best = rankedCandidates[0];
        const maxLeft = Math.max(VIEWPORT_MARGIN, viewport.width - tooltipRect.width - VIEWPORT_MARGIN);
        const maxTop = Math.max(VIEWPORT_MARGIN, viewport.height - tooltipRect.height - VIEWPORT_MARGIN);
        const clampedLeft = clamp(best.coordinates.left, VIEWPORT_MARGIN, maxLeft);
        const clampedTop = clamp(best.coordinates.top, VIEWPORT_MARGIN, maxTop);

        setAnchoredState({
          left: clampedLeft,
          top: clampedTop,
          resolvedPosition: best.candidate,
          isReady: true,
        });
      } catch (_) {
        // Skip anchored positioning on transient hover/mount states to avoid hard crashes.
      }
    };

    const scheduleUpdate = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updatePosition);
    };

    setAnchoredState((previous) => ({
      ...previous,
      resolvedPosition: preferredPosition,
      isReady: false,
    }));

    scheduleUpdate();
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('scroll', scheduleUpdate, true);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate, true);
    };
  }, [anchorElement, preferredPosition, text, visible]);

  const usesAnchoredMode = Boolean(anchorElement);
  const mergedStyle = usesAnchoredMode
    ? {
      ...(style || {}),
      top: anchoredState.top,
      left: anchoredState.left,
      visibility: anchoredState.isReady ? (style?.visibility || 'visible') : 'hidden',
    }
    : style;

  if (!visible) return null;

  const tooltipNode = (
    <StyledTooltip
      ref={tooltipRef}
      id={id}
      data-placement={usesAnchoredMode ? anchoredState.resolvedPosition : preferredPosition}
      data-mode={usesAnchoredMode ? 'anchored' : 'relative'}
      role="tooltip"
      aria-label={defaultAccessibilityLabel}
      data-testid={testID}
      className={className}
      style={mergedStyle}
      {...rest}
    >
      <StyledTooltipText>{text}</StyledTooltipText>
    </StyledTooltip>
  );

  if (!usesAnchoredMode || typeof document === 'undefined' || !document.body) {
    return tooltipNode;
  }

  return createPortal(tooltipNode, document.body);
};

export default TooltipWeb;

