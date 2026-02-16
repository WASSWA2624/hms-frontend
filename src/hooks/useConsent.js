/**
 * useConsent Hook
 * CRUD binding for consent feature.
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import { createConsent, deleteConsent, getConsent, listConsents, updateConsent } from '@features/consent';

const useConsent = () => {
  const actions = useMemo(
    () => ({
      list: listConsents,
      get: getConsent,
      create: createConsent,
      update: updateConsent,
      remove: deleteConsent,
    }),
    []
  );

  return useCrud(actions);
};

export default useConsent;
