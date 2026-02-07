import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  listRosterDayOffs,
  getRosterDayOff,
  createRosterDayOff,
  updateRosterDayOff,
  deleteRosterDayOff,
} from '@features/roster-day-off';

const useRosterDayOff = () => {
  const actions = useMemo(
    () => ({
      list: listRosterDayOffs,
      get: getRosterDayOff,
      create: createRosterDayOff,
      update: updateRosterDayOff,
      remove: deleteRosterDayOff,
    }),
    []
  );
  return useCrud(actions);
};

export default useRosterDayOff;
