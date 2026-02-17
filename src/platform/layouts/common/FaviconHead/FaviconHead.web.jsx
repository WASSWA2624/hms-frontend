import { useEffect } from 'react';
import {
  FLUENT_PRIMARY,
  PUBLIC_APPLE_TOUCH_ICON,
  PUBLIC_FAVICON,
  PUBLIC_ICON_192,
  PUBLIC_ICON_512,
} from '@config/app-identity';

const FaviconHead = () => {
  useEffect(() => {
    const links = [
      { rel: 'icon', href: PUBLIC_FAVICON, type: 'image/png' },
      { rel: 'shortcut icon', href: PUBLIC_FAVICON, type: 'image/png' },
      { rel: 'apple-touch-icon', href: PUBLIC_APPLE_TOUCH_ICON, type: 'image/png' },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'icon', href: PUBLIC_ICON_192, sizes: '192x192', type: 'image/png' },
      { rel: 'icon', href: PUBLIC_ICON_512, sizes: '512x512', type: 'image/png' },
    ];

    const existing = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel="manifest"]');
    existing.forEach((el) => el.remove());

    links.forEach(({ rel, href, sizes, type }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (sizes) link.sizes = sizes;
      if (type) link.type = type;
      document.head.appendChild(link);
    });

    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute('content', FLUENT_PRIMARY);
  }, []);
  return null;
};

export default FaviconHead;
