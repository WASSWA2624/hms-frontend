/**
 * Pharmacy Order Usecase Tests
 * File: pharmacy-order.usecase.test.js
 */
import {
  listPharmacyOrders,
  getPharmacyOrder,
  createPharmacyOrder,
  updatePharmacyOrder,
  deletePharmacyOrder,
  dispensePharmacyOrder,
} from '@features/pharmacy-order';
import { endpoints } from '@config/endpoints';
import { pharmacyOrderApi } from '@features/pharmacy-order/pharmacy-order.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/pharmacy-order/pharmacy-order.api', () => ({
  pharmacyOrderApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    dispense: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('pharmacy-order.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pharmacyOrderApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    pharmacyOrderApi.get.mockResolvedValue({ data: { id: '1' } });
    pharmacyOrderApi.create.mockResolvedValue({ data: { id: '1' } });
    pharmacyOrderApi.update.mockResolvedValue({ data: { id: '1' } });
    pharmacyOrderApi.remove.mockResolvedValue({ data: { id: '1' } });
    pharmacyOrderApi.dispense.mockResolvedValue({ data: { id: '1', status: 'DISPENSED' } });
  });

  runCrudUsecaseTests(
    {
      list: listPharmacyOrders,
      get: getPharmacyOrder,
      create: createPharmacyOrder,
      update: updatePharmacyOrder,
      remove: deletePharmacyOrder,
    },
    { queueRequestIfOffline }
  );

  it('dispenses pharmacy order online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(dispensePharmacyOrder('1', { notes: 'Dispensed by pharmacy' })).resolves.toMatchObject({
      id: '1',
      status: 'DISPENSED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.PHARMACY_ORDERS.DISPENSE('1'),
      method: 'POST',
      body: { notes: 'Dispensed by pharmacy' },
    });
    expect(pharmacyOrderApi.dispense).toHaveBeenCalledWith('1', {
      notes: 'Dispensed by pharmacy',
    });
  });

  it('dispenses pharmacy order online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(dispensePharmacyOrder('1')).resolves.toMatchObject({
      id: '1',
      status: 'DISPENSED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.PHARMACY_ORDERS.DISPENSE('1'),
      method: 'POST',
      body: {},
    });
    expect(pharmacyOrderApi.dispense).toHaveBeenCalledWith('1', {});
  });

  it('queues pharmacy order dispense offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(dispensePharmacyOrder('1', { notes: 'Dispensed by pharmacy' })).resolves.toMatchObject({
      id: '1',
      status: 'DISPENSED',
      notes: 'Dispensed by pharmacy',
    });
    expect(pharmacyOrderApi.dispense).not.toHaveBeenCalled();
  });

  it('rejects invalid id for dispense', async () => {
    await expect(dispensePharmacyOrder(null, { notes: 'Dispensed by pharmacy' })).rejects.toBeDefined();
  });
});
