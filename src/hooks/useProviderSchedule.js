/**
 * useProviderSchedule Hook
 * File: useProviderSchedule.js
 */
import useCrud from '@hooks/useCrud';
import {
  createProviderSchedule,
  deleteProviderSchedule,
  getProviderSchedule,
  listProviderSchedules,
  updateProviderSchedule,
} from '@features/provider-schedule';

const useProviderSchedule = () =>
  useCrud({
    list: listProviderSchedules,
    get: getProviderSchedule,
    create: createProviderSchedule,
    update: updateProviderSchedule,
    remove: deleteProviderSchedule,
  });

export default useProviderSchedule;
