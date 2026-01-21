/**
 * useFacility Hook
 * File: useFacility.js
 */
import useCrud from '@hooks/useCrud';
import {
  createFacility,
  deleteFacility,
  getFacility,
  listFacilities,
  listFacilityBranches,
  updateFacility,
} from '@features/facility';

const useFacility = () =>
  useCrud({
    list: listFacilities,
    get: getFacility,
    create: createFacility,
    update: updateFacility,
    remove: deleteFacility,
    listBranches: listFacilityBranches,
  });

export default useFacility;
