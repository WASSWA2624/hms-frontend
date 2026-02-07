/**
 * FaviconHead - Web
 * Injects favicon link into document head for browser tab icon.
 * Uses bundled asset so favicon works in both dev and production.
 * File: FaviconHead.web.jsx
 */
import { useEffect } from 'react';

const faviconUrl = require('../../../../../assets/favicon.png');

const FaviconHead = () => {
  useEffect(() => {
    const existing = document.querySelectorAll('link[rel="icon"]');
    existing.forEach((el) => el.remove());
    const link = document.createElement('link');
    link.rel = 'icon';
    const href = typeof faviconUrl === 'string' ? faviconUrl : (faviconUrl?.uri ?? faviconUrl?.default ?? '/favicon.png');
    link.href = href;
    link.type = 'image/png';
    document.head.appendChild(link);
  }, []);
  return null;
};

export default FaviconHead;
