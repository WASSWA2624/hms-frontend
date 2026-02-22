/**
 * Payment Usecase Tests
 * File: payment.usecase.test.js
 */
import {
  listPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  reconcilePayment,
  getPaymentChannelBreakdown,
} from '@features/payment';
import { endpoints } from '@config/endpoints';
import { paymentApi } from '@features/payment/payment.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/payment/payment.api', () => ({
  paymentApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    reconcile: jest.fn(),
    getChannelBreakdown: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('payment.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    paymentApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    paymentApi.get.mockResolvedValue({ data: { id: '1' } });
    paymentApi.create.mockResolvedValue({ data: { id: '1' } });
    paymentApi.update.mockResolvedValue({ data: { id: '1' } });
    paymentApi.remove.mockResolvedValue({ data: { id: '1' } });
    paymentApi.reconcile.mockResolvedValue({ data: { id: '1', status: 'COMPLETED' } });
    paymentApi.getChannelBreakdown.mockResolvedValue({ data: { channels: [] } });
  });

  runCrudUsecaseTests(
    {
      list: listPayments,
      get: getPayment,
      create: createPayment,
      update: updatePayment,
      remove: deletePayment,
    },
    { queueRequestIfOffline }
  );

  it('reconciles payment online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(reconcilePayment('1', { status: 'COMPLETED' })).resolves.toMatchObject({
      id: '1',
      status: 'COMPLETED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.PAYMENTS.RECONCILE('1'),
      method: 'POST',
      body: { status: 'COMPLETED' },
    });
    expect(paymentApi.reconcile).toHaveBeenCalledWith('1', { status: 'COMPLETED' });
  });

  it('reconciles payment online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(reconcilePayment('1')).resolves.toMatchObject({
      id: '1',
      status: 'COMPLETED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.PAYMENTS.RECONCILE('1'),
      method: 'POST',
      body: {},
    });
    expect(paymentApi.reconcile).toHaveBeenCalledWith('1', {});
  });

  it('queues payment reconcile offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(reconcilePayment('1', { status: 'REFUNDED' })).resolves.toMatchObject({
      id: '1',
      status: 'REFUNDED',
    });
    expect(paymentApi.reconcile).not.toHaveBeenCalled();
  });

  it('rejects invalid id for payment reconcile', async () => {
    await expect(reconcilePayment(null, { status: 'COMPLETED' })).rejects.toBeDefined();
  });

  it('gets payment channel breakdown', async () => {
    await expect(getPaymentChannelBreakdown('1')).resolves.toEqual({ channels: [] });
    expect(paymentApi.getChannelBreakdown).toHaveBeenCalledWith('1');
  });

  it('returns empty channel breakdown object when action response is empty', async () => {
    paymentApi.getChannelBreakdown.mockResolvedValueOnce(undefined);

    await expect(getPaymentChannelBreakdown('1')).resolves.toEqual({});
    expect(paymentApi.getChannelBreakdown).toHaveBeenCalledWith('1');
  });

  it('rejects invalid id for payment channel breakdown', async () => {
    await expect(getPaymentChannelBreakdown(null)).rejects.toBeDefined();
  });
});
