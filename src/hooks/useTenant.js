/**
 * useTenant Hook
 * File: useTenant.js
 */
import useCrud from '@hooks/useCrud';
import { createTenant, deleteTenant, getTenant, listTenants, updateTenant } from '@features/tenant';

const useTenant = () =>
  useCrud({
    list: listTenants,
    get: getTenant,
    create: createTenant,
    update: updateTenant,
    remove: deleteTenant,
  });

export default useTenant;
