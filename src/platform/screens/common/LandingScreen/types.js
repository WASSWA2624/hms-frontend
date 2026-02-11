/**
 * LandingScreen Types
 * Facility options and defaults for onboarding entry.
 * File: types.js
 */

const FACILITY_OPTIONS = [
  { id: 'clinic', labelKey: 'landing.facility.options.clinic', icon: '🩺' },
  { id: 'hospital', labelKey: 'landing.facility.options.hospital', icon: '🏥' },
  { id: 'lab', labelKey: 'landing.facility.options.lab', icon: '🧪' },
  { id: 'pharmacy', labelKey: 'landing.facility.options.pharmacy', icon: '💊' },
  { id: 'emergency', labelKey: 'landing.facility.options.emergency', icon: '🚑' },
];

const DEFAULT_FACILITY_OPTION = 'clinic';

export { FACILITY_OPTIONS, DEFAULT_FACILITY_OPTION };
