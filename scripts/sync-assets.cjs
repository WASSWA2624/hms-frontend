#!/usr/bin/env node
/**
 * Syncs app identity assets from assets/ to public/ for web.
 * Run: node scripts/sync-assets.cjs
 * Ensures favicon and logos in public/ match assets/ (single source: assets/).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');
const PUBLIC = path.join(ROOT, 'public');

const FILES = ['favicon.png', 'logo-light.png', 'logo-dark.png'];

FILES.forEach((file) => {
  const src = path.join(ASSETS, file);
  const dest = path.join(PUBLIC, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Synced ${file}`);
  } else {
    console.warn(`Skip ${file}: not found in assets/`);
  }
});
