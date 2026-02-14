/**
 * usePreAuthorization Hook
 * File: usePreAuthorization.js
 */
import useCrud from '@hooks/useCrud';
import {
  listPreAuthorizations,
  getPreAuthorization,
  createPreAuthorization,
  updatePreAuthorization,
  deletePreAuthorization
} from '@features/pre-authorization';

const usePreAuthorization = () =>
  useCrud({
    list: listPreAuthorizations,
    get: getPreAuthorization,
    create: createPreAuthorization,
    update: updatePreAuthorization,
    remove: deletePreAuthorization,
  });

export default usePreAuthorization;
