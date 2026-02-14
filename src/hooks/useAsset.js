/**
 * useAsset Hook
 * File: useAsset.js
 */
import useCrud from '@hooks/useCrud';
import {
  listAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset
} from '@features/asset';

const useAsset = () =>
  useCrud({
    list: listAssets,
    get: getAsset,
    create: createAsset,
    update: updateAsset,
    remove: deleteAsset,
  });

export default useAsset;
