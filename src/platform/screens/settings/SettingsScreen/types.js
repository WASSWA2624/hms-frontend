/**
 * Settings Screen Types
 * File: types.js
 * Type definitions and constants for Settings main screen
 */

export const SETTINGS_TABS = {
  GENERAL: 'general',
  FACILITY: 'facility',
  TENANT: 'tenant',
  BRANCH: 'branch',
  DEPARTMENT: 'department',
  UNIT: 'unit',
  ROOM: 'room',
  WARD: 'ward',
  BED: 'bed',
  ADDRESS: 'address',
  CONTACT: 'contact',
  USER: 'user',
  USER_PROFILE: 'user-profile',
  ROLE: 'role',
  PERMISSION: 'permission',
  ROLE_PERMISSION: 'role-permission',
  USER_ROLE: 'user-role',
  USER_SESSION: 'user-session',
  API_KEY: 'api-key',
  API_KEY_PERMISSION: 'api-key-permission',
  USER_MFA: 'user-mfa',
  OAUTH_ACCOUNT: 'oauth-account',
};

/** Tab id → icon key (from @config/sideMenu MENU_ICON_GLYPHS) */
export const SETTINGS_TAB_ICONS = {
  [SETTINGS_TABS.GENERAL]: 'settings-outline',
  [SETTINGS_TABS.FACILITY]: 'business-outline',
  [SETTINGS_TABS.TENANT]: 'layers-outline',
  [SETTINGS_TABS.BRANCH]: 'git-branch-outline',
  [SETTINGS_TABS.DEPARTMENT]: 'folder-outline',
  [SETTINGS_TABS.UNIT]: 'grid-outline',
  [SETTINGS_TABS.ROOM]: 'home-outline',
  [SETTINGS_TABS.WARD]: 'medkit-outline',
  [SETTINGS_TABS.BED]: 'bed-outline',
  [SETTINGS_TABS.ADDRESS]: 'map-outline',
  [SETTINGS_TABS.CONTACT]: 'people-outline',
  [SETTINGS_TABS.USER]: 'people-outline',
  [SETTINGS_TABS.USER_PROFILE]: 'person-outline',
  [SETTINGS_TABS.ROLE]: 'people-outline',
  [SETTINGS_TABS.PERMISSION]: 'shield-outline',
  [SETTINGS_TABS.ROLE_PERMISSION]: 'shield-checkmark-outline',
  [SETTINGS_TABS.USER_ROLE]: 'people-outline',
  [SETTINGS_TABS.USER_SESSION]: 'time-outline',
  [SETTINGS_TABS.API_KEY]: 'key-outline',
  [SETTINGS_TABS.API_KEY_PERMISSION]: 'shield-outline',
  [SETTINGS_TABS.USER_MFA]: 'lock-closed-outline',
  [SETTINGS_TABS.OAUTH_ACCOUNT]: 'lock-open-outline',
};

/** Sidebar groups: id, i18n label key, tab ids in order */
export const SETTINGS_SIDEBAR_GROUPS = [
  {
    id: 'general',
    labelKey: 'settings.sidebar.groups.general',
    tabs: [SETTINGS_TABS.GENERAL],
  },
  {
    id: 'organization',
    labelKey: 'settings.sidebar.groups.organization',
    tabs: [
      SETTINGS_TABS.FACILITY,
      SETTINGS_TABS.TENANT,
      SETTINGS_TABS.BRANCH,
      SETTINGS_TABS.DEPARTMENT,
      SETTINGS_TABS.UNIT,
      SETTINGS_TABS.ROOM,
      SETTINGS_TABS.WARD,
      SETTINGS_TABS.BED,
      SETTINGS_TABS.ADDRESS,
      SETTINGS_TABS.CONTACT,
    ],
  },
  {
    id: 'usersAndAccess',
    labelKey: 'settings.sidebar.groups.usersAndAccess',
    tabs: [
      SETTINGS_TABS.USER,
      SETTINGS_TABS.USER_PROFILE,
      SETTINGS_TABS.ROLE,
      SETTINGS_TABS.PERMISSION,
      SETTINGS_TABS.ROLE_PERMISSION,
      SETTINGS_TABS.USER_ROLE,
      SETTINGS_TABS.USER_SESSION,
    ],
  },
  {
    id: 'security',
    labelKey: 'settings.sidebar.groups.security',
    tabs: [
      SETTINGS_TABS.API_KEY,
      SETTINGS_TABS.API_KEY_PERMISSION,
      SETTINGS_TABS.USER_MFA,
      SETTINGS_TABS.OAUTH_ACCOUNT,
    ],
  },
];

export const SETTINGS_TAB_ORDER = [
  SETTINGS_TABS.GENERAL,
  SETTINGS_TABS.FACILITY,
  SETTINGS_TABS.TENANT,
  SETTINGS_TABS.BRANCH,
  SETTINGS_TABS.DEPARTMENT,
  SETTINGS_TABS.UNIT,
  SETTINGS_TABS.ROOM,
  SETTINGS_TABS.WARD,
  SETTINGS_TABS.BED,
  SETTINGS_TABS.ADDRESS,
  SETTINGS_TABS.CONTACT,
  SETTINGS_TABS.USER,
  SETTINGS_TABS.USER_PROFILE,
  SETTINGS_TABS.ROLE,
  SETTINGS_TABS.PERMISSION,
  SETTINGS_TABS.ROLE_PERMISSION,
  SETTINGS_TABS.USER_ROLE,
  SETTINGS_TABS.USER_SESSION,
  SETTINGS_TABS.API_KEY,
  SETTINGS_TABS.API_KEY_PERMISSION,
  SETTINGS_TABS.USER_MFA,
  SETTINGS_TABS.OAUTH_ACCOUNT,
];

export const STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
};
