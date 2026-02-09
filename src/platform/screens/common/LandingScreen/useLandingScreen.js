/**
 * useLandingScreen Hook
 * Local selection state for facility type on landing.
 * File: useLandingScreen.js
 */

import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_FACILITY_OPTION, FACILITY_OPTIONS } from './types';

const useLandingScreen = ({ initialSelection } = {}) => {
  const [selectedId, setSelectedId] = useState(initialSelection || DEFAULT_FACILITY_OPTION);
  const options = useMemo(() => FACILITY_OPTIONS, []);

  const selectOption = useCallback((id) => {
    if (!id) return;
    setSelectedId(id);
  }, []);

  return {
    options,
    selectedId,
    selectOption,
  };
};

export default useLandingScreen;
