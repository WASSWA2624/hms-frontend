/**
 * usePharmacyWorkspace Hook
 * File: usePharmacyWorkspace.js
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  adjustPharmacyInventoryStock,
  attestPharmacyDispense,
  cancelPharmacyOrder,
  getPharmacyOrderWorkflow,
  listPharmacyInventoryStock,
  listPharmacyWorkbench,
  preparePharmacyDispense,
  resolvePharmacyLegacyRoute,
  returnPharmacyOrder,
} from '@features/pharmacy-workspace';

const usePharmacyWorkspace = () => {
  const actions = useMemo(
    () => ({
      listWorkbench: listPharmacyWorkbench,
      getWorkflow: getPharmacyOrderWorkflow,
      resolveLegacyRoute: resolvePharmacyLegacyRoute,
      prepareDispense: preparePharmacyDispense,
      attestDispense: attestPharmacyDispense,
      cancelOrder: cancelPharmacyOrder,
      returnOrder: returnPharmacyOrder,
      listInventoryStock: listPharmacyInventoryStock,
      adjustInventory: adjustPharmacyInventoryStock,
    }),
    []
  );

  return useCrud(actions);
};

export default usePharmacyWorkspace;
