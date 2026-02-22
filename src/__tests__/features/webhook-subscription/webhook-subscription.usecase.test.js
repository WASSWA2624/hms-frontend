/**
 * Webhook Subscription Usecase Tests
 * File: webhook-subscription.usecase.test.js
 */
import {
  listWebhookSubscriptions,
  getWebhookSubscription,
  createWebhookSubscription,
  updateWebhookSubscription,
  deleteWebhookSubscription,
  replayWebhookSubscription,
} from '@features/webhook-subscription';
import { endpoints } from '@config/endpoints';
import { webhookSubscriptionApi } from '@features/webhook-subscription/webhook-subscription.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/webhook-subscription/webhook-subscription.api', () => ({
  webhookSubscriptionApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    replay: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('webhook-subscription.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    webhookSubscriptionApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    webhookSubscriptionApi.get.mockResolvedValue({ data: { id: '1' } });
    webhookSubscriptionApi.create.mockResolvedValue({ data: { id: '1' } });
    webhookSubscriptionApi.update.mockResolvedValue({ data: { id: '1' } });
    webhookSubscriptionApi.remove.mockResolvedValue({ data: { id: '1' } });
    webhookSubscriptionApi.replay.mockResolvedValue({ data: { id: '1', status: 'queued' } });
  });

  runCrudUsecaseTests(
    {
      list: listWebhookSubscriptions,
      get: getWebhookSubscription,
      create: createWebhookSubscription,
      update: updateWebhookSubscription,
      remove: deleteWebhookSubscription,
    },
    { queueRequestIfOffline }
  );

  it('replays webhook subscription online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(
      replayWebhookSubscription('1', { delivery_id: 'd-1' })
    ).resolves.toEqual({
      id: '1',
      status: 'queued',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.WEBHOOK_SUBSCRIPTIONS.REPLAY('1'),
      method: 'POST',
      body: { delivery_id: 'd-1' },
    });
    expect(webhookSubscriptionApi.replay).toHaveBeenCalledWith('1', {
      delivery_id: 'd-1',
    });
  });

  it('replays webhook subscription online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(replayWebhookSubscription('1')).resolves.toEqual({
      id: '1',
      status: 'queued',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.WEBHOOK_SUBSCRIPTIONS.REPLAY('1'),
      method: 'POST',
      body: {},
    });
    expect(webhookSubscriptionApi.replay).toHaveBeenCalledWith('1', {});
  });

  it('queues webhook subscription replay when offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(
      replayWebhookSubscription('1', { delivery_id: 'd-1' })
    ).resolves.toEqual({
      id: '1',
      delivery_id: 'd-1',
    });
    expect(webhookSubscriptionApi.replay).not.toHaveBeenCalled();
  });

  it('rejects invalid id for replay action', async () => {
    await expect(replayWebhookSubscription(null)).rejects.toBeDefined();
  });
});
