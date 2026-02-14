/**
 * useHousekeepingSchedule Hook
 * File: useHousekeepingSchedule.js
 */
import useCrud from '@hooks/useCrud';
import {
  listHousekeepingSchedules,
  getHousekeepingSchedule,
  createHousekeepingSchedule,
  updateHousekeepingSchedule,
  deleteHousekeepingSchedule
} from '@features/housekeeping-schedule';

const useHousekeepingSchedule = () =>
  useCrud({
    list: listHousekeepingSchedules,
    get: getHousekeepingSchedule,
    create: createHousekeepingSchedule,
    update: updateHousekeepingSchedule,
    remove: deleteHousekeepingSchedule,
  });

export default useHousekeepingSchedule;
