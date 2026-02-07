import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  listStaffAvailabilities,
  getStaffAvailability,
  createStaffAvailability,
  updateStaffAvailability,
  deleteStaffAvailability,
} from '@features/staff-availability';

const useStaffAvailability = () => {
  const actions = useMemo(
    () => ({
      list: listStaffAvailabilities,
      get: getStaffAvailability,
      create: createStaffAvailability,
      update: updateStaffAvailability,
      remove: deleteStaffAvailability,
    }),
    []
  );
  return useCrud(actions);
};

export default useStaffAvailability;
