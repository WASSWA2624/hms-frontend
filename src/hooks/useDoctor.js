/**
 * useDoctor Hook
 * File: useDoctor.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createDoctor, getDoctor, listDoctors, updateDoctor } from '@features/doctor';

const useDoctor = () => {
  const actions = useMemo(
    () => ({
      list: listDoctors,
      get: getDoctor,
      create: createDoctor,
      update: updateDoctor,
    }),
    []
  );

  return useCrud(actions);
};

export default useDoctor;
