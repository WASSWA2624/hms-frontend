/**
 * Subscription Usecase Tests
 * File: subscription.usecase.test.js
 */
import {
  listSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  downgradeSubscription,
  getSubscriptionFitCheck,
  getSubscriptionProrationPreview,
  getSubscriptionUpgradeRecommendation,
  getSubscriptionUsageSummary,
  renewSubscription,
  upgradeSubscription,
} from '@features/subscription';
import { endpoints } from '@config/endpoints';
import { subscriptionApi } from '@features/subscription/subscription.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/subscription/subscription.api', () => ({
  subscriptionApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    upgrade: jest.fn(),
    downgrade: jest.fn(),
    renew: jest.fn(),
    getProrationPreview: jest.fn(),
    getUsageSummary: jest.fn(),
    getFitCheck: jest.fn(),
    getUpgradeRecommendation: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('subscription.usecase', () => {
  beforeEach(() => {
    subscriptionApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    subscriptionApi.get.mockResolvedValue({ data: { id: '1' } });
    subscriptionApi.create.mockResolvedValue({ data: { id: '1' } });
    subscriptionApi.update.mockResolvedValue({ data: { id: '1' } });
    subscriptionApi.remove.mockResolvedValue({ data: { id: '1' } });
    subscriptionApi.upgrade.mockResolvedValue({ data: { id: '1', plan_id: 'plan-2' } });
    subscriptionApi.downgrade.mockResolvedValue({ data: { id: '1', plan_id: 'plan-1' } });
    subscriptionApi.renew.mockResolvedValue({ data: { id: '1', status: 'ACTIVE' } });
    subscriptionApi.getProrationPreview.mockResolvedValue({ data: { id: '1', amount: 10 } });
    subscriptionApi.getUsageSummary.mockResolvedValue({ data: { id: '1', usage: 20 } });
    subscriptionApi.getFitCheck.mockResolvedValue({ data: { id: '1', fit: 'good' } });
    subscriptionApi.getUpgradeRecommendation.mockResolvedValue({
      data: { id: '1', recommended_plan: 'plan-2' },
    });
  });

  runCrudUsecaseTests(
    {
      list: listSubscriptions,
      get: getSubscription,
      create: createSubscription,
      update: updateSubscription,
      remove: deleteSubscription,
      extraActions: [
        { fn: getSubscriptionProrationPreview, args: ['1', { target_plan_id: 'plan-2' }] },
        { fn: getSubscriptionUsageSummary, args: ['1'] },
        { fn: getSubscriptionFitCheck, args: ['1'] },
        { fn: getSubscriptionUpgradeRecommendation, args: ['1'] },
      ],
    },
    { queueRequestIfOffline }
  );

  it('upgrades, downgrades, and renews subscriptions online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(upgradeSubscription('1', { target_plan_id: 'plan-2' })).resolves.toEqual({
      id: '1',
      plan_id: 'plan-2',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTIONS.UPGRADE('1'),
      method: 'POST',
      body: { target_plan_id: 'plan-2' },
    });
    expect(subscriptionApi.upgrade).toHaveBeenCalledWith('1', {
      target_plan_id: 'plan-2',
    });

    await expect(downgradeSubscription('1', { target_plan_id: 'plan-1' })).resolves.toEqual({
      id: '1',
      plan_id: 'plan-1',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTIONS.DOWNGRADE('1'),
      method: 'POST',
      body: { target_plan_id: 'plan-1' },
    });
    expect(subscriptionApi.downgrade).toHaveBeenCalledWith('1', {
      target_plan_id: 'plan-1',
    });

    await expect(renewSubscription('1', { reason: 'renewal' })).resolves.toEqual({
      id: '1',
      status: 'ACTIVE',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.SUBSCRIPTIONS.RENEW('1'),
      method: 'POST',
      body: { reason: 'renewal' },
    });
    expect(subscriptionApi.renew).toHaveBeenCalledWith('1', { reason: 'renewal' });
  });

  it('queues upgrade, downgrade, and renew writes when offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);
    subscriptionApi.upgrade.mockClear();
    subscriptionApi.downgrade.mockClear();
    subscriptionApi.renew.mockClear();

    await expect(upgradeSubscription('1', { target_plan_id: 'plan-2' })).resolves.toEqual({
      id: '1',
      target_plan_id: 'plan-2',
    });
    await expect(downgradeSubscription('1', { target_plan_id: 'plan-1' })).resolves.toEqual({
      id: '1',
      target_plan_id: 'plan-1',
    });
    await expect(renewSubscription('1', { reason: 'renewal' })).resolves.toEqual({
      id: '1',
      reason: 'renewal',
    });

    expect(subscriptionApi.upgrade).not.toHaveBeenCalled();
    expect(subscriptionApi.downgrade).not.toHaveBeenCalled();
    expect(subscriptionApi.renew).not.toHaveBeenCalled();
  });
});
