/**
 * useNurseRoster Hook
 * File: useNurseRoster.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  listNurseRosters,
  getNurseRoster,
  createNurseRoster,
  updateNurseRoster,
  deleteNurseRoster,
  publishNurseRoster,
  generateNurseRoster,
} from '@features/nurse-roster';

const useNurseRoster = () => {
  const actions = useMemo(
    () => ({
      list: listNurseRosters,
      get: getNurseRoster,
      create: createNurseRoster,
      update: updateNurseRoster,
      remove: deleteNurseRoster,
      publish: publishNurseRoster,
      generate: generateNurseRoster,
    }),
    []
  );
  return useCrud(actions);
};

export default useNurseRoster;
