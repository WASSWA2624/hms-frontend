/**
 * useAvailabilitySlot Hook
 * File: useAvailabilitySlot.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createAvailabilitySlot,
  deleteAvailabilitySlot,
  getAvailabilitySlot,
  listAvailabilitySlots,
  updateAvailabilitySlot,
} from '@features/availability-slot';

const useAvailabilitySlot = () => {
  const actions = useMemo(
    () => ({
      list: listAvailabilitySlots,
      get: getAvailabilitySlot,
      create: createAvailabilitySlot,
      update: updateAvailabilitySlot,
      remove: deleteAvailabilitySlot,
    }),
    []
  );

  return useCrud(actions);
};

export default useAvailabilitySlot;
