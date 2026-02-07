import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  listShiftTemplates,
  getShiftTemplate,
  createShiftTemplate,
  updateShiftTemplate,
  deleteShiftTemplate,
} from '@features/shift-template';

const useShiftTemplate = () => {
  const actions = useMemo(
    () => ({
      list: listShiftTemplates,
      get: getShiftTemplate,
      create: createShiftTemplate,
      update: updateShiftTemplate,
      remove: deleteShiftTemplate,
    }),
    []
  );
  return useCrud(actions);
};

export default useShiftTemplate;
