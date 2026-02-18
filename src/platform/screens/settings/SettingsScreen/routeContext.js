import { SETTINGS_SEGMENT_TO_TAB, SETTINGS_TABS, SETTINGS_SCREEN_MODES } from './types';

const GENERAL_SEGMENTS = new Set(['', 'index', 'general']);

const splitPath = (pathname = '') => String(pathname).split('/').filter(Boolean);

const getSettingsSegments = (pathname = '') => {
  const segments = splitPath(pathname);
  const settingsIndex = segments.indexOf('settings');
  return settingsIndex === -1 ? [] : segments.slice(settingsIndex + 1);
};

export const resolveSettingsRouteContext = (pathname = '') => {
  const routeSegments = getSettingsSegments(pathname);
  const firstSegment = routeSegments[0] || '';

  if (GENERAL_SEGMENTS.has(firstSegment)) {
    return {
      screenKey: SETTINGS_TABS.GENERAL,
      screenMode: SETTINGS_SCREEN_MODES.OVERVIEW,
    };
  }

  const screenKey = SETTINGS_SEGMENT_TO_TAB[firstSegment];
  if (!screenKey) {
    return {
      screenKey: SETTINGS_TABS.GENERAL,
      screenMode: SETTINGS_SCREEN_MODES.OVERVIEW,
    };
  }

  const secondSegment = routeSegments[1] || '';
  const thirdSegment = routeSegments[2] || '';

  if (!secondSegment || secondSegment === 'index') {
    return { screenKey, screenMode: SETTINGS_SCREEN_MODES.LIST };
  }

  if (secondSegment === 'create') {
    return { screenKey, screenMode: SETTINGS_SCREEN_MODES.CREATE };
  }

  if (thirdSegment === 'edit') {
    return { screenKey, screenMode: SETTINGS_SCREEN_MODES.EDIT };
  }

  return { screenKey, screenMode: SETTINGS_SCREEN_MODES.DETAIL };
};

export default resolveSettingsRouteContext;
