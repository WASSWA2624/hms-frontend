/**
 * useUserProfile Hook
 * File: useUserProfile.js
 */
import useCrud from '@hooks/useCrud';
import {
  createUserProfile,
  deleteUserProfile,
  getUserProfile,
  listUserProfiles,
  updateUserProfile,
} from '@features/user-profile';

const useUserProfile = () =>
  useCrud({
    list: listUserProfiles,
    get: getUserProfile,
    create: createUserProfile,
    update: updateUserProfile,
    remove: deleteUserProfile,
  });

export default useUserProfile;
