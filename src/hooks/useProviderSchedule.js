/**
 * useProviderSchedule Hook
 * File: useProviderSchedule.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createProviderSchedule,
  deleteProviderSchedule,
  getProviderSchedule,
  listProviderSchedules,
  updateProviderSchedule,
} from '@features/provider-schedule';

const useProviderSchedule = () => {
  const actions = useMemo(
    () => ({
      list: listProviderSchedules,
      get: getProviderSchedule,
      create: createProviderSchedule,
      update: updateProviderSchedule,
      remove: deleteProviderSchedule,
    }),
    []
  );

  return useCrud(actions);
};

export default useProviderSchedule;
