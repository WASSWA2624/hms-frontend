/**
 * useTransferRequest Hook
 * File: useTransferRequest.js
 */
import useCrud from '@hooks/useCrud';
import {
  createTransferRequest,
  deleteTransferRequest,
  getTransferRequest,
  listTransferRequests,
  updateTransferRequest,
} from '@features/transfer-request';

const useTransferRequest = () =>
  useCrud({
    list: listTransferRequests,
    get: getTransferRequest,
    create: createTransferRequest,
    update: updateTransferRequest,
    remove: deleteTransferRequest,
  });

export default useTransferRequest;
