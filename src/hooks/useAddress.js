/**
 * useAddress Hook
 * File: useAddress.js
 */
import useCrud from '@hooks/useCrud';
import { createAddress, deleteAddress, getAddress, listAddresses, updateAddress } from '@features/address';

const useAddress = () =>
  useCrud({
    list: listAddresses,
    get: getAddress,
    create: createAddress,
    update: updateAddress,
    remove: deleteAddress,
  });

export default useAddress;
