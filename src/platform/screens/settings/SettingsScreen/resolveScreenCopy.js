import { SETTINGS_SCREEN_MODES, SETTINGS_TABS } from './types';

const GENERAL_SCREEN_KEY = SETTINGS_TABS.GENERAL;
const DEFAULT_MODE = SETTINGS_SCREEN_MODES.OVERVIEW;
const SUPPORTED_MODES = new Set(Object.values(SETTINGS_SCREEN_MODES));

const resolveTranslation = (t, key, values = {}, fallback = '') => {
  const resolved = t(key, values);
  return resolved === key ? fallback : resolved;
};

const resolveScreenMode = (screenMode, isGeneralScreen) => {
  if (isGeneralScreen) return SETTINGS_SCREEN_MODES.OVERVIEW;
  if (SUPPORTED_MODES.has(screenMode)) return screenMode;
  return SETTINGS_SCREEN_MODES.LIST;
};

const resolveSettingsScreenCopy = (t, screenKey, screenMode = DEFAULT_MODE) => {
  const safeScreenKey = typeof screenKey === 'string' ? screenKey : GENERAL_SCREEN_KEY;
  const isGeneralScreen = safeScreenKey === GENERAL_SCREEN_KEY;
  const mode = resolveScreenMode(screenMode, isGeneralScreen);
  const moduleTitle = isGeneralScreen
    ? t('settings.general.title')
    : t(`settings.tabs.${safeScreenKey}`);
  const moduleItemTitle = isGeneralScreen
    ? moduleTitle
    : resolveTranslation(t, `settings.tabsSingular.${safeScreenKey}`, {}, moduleTitle);
  const screenType = resolveTranslation(
    t,
    `settings.screen.screenType.${mode}`,
    {},
    mode
  );

  let screenTitle = moduleTitle;
  if (!isGeneralScreen) {
    if (mode === SETTINGS_SCREEN_MODES.CREATE) {
      screenTitle = resolveTranslation(
        t,
        'settings.screen.titleForCreate',
        { module: moduleTitle, moduleItem: moduleItemTitle },
        `Create ${moduleItemTitle}`
      );
    } else if (mode === SETTINGS_SCREEN_MODES.EDIT) {
      screenTitle = resolveTranslation(
        t,
        'settings.screen.titleForEdit',
        { module: moduleTitle, moduleItem: moduleItemTitle },
        `Edit ${moduleItemTitle}`
      );
    } else if (mode === SETTINGS_SCREEN_MODES.DETAIL) {
      screenTitle = resolveTranslation(
        t,
        'settings.screen.titleForDetail',
        { module: moduleTitle, moduleItem: moduleItemTitle },
        `${moduleItemTitle} details`
      );
    }
  }

  let screenDescription = isGeneralScreen
    ? t('settings.general.description')
    : t('settings.screen.moduleDescription', { module: moduleTitle });

  if (!isGeneralScreen) {
    if (mode === SETTINGS_SCREEN_MODES.CREATE) {
      screenDescription = resolveTranslation(
        t,
        'settings.screen.descriptionForCreate',
        { module: moduleTitle, moduleItem: moduleItemTitle },
        screenDescription
      );
    } else if (mode === SETTINGS_SCREEN_MODES.EDIT) {
      screenDescription = resolveTranslation(
        t,
        'settings.screen.descriptionForEdit',
        { module: moduleTitle, moduleItem: moduleItemTitle },
        screenDescription
      );
    } else if (mode === SETTINGS_SCREEN_MODES.DETAIL) {
      screenDescription = resolveTranslation(
        t,
        'settings.screen.descriptionForDetail',
        { module: moduleTitle, moduleItem: moduleItemTitle },
        screenDescription
      );
    } else {
      screenDescription = resolveTranslation(
        t,
        'settings.screen.descriptionForList',
        { module: moduleTitle, moduleItem: moduleItemTitle },
        screenDescription
      );
    }
  }

  const helpTitle = isGeneralScreen
    ? t('settings.screen.helpTitle')
    : resolveTranslation(
      t,
      'settings.screen.helpTitleForContext',
      { module: moduleTitle, moduleItem: moduleItemTitle, screenType },
      t('settings.screen.helpTitleForModule', { module: moduleTitle })
    );
  let helpBody = isGeneralScreen
    ? t('settings.screen.helpBody')
    : t('settings.screen.helpBodyForModule', { module: moduleTitle });

  if (!isGeneralScreen) {
    const modeToBodyKey = {
      [SETTINGS_SCREEN_MODES.LIST]: 'settings.screen.helpBodyForList',
      [SETTINGS_SCREEN_MODES.DETAIL]: 'settings.screen.helpBodyForDetail',
      [SETTINGS_SCREEN_MODES.CREATE]: 'settings.screen.helpBodyForCreate',
      [SETTINGS_SCREEN_MODES.EDIT]: 'settings.screen.helpBodyForEdit',
    };

    helpBody = resolveTranslation(
      t,
      modeToBodyKey[mode] || 'settings.screen.helpBodyForModule',
      { module: moduleTitle, moduleItem: moduleItemTitle, screenType },
      helpBody
    );
  }

  const helpTooltip = isGeneralScreen
    ? t('settings.screen.helpTooltip')
    : resolveTranslation(
      t,
      'settings.screen.helpTooltipForContext',
      { module: moduleTitle, moduleItem: moduleItemTitle, screenType },
      t('settings.screen.helpTooltipForModule', { module: moduleTitle })
    );

  const helpLabel = isGeneralScreen
    ? t('settings.screen.helpLabel')
    : resolveTranslation(
      t,
      'settings.screen.helpLabelForContext',
      { module: moduleTitle, moduleItem: moduleItemTitle, screenType },
      t('settings.screen.helpLabelForModule', { module: moduleTitle })
    );

  let helpItems = [
    t('settings.screen.helpList.sequence'),
    t('settings.screen.helpList.context'),
    t('settings.screen.helpList.access'),
  ];

  if (!isGeneralScreen) {
    if (mode === SETTINGS_SCREEN_MODES.DETAIL) {
      helpItems = [
        resolveTranslation(t, 'settings.screen.helpListByMode.detail.verify', { module: moduleTitle, moduleItem: moduleItemTitle }),
        resolveTranslation(t, 'settings.screen.helpListByMode.detail.actions', { module: moduleTitle, moduleItem: moduleItemTitle }),
        resolveTranslation(t, 'settings.screen.helpListByMode.detail.access', { module: moduleTitle, moduleItem: moduleItemTitle }),
        resolveTranslation(t, 'settings.screen.helpListByMode.detail.recovery', { module: moduleTitle, moduleItem: moduleItemTitle }),
      ];
    } else if (mode === SETTINGS_SCREEN_MODES.CREATE) {
      helpItems = [
        resolveTranslation(t, 'settings.screen.helpListByMode.create.prerequisites', { module: moduleTitle, moduleItem: moduleItemTitle }),
        resolveTranslation(t, 'settings.screen.helpListByMode.create.fields', { module: moduleTitle, moduleItem: moduleItemTitle }),
        resolveTranslation(t, 'settings.screen.helpListByMode.create.submit', { module: moduleTitle, moduleItem: moduleItemTitle }),
        resolveTranslation(t, 'settings.screen.helpListByMode.create.recovery', { module: moduleTitle, moduleItem: moduleItemTitle }),
      ];
    } else if (mode === SETTINGS_SCREEN_MODES.EDIT) {
      helpItems = [
        resolveTranslation(t, 'settings.screen.helpListByMode.edit.baseline', { module: moduleTitle, moduleItem: moduleItemTitle }),
        resolveTranslation(t, 'settings.screen.helpListByMode.edit.changes', { module: moduleTitle, moduleItem: moduleItemTitle }),
        resolveTranslation(t, 'settings.screen.helpListByMode.edit.submit', { module: moduleTitle, moduleItem: moduleItemTitle }),
        resolveTranslation(t, 'settings.screen.helpListByMode.edit.recovery', { module: moduleTitle, moduleItem: moduleItemTitle }),
      ];
    } else {
      helpItems = [
        resolveTranslation(t, 'settings.screen.helpListByMode.list.review', { module: moduleTitle, moduleItem: moduleItemTitle }),
        resolveTranslation(t, 'settings.screen.helpListByMode.list.actions', { module: moduleTitle, moduleItem: moduleItemTitle }),
        resolveTranslation(t, 'settings.screen.helpListByMode.list.access', { module: moduleTitle, moduleItem: moduleItemTitle }),
        resolveTranslation(t, 'settings.screen.helpListByMode.list.recovery', { module: moduleTitle, moduleItem: moduleItemTitle }),
      ];
    }
  }

  return {
    screenTitle,
    screenDescription,
    helpTitle,
    helpBody,
    helpTooltip,
    helpLabel,
    helpItems,
    screenMode: mode,
  };
};

export default resolveSettingsScreenCopy;
