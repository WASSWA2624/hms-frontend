/**
 * useAppointment Hook
 * File: useAppointment.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  cancelAppointment,
  createAppointment,
  deleteAppointment,
  getAppointment,
  listAppointments,
  updateAppointment,
} from '@features/appointment';

const useAppointment = () => {
  const actions = useMemo(
    () => ({
      list: listAppointments,
      get: getAppointment,
      create: createAppointment,
      update: updateAppointment,
      remove: deleteAppointment,
      cancel: cancelAppointment,
    }),
    []
  );

  return useCrud(actions);
};

export default useAppointment;
