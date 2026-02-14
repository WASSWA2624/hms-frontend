/**
 * useKpiSnapshot Hook
 * File: useKpiSnapshot.js
 */
import useCrud from '@hooks/useCrud';
import {
  listKpiSnapshots,
  getKpiSnapshot,
  createKpiSnapshot,
  updateKpiSnapshot,
  deleteKpiSnapshot
} from '@features/kpi-snapshot';

const useKpiSnapshot = () =>
  useCrud({
    list: listKpiSnapshots,
    get: getKpiSnapshot,
    create: createKpiSnapshot,
    update: updateKpiSnapshot,
    remove: deleteKpiSnapshot,
  });

export default useKpiSnapshot;
