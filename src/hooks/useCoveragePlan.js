/**
 * useCoveragePlan Hook
 * File: useCoveragePlan.js
 */
import useCrud from '@hooks/useCrud';
import {
  listCoveragePlans,
  getCoveragePlan,
  createCoveragePlan,
  updateCoveragePlan,
  deleteCoveragePlan
} from '@features/coverage-plan';

const useCoveragePlan = () =>
  useCrud({
    list: listCoveragePlans,
    get: getCoveragePlan,
    create: createCoveragePlan,
    update: updateCoveragePlan,
    remove: deleteCoveragePlan,
  });

export default useCoveragePlan;
