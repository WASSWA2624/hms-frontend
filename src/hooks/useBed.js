/**
 * useBed Hook
 * File: useBed.js
 */
import useCrud from '@hooks/useCrud';
import { createBed, deleteBed, getBed, listBeds, updateBed } from '@features/bed';

const useBed = () =>
  useCrud({
    list: listBeds,
    get: getBed,
    create: createBed,
    update: updateBed,
    remove: deleteBed,
  });

export default useBed;
