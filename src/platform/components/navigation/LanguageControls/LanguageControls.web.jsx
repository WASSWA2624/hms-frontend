/**
 * LanguageControls Component - Web
 * Flag button that opens language list with flags
 * File: LanguageControls.web.jsx
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@hooks';
import {
  StyledLanguageControls,
  StyledFlagTrigger,
  StyledLanguageMenu,
  StyledLanguageItem,
  StyledLanguageItemFlag,
} from './LanguageControls.web.styles';
import useLanguageControls from './useLanguageControls';
import { LOCALE_FLAG_CODES, FLAG_CDN_BASE } from './types';

const getFlagSrc = (locale) => {
  const code = LOCALE_FLAG_CODES[locale] || 'us';
  return `${FLAG_CDN_BASE}/w40/${code}.png`;
};

/**
 * LanguageControls component for Web
 */
const LanguageControlsWeb = ({ testID, className, accessibilityLabel, accessibilityHint }) => {
  const { t } = useI18n();
  const { locale, options, setLocale } = useLanguageControls();
  const [open, setOpen] = useState(false);
  const [menuPlacement, setMenuPlacement] = useState({
    vertical: 'bottom',
    horizontal: 'right',
    top: 0,
    left: 0,
  });
  const wrapperRef = useRef(null);
  const menuRef = useRef(null);

  const resolvedLabel = accessibilityLabel || t('settings.language.accessibilityLabel');
  const resolvedHint = accessibilityHint || t('settings.language.hint');

  const close = useCallback(() => setOpen(false), []);
  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);
  const handleOptionClick = useCallback(
    (event) => {
      const nextLocale = event.currentTarget?.dataset?.locale;
      if (!nextLocale) return;
      setLocale(nextLocale);
      close();
    },
    [setLocale, close]
  );

  const updateMenuPlacement = useCallback(() => {
    if (!wrapperRef.current || !menuRef.current || typeof window === 'undefined') return;
    const triggerRect = wrapperRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 0;
    const viewportWidth = window.innerWidth || 0;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const spaceRight = viewportWidth - triggerRect.right;
    const spaceLeft = triggerRect.left;
    const vertical = spaceBelow >= menuRect.height || spaceBelow >= spaceAbove ? 'bottom' : 'top';
    const horizontal = spaceRight >= menuRect.width || spaceRight >= spaceLeft ? 'right' : 'left';
    const offset = 4;
    const edgePadding = 8;
    const nextTop =
      vertical === 'bottom'
        ? triggerRect.bottom + offset
        : triggerRect.top - menuRect.height - offset;
    const nextLeft =
      horizontal === 'right'
        ? triggerRect.right - menuRect.width
        : triggerRect.left;
    const clampedTop = Math.max(edgePadding, Math.min(nextTop, viewportHeight - menuRect.height - edgePadding));
    const clampedLeft = Math.max(edgePadding, Math.min(nextLeft, viewportWidth - menuRect.width - edgePadding));
    setMenuPlacement({ vertical, horizontal, top: clampedTop, left: clampedLeft });
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e) => {
      const target = e.target;
      if (wrapperRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      close();
    };
    const raf = requestAnimationFrame(updateMenuPlacement);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', updateMenuPlacement);
    window.addEventListener('scroll', updateMenuPlacement, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updateMenuPlacement);
      window.removeEventListener('scroll', updateMenuPlacement, true);
    };
  }, [open, close, updateMenuPlacement]);

  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  const menu = open ? (
    <StyledLanguageMenu
      ref={menuRef}
      $vertical={menuPlacement.vertical}
      $horizontal={menuPlacement.horizontal}
      $top={menuPlacement.top}
      $left={menuPlacement.left}
      role="listbox"
      aria-label={resolvedLabel}
      data-testid={testID ? `${testID}-menu` : undefined}
    >
      {options.map((opt) => (
        <StyledLanguageItem
          key={opt.value}
          type="button"
          role="option"
          aria-selected={opt.value === locale}
          data-locale={opt.value}
          onClick={handleOptionClick}
          data-testid={testID ? `${testID}-option-${opt.value}` : undefined}
        >
          <StyledLanguageItemFlag>
            <img src={getFlagSrc(opt.value)} alt="" width={24} height={18} loading="lazy" />
          </StyledLanguageItemFlag>
          <span>{opt.label}</span>
        </StyledLanguageItem>
      ))}
    </StyledLanguageMenu>
  ) : null;

  return (
    <StyledLanguageControls ref={wrapperRef} data-testid={testID} className={className}>
      <StyledFlagTrigger
        type="button"
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={resolvedLabel}
        title={resolvedHint}
        data-testid={testID ? `${testID}-trigger` : undefined}
      >
        <img src={getFlagSrc(locale)} alt="" width={24} height={18} loading="lazy" />
      </StyledFlagTrigger>
      {portalTarget && menu ? createPortal(menu, portalTarget) : menu}
    </StyledLanguageControls>
  );
};

export default LanguageControlsWeb;
