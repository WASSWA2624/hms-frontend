/**
 * usePacsLink Hook
 * File: usePacsLink.js
 */
import useCrud from '@hooks/useCrud';
import {
  createPacsLink,
  deletePacsLink,
  getPacsLink,
  listPacsLinks,
  updatePacsLink,
} from '@features/pacs-link';

const usePacsLink = () =>
  useCrud({
    list: listPacsLinks,
    get: getPacsLink,
    create: createPacsLink,
    update: updatePacsLink,
    remove: deletePacsLink,
  });

export default usePacsLink;
