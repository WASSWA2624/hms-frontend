/**
 * useTermsAcceptance Hook
 * CRUD binding for terms acceptance feature.
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createTermsAcceptance,
  deleteTermsAcceptance,
  getTermsAcceptance,
  listTermsAcceptances,
} from '@features/terms-acceptance';

const useTermsAcceptance = () => {
  const actions = useMemo(
    () => ({
      list: listTermsAcceptances,
      get: getTermsAcceptance,
      create: createTermsAcceptance,
      remove: deleteTermsAcceptance,
    }),
    []
  );

  return useCrud(actions);
};

export default useTermsAcceptance;
