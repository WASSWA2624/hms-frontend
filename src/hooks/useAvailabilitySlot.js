/**
 * useAvailabilitySlot Hook
 * File: useAvailabilitySlot.js
 */
import useCrud from '@hooks/useCrud';
import {
  createAvailabilitySlot,
  deleteAvailabilitySlot,
  getAvailabilitySlot,
  listAvailabilitySlots,
  updateAvailabilitySlot,
} from '@features/availability-slot';

const useAvailabilitySlot = () =>
  useCrud({
    list: listAvailabilitySlots,
    get: getAvailabilitySlot,
    create: createAvailabilitySlot,
    update: updateAvailabilitySlot,
    remove: deleteAvailabilitySlot,
  });

export default useAvailabilitySlot;
