import { MAIN_NAV_ITEMS, PATIENT_MENU_ITEMS, MENU_ICON_GLYPHS } from '@config/sideMenu';

const collectIconKeys = (items = []) => {
  const keys = [];
  for (const item of items) {
    if (item?.icon) keys.push(item.icon);
    if (Array.isArray(item?.children) && item.children.length > 0) {
      keys.push(...collectIconKeys(item.children));
    }
  }
  return keys;
};

describe('sideMenu icon mappings', () => {
  it('maps every configured nav icon key to a glyph', () => {
    const iconKeys = new Set([
      ...collectIconKeys(MAIN_NAV_ITEMS),
      ...collectIconKeys(PATIENT_MENU_ITEMS),
    ]);

    const missing = [...iconKeys].filter((key) => MENU_ICON_GLYPHS[key] == null);
    expect(missing).toEqual([]);
  });
});

