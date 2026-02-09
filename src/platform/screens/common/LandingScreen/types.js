/**
 * LandingScreen Types
 * Facility options and defaults for onboarding entry.
 * File: types.js
 */

const FACILITY_OPTIONS = [
  { id: 'clinic', labelKey: 'landing.facility.options.clinic' },
  { id: 'hospital', labelKey: 'landing.facility.options.hospital' },
  { id: 'lab', labelKey: 'landing.facility.options.lab' },
  { id: 'pharmacy', labelKey: 'landing.facility.options.pharmacy' },
  { id: 'emergency', labelKey: 'landing.facility.options.emergency' },
];

const DEFAULT_FACILITY_OPTION = 'clinic';

export { FACILITY_OPTIONS, DEFAULT_FACILITY_OPTION };
