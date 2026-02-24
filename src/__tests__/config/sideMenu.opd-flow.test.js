import { MAIN_NAV_ITEMS, PATIENT_MENU_ITEMS } from '@config/sideMenu';

const hasUniquePaths = (items = []) => {
  const seen = new Set();

  for (const item of items) {
    const path = String(item?.path || '').trim();
    if (!path) continue;
    if (seen.has(path)) return false;
    seen.add(path);
  }

  return true;
};

describe('sideMenu uniqueness and flatness', () => {
  it('keeps unique route paths in MAIN_NAV_ITEMS', () => {
    expect(hasUniquePaths(MAIN_NAV_ITEMS)).toBe(true);
  });

  it('keeps unique route paths in PATIENT_MENU_ITEMS', () => {
    expect(hasUniquePaths(PATIENT_MENU_ITEMS)).toBe(true);
  });

  it('keeps MAIN_NAV_ITEMS flat with no nested children', () => {
    expect(MAIN_NAV_ITEMS.every((item) => item?.children == null)).toBe(true);
  });
});
