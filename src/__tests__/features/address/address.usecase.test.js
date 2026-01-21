/**
 * Address Usecase Tests
 * File: address.usecase.test.js
 */
import { listAddresses, getAddress, createAddress, updateAddress, deleteAddress } from '@features/address';
import { addressApi } from '@features/address/address.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/address/address.api', () => ({
  addressApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('address.usecase', () => {
  beforeEach(() => {
    addressApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    addressApi.get.mockResolvedValue({ data: { id: '1' } });
    addressApi.create.mockResolvedValue({ data: { id: '1' } });
    addressApi.update.mockResolvedValue({ data: { id: '1' } });
    addressApi.remove.mockResolvedValue({ data: { id: '1' } });
  });

  runCrudUsecaseTests(
    {
      list: listAddresses,
      get: getAddress,
      create: createAddress,
      update: updateAddress,
      remove: deleteAddress,
    },
    { queueRequestIfOffline }
  );
});
