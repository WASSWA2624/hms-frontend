/**
 * useStaffProfile Hook
 * File: useStaffProfile.js
 */
import useCrud from '@hooks/useCrud';
import {
  listStaffProfiles,
  getStaffProfile,
  createStaffProfile,
  updateStaffProfile,
  deleteStaffProfile
} from '@features/staff-profile';

const useStaffProfile = () =>
  useCrud({
    list: listStaffProfiles,
    get: getStaffProfile,
    create: createStaffProfile,
    update: updateStaffProfile,
    remove: deleteStaffProfile,
  });

export default useStaffProfile;
