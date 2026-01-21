/**
 * useWard Hook
 * File: useWard.js
 */
import useCrud from '@hooks/useCrud';
import { createWard, deleteWard, getWard, listWardBeds, listWards, updateWard } from '@features/ward';

const useWard = () =>
  useCrud({
    list: listWards,
    get: getWard,
    create: createWard,
    update: updateWard,
    remove: deleteWard,
    listBeds: listWardBeds,
  });

export default useWard;
