/**
 * useImagingAsset Hook
 * File: useImagingAsset.js
 */
import useCrud from '@hooks/useCrud';
import {
  createImagingAsset,
  deleteImagingAsset,
  getImagingAsset,
  listImagingAssets,
  updateImagingAsset,
} from '@features/imaging-asset';

const useImagingAsset = () =>
  useCrud({
    list: listImagingAssets,
    get: getImagingAsset,
    create: createImagingAsset,
    update: updateImagingAsset,
    remove: deleteImagingAsset,
  });

export default useImagingAsset;
