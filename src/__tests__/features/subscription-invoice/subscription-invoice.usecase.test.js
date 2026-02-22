/**
 * Subscription Invoice Usecase Tests
 * File: subscription-invoice.usecase.test.js
 */
import {
  listSubscriptionInvoices,
  getSubscriptionInvoice,
  createSubscriptionInvoice,
  updateSubscriptionInvoice,
  deleteSubscriptionInvoice,
  collectSubscriptionInvoice,
  retrySubscriptionInvoice,
} from '@features/subscription-invoice';
import { endpoints } from '@config/endpoints';
import { subscriptionInvoiceApi } from '@features/subscription-invoice/subscription-invoice.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/subscription-invoice/subscription-invoice.api', () => ({
  subscriptionInvoiceApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    collect: jest.fn(),
    retry: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('subscription-invoice.usecase', () => {
  beforeEach(() => {
    subscriptionInvoiceApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    subscriptionInvoiceApi.get.mockResolvedValue({ data: { id: '1' } });
    subscriptionInvoiceApi.create.mockResolvedValue({ data: { id: '1' } });
    subscriptionInvoiceApi.update.mockResolvedValue({ data: { id: '1' } });
    subscriptionInvoiceApi.remove.mockResolvedValue({ data: { id: '1' } });
    subscriptionInvoiceApi.collect.mockResolvedValue({ data: { id: '1', status: 'PAID' } });
    subscriptionInvoiceApi.retry.mockResolvedValue({ data: { id: '1', status: 'PENDING' } });
  });

  runCrudUsecaseTests(
    {
      list: listSubscriptionInvoices,
      get: getSubscriptionInvoice,
      create: createSubscriptionInvoice,
      update: updateSubscriptionInvoice,
      remove: deleteSubscriptionInvoice,
    },
    { queueRequestIfOffline }
  );

  it('collects and retries subscription invoices online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(
      collectSubscriptionInvoice('1', { payment_method: 'CASH' })
    ).resolves.toEqual({
      id: '1',
      status: 'PAID',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTION_INVOICES.COLLECT('1'),
      method: 'POST',
      body: { payment_method: 'CASH' },
    });
    expect(subscriptionInvoiceApi.collect).toHaveBeenCalledWith('1', {
      payment_method: 'CASH',
    });

    await expect(
      retrySubscriptionInvoice('1', { retry_reason: 'network' })
    ).resolves.toEqual({
      id: '1',
      status: 'PENDING',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTION_INVOICES.RETRY('1'),
      method: 'POST',
      body: { retry_reason: 'network' },
    });
    expect(subscriptionInvoiceApi.retry).toHaveBeenCalledWith('1', {
      retry_reason: 'network',
    });
  });

  it('queues collect and retry writes when offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);
    subscriptionInvoiceApi.collect.mockClear();
    subscriptionInvoiceApi.retry.mockClear();

    await expect(
      collectSubscriptionInvoice('1', { payment_method: 'CASH' })
    ).resolves.toEqual({
      id: '1',
      payment_method: 'CASH',
    });
    await expect(
      retrySubscriptionInvoice('1', { retry_reason: 'network' })
    ).resolves.toEqual({
      id: '1',
      retry_reason: 'network',
    });

    expect(subscriptionInvoiceApi.collect).not.toHaveBeenCalled();
    expect(subscriptionInvoiceApi.retry).not.toHaveBeenCalled();
  });
});
