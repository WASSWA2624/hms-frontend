/**
 * useAppointment Hook
 * File: useAppointment.js
 */
import useCrud from '@hooks/useCrud';
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  listAppointments,
  updateAppointment,
} from '@features/appointment';

const useAppointment = () =>
  useCrud({
    list: listAppointments,
    get: getAppointment,
    create: createAppointment,
    update: updateAppointment,
    remove: deleteAppointment,
  });

export default useAppointment;
