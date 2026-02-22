/**
 * Referral Usecase Tests
 * File: referral.usecase.test.js
 */
import { endpoints } from '@config/endpoints';
import {
  listReferrals,
  getReferral,
  createReferral,
  updateReferral,
  deleteReferral,
  redeemReferral,
} from '@features/referral';
import { referralApi } from '@features/referral/referral.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/referral/referral.api', () => ({
  referralApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    redeem: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('referral.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    referralApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    referralApi.get.mockResolvedValue({ data: { id: '1' } });
    referralApi.create.mockResolvedValue({ data: { id: '1' } });
    referralApi.update.mockResolvedValue({ data: { id: '1' } });
    referralApi.remove.mockResolvedValue({ data: { id: '1' } });
    referralApi.redeem.mockResolvedValue({ data: { id: '1', status: 'COMPLETED' } });
  });

  runCrudUsecaseTests(
    {
      list: listReferrals,
      get: getReferral,
      create: createReferral,
      update: updateReferral,
      remove: deleteReferral,
    },
    { queueRequestIfOffline }
  );

  it('redeems referral online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(redeemReferral('1', { notes: 'Redeemed at destination' })).resolves.toMatchObject({
      id: '1',
      status: 'COMPLETED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.REFERRALS.REDEEM('1'),
      method: 'POST',
      body: { notes: 'Redeemed at destination' },
    });
    expect(referralApi.redeem).toHaveBeenCalledWith('1', { notes: 'Redeemed at destination' });
  });

  it('redeems referral online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(redeemReferral('1')).resolves.toMatchObject({
      id: '1',
      status: 'COMPLETED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.REFERRALS.REDEEM('1'),
      method: 'POST',
      body: {},
    });
    expect(referralApi.redeem).toHaveBeenCalledWith('1', {});
  });

  it('queues referral redeem offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(redeemReferral('1', { notes: 'Redeemed at destination' })).resolves.toMatchObject({
      id: '1',
      notes: 'Redeemed at destination',
    });
    expect(referralApi.redeem).not.toHaveBeenCalled();
  });

  it('rejects invalid id for redeem', async () => {
    await expect(redeemReferral(null, { notes: 'Redeemed at destination' })).rejects.toBeDefined();
  });
});
