/**
 * useSidebarSearch Hook
 * Lightweight sidebar search (desktop web).
 * File: useSidebarSearch.js
 */

import { useMemo } from 'react';
import { getNavItemLabel } from '@config/sideMenu';

const normalizeText = (value) => String(value ?? '').trim().toLowerCase();

const tokenize = (value) => normalizeText(value).split(/\s+/).filter(Boolean);

const buildSearchEntries = (items, t, itemsI18nPrefix) => {
  const entries = [];
  const list = Array.isArray(items) ? items : [];

  const addEntry = (item, parent) => {
    if (!item) return;
    const href = item.href ?? item.path;
    if (!href) return;
    const label = item.label ?? getNavItemLabel(t, item, itemsI18nPrefix);
    if (!label) return;
    const parentLabel = parent ? parent.label ?? getNavItemLabel(t, parent, itemsI18nPrefix) : '';
    const id = item.id || href;
    const labelNormalized = normalizeText(label);
    const parentNormalized = normalizeText(parentLabel);
    const hrefNormalized = normalizeText(href);
    const idNormalized = normalizeText(id);

    entries.push({
      id,
      label,
      href,
      icon: item.icon,
      parentLabel,
      item,
      labelNormalized,
      parentNormalized,
      hrefNormalized,
      idNormalized,
      searchText: [labelNormalized, parentNormalized, hrefNormalized, idNormalized].filter(Boolean).join(' '),
    });
  };

  list.forEach((item) => {
    addEntry(item, null);
    if (Array.isArray(item.children)) {
      item.children.forEach((child) => addEntry(child, item));
    }
  });

  return entries;
};

const scoreEntry = (entry, tokens) => {
  if (!entry || tokens.length === 0) return 0;
  let score = 0;

  for (const token of tokens) {
    if (!entry.searchText.includes(token)) return 0;

    if (entry.labelNormalized.startsWith(token)) score += 6;
    else if (entry.labelNormalized.includes(token)) score += 4;
    else if (entry.parentNormalized.startsWith(token)) score += 3;
    else if (entry.parentNormalized.includes(token)) score += 2;
    else if (entry.idNormalized.includes(token)) score += 1;
    else if (entry.hrefNormalized.includes(token)) score += 1;
  }

  return score;
};

/**
 * Sidebar search hook
 * @param {Object} options - Hook options
 * @param {Array} options.items - Sidebar tree items
 * @param {string} options.query - Search query
 * @param {Function} options.t - i18n translate
 * @param {string} options.itemsI18nPrefix - fallback i18n prefix for items
 * @param {number} options.maxResults - max results to return
 * @returns {{ results: Array, hasQuery: boolean, totalResults: number }}
 */
const useSidebarSearch = ({
  items,
  query = '',
  t,
  itemsI18nPrefix = 'navigation.items.main',
  maxResults = 8,
} = {}) => {
  const tokens = useMemo(() => tokenize(query), [query]);
  const entries = useMemo(
    () => buildSearchEntries(items, t, itemsI18nPrefix),
    [items, t, itemsI18nPrefix]
  );

  const results = useMemo(() => {
    if (tokens.length === 0) return [];
    const scored = [];

    for (const entry of entries) {
      const score = scoreEntry(entry, tokens);
      if (score > 0) scored.push({ ...entry, score });
    }

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.label.localeCompare(b.label);
    });

    return scored.slice(0, maxResults);
  }, [entries, tokens, maxResults]);

  return {
    results,
    hasQuery: tokens.length > 0,
    totalResults: results.length,
  };
};

export default useSidebarSearch;
