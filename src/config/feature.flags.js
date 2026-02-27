/**
 * Feature Flags
 * File: feature.flags.js
 */

const FALSE_VALUES = new Set(['0', 'false', 'off', 'no']);

const parseFlag = (value, defaultValue = false) => {
  if (value == null || value === '') return Boolean(defaultValue);
  return !FALSE_VALUES.has(String(value).trim().toLowerCase());
};

export const OFFLINE_MODE = parseFlag(
  process.env.EXPO_PUBLIC_OFFLINE_MODE,
  true
);
export const ANALYTICS_ENABLED = parseFlag(
  process.env.EXPO_PUBLIC_ANALYTICS_ENABLED,
  false
);
export const MAINTENANCE_MODE = parseFlag(
  process.env.EXPO_PUBLIC_MAINTENANCE_MODE,
  false
);
export const MAINTENANCE_MESSAGE =
  process.env.EXPO_PUBLIC_MAINTENANCE_MESSAGE || '';
export const IPD_WORKBENCH_V1 = parseFlag(
  process.env.EXPO_PUBLIC_IPD_WORKBENCH_V1,
  true
);
export const ICU_WORKBENCH_V1 = parseFlag(
  process.env.EXPO_PUBLIC_ICU_WORKBENCH_V1,
  true
);
export const THEATRE_WORKBENCH_V1 = parseFlag(
  process.env.EXPO_PUBLIC_THEATRE_WORKBENCH_V1,
  false
);
export const EMERGENCY_WORKBENCH_V1 = parseFlag(
  process.env.EXPO_PUBLIC_EMERGENCY_WORKBENCH_V1,
  true
);
export const PHARMACY_WORKSPACE_V1 = parseFlag(
  process.env.EXPO_PUBLIC_PHARMACY_WORKSPACE_V1,
  false
);
export const RADIOLOGY_WORKBENCH_V2 = parseFlag(
  process.env.EXPO_PUBLIC_RADIOLOGY_WORKBENCH_V2,
  false
);
