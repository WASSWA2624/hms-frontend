import { SETTINGS_TABS } from './types';

const GENERAL_SCREEN_KEY = SETTINGS_TABS.GENERAL;

const resolveSettingsScreenCopy = (t, screenKey) => {
  const safeScreenKey = typeof screenKey === 'string' ? screenKey : GENERAL_SCREEN_KEY;
  const isGeneralScreen = safeScreenKey === GENERAL_SCREEN_KEY;
  const moduleTitle = isGeneralScreen ? t('settings.general.title') : t(`settings.tabs.${safeScreenKey}`);
  const screenDescription = isGeneralScreen
    ? t('settings.general.description')
    : t('settings.screen.moduleDescription', { module: moduleTitle });

  const helpTitle = t('settings.screen.helpTitleForModule', { module: moduleTitle });
  const helpBody = isGeneralScreen
    ? t('settings.screen.helpBody')
    : t('settings.screen.helpBodyForModule', { module: moduleTitle });
  const helpTooltip = t('settings.screen.helpTooltipForModule', { module: moduleTitle });
  const helpLabel = t('settings.screen.helpLabelForModule', { module: moduleTitle });

  const helpItems = isGeneralScreen
    ? [
      t('settings.screen.helpList.sequence'),
      t('settings.screen.helpList.context'),
      t('settings.screen.helpList.access'),
    ]
    : [
      t('settings.screen.helpList.moduleReview', { module: moduleTitle }),
      t('settings.screen.helpList.moduleActions', { module: moduleTitle }),
      t('settings.screen.helpList.moduleAccess', { module: moduleTitle }),
    ];

  return {
    screenTitle: moduleTitle,
    screenDescription,
    helpTitle,
    helpBody,
    helpTooltip,
    helpLabel,
    helpItems,
  };
};

export default resolveSettingsScreenCopy;

