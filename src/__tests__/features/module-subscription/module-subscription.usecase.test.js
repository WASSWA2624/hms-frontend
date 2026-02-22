/**
 * Module Subscription Usecase Tests
 * File: module-subscription.usecase.test.js
 */
import {
  listModuleSubscriptions,
  getModuleSubscription,
  createModuleSubscription,
  updateModuleSubscription,
  deleteModuleSubscription,
  activateModuleSubscription,
  deactivateModuleSubscription,
  checkModuleSubscriptionEligibility,
} from '@features/module-subscription';
import { endpoints } from '@config/endpoints';
import { moduleSubscriptionApi } from '@features/module-subscription/module-subscription.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/module-subscription/module-subscription.api', () => ({
  moduleSubscriptionApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    activate: jest.fn(),
    deactivate: jest.fn(),
    checkEligibility: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('module-subscription.usecase', () => {
  beforeEach(() => {
    moduleSubscriptionApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    moduleSubscriptionApi.get.mockResolvedValue({ data: { id: '1' } });
    moduleSubscriptionApi.create.mockResolvedValue({ data: { id: '1' } });
    moduleSubscriptionApi.update.mockResolvedValue({ data: { id: '1' } });
    moduleSubscriptionApi.remove.mockResolvedValue({ data: { id: '1' } });
    moduleSubscriptionApi.activate.mockResolvedValue({ data: { id: '1', is_active: true } });
    moduleSubscriptionApi.deactivate.mockResolvedValue({ data: { id: '1', is_active: false } });
    moduleSubscriptionApi.checkEligibility.mockResolvedValue({
      data: { id: '1', eligible: true },
    });
  });

  runCrudUsecaseTests(
    {
      list: listModuleSubscriptions,
      get: getModuleSubscription,
      create: createModuleSubscription,
      update: updateModuleSubscription,
      remove: deleteModuleSubscription,
      extraActions: [{ fn: checkModuleSubscriptionEligibility, args: ['1'] }],
    },
    { queueRequestIfOffline }
  );

  it('activates and deactivates module subscriptions online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(
      activateModuleSubscription('1', { reason: 'enable module' })
    ).resolves.toEqual({
      id: '1',
      is_active: true,
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.MODULE_SUBSCRIPTIONS.ACTIVATE('1'),
      method: 'POST',
      body: { reason: 'enable module' },
    });
    expect(moduleSubscriptionApi.activate).toHaveBeenCalledWith('1', {
      reason: 'enable module',
    });

    await expect(
      deactivateModuleSubscription('1', { reason: 'disable module' })
    ).resolves.toEqual({
      id: '1',
      is_active: false,
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.MODULE_SUBSCRIPTIONS.DEACTIVATE('1'),
      method: 'POST',
      body: { reason: 'disable module' },
    });
    expect(moduleSubscriptionApi.deactivate).toHaveBeenCalledWith('1', {
      reason: 'disable module',
    });
  });

  it('queues activate and deactivate writes when offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);
    moduleSubscriptionApi.activate.mockClear();
    moduleSubscriptionApi.deactivate.mockClear();

    await expect(
      activateModuleSubscription('1', { reason: 'enable module' })
    ).resolves.toEqual({
      id: '1',
      is_active: true,
      reason: 'enable module',
    });
    await expect(
      deactivateModuleSubscription('1', { reason: 'disable module' })
    ).resolves.toEqual({
      id: '1',
      is_active: false,
      reason: 'disable module',
    });

    expect(moduleSubscriptionApi.activate).not.toHaveBeenCalled();
    expect(moduleSubscriptionApi.deactivate).not.toHaveBeenCalled();
  });
});
