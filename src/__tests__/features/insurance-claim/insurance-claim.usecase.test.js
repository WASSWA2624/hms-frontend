/**
 * Insurance Claim Usecase Tests
 * File: insurance-claim.usecase.test.js
 */
import {
  listInsuranceClaims,
  getInsuranceClaim,
  createInsuranceClaim,
  updateInsuranceClaim,
  deleteInsuranceClaim,
  submitInsuranceClaim,
  reconcileInsuranceClaim,
} from '@features/insurance-claim';
import { endpoints } from '@config/endpoints';
import { insuranceClaimApi } from '@features/insurance-claim/insurance-claim.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/insurance-claim/insurance-claim.api', () => ({
  insuranceClaimApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    submit: jest.fn(),
    reconcile: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('insurance-claim.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    insuranceClaimApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    insuranceClaimApi.get.mockResolvedValue({ data: { id: '1' } });
    insuranceClaimApi.create.mockResolvedValue({ data: { id: '1' } });
    insuranceClaimApi.update.mockResolvedValue({ data: { id: '1' } });
    insuranceClaimApi.remove.mockResolvedValue({ data: { id: '1' } });
    insuranceClaimApi.submit.mockResolvedValue({ data: { id: '1', status: 'SUBMITTED' } });
    insuranceClaimApi.reconcile.mockResolvedValue({ data: { id: '1', status: 'APPROVED' } });
  });

  runCrudUsecaseTests(
    {
      list: listInsuranceClaims,
      get: getInsuranceClaim,
      create: createInsuranceClaim,
      update: updateInsuranceClaim,
      remove: deleteInsuranceClaim,
    },
    { queueRequestIfOffline }
  );

  it('submits insurance claim online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(submitInsuranceClaim('1', { notes: 'Submitting to payer' })).resolves.toMatchObject({
      id: '1',
      status: 'SUBMITTED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.INSURANCE_CLAIMS.SUBMIT('1'),
      method: 'POST',
      body: { notes: 'Submitting to payer' },
    });
    expect(insuranceClaimApi.submit).toHaveBeenCalledWith('1', { notes: 'Submitting to payer' });
  });

  it('submits insurance claim online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(submitInsuranceClaim('1')).resolves.toMatchObject({
      id: '1',
      status: 'SUBMITTED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.INSURANCE_CLAIMS.SUBMIT('1'),
      method: 'POST',
      body: {},
    });
    expect(insuranceClaimApi.submit).toHaveBeenCalledWith('1', {});
  });

  it('queues insurance claim submit offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(submitInsuranceClaim('1', { notes: 'Submitting to payer' })).resolves.toMatchObject({
      id: '1',
      notes: 'Submitting to payer',
    });
    expect(insuranceClaimApi.submit).not.toHaveBeenCalled();
  });

  it('rejects invalid id for submit', async () => {
    await expect(submitInsuranceClaim(null, { notes: 'Submitting to payer' })).rejects.toBeDefined();
  });

  it('reconciles insurance claim online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(reconcileInsuranceClaim('1', { status: 'APPROVED' })).resolves.toMatchObject({
      id: '1',
      status: 'APPROVED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.INSURANCE_CLAIMS.RECONCILE('1'),
      method: 'POST',
      body: { status: 'APPROVED' },
    });
    expect(insuranceClaimApi.reconcile).toHaveBeenCalledWith('1', { status: 'APPROVED' });
  });

  it('reconciles insurance claim online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(reconcileInsuranceClaim('1')).resolves.toMatchObject({
      id: '1',
      status: 'APPROVED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.INSURANCE_CLAIMS.RECONCILE('1'),
      method: 'POST',
      body: {},
    });
    expect(insuranceClaimApi.reconcile).toHaveBeenCalledWith('1', {});
  });

  it('queues insurance claim reconcile offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(reconcileInsuranceClaim('1', { status: 'APPROVED' })).resolves.toMatchObject({
      id: '1',
      status: 'APPROVED',
    });
    expect(insuranceClaimApi.reconcile).not.toHaveBeenCalled();
  });

  it('rejects invalid id for reconcile', async () => {
    await expect(reconcileInsuranceClaim(null, { status: 'APPROVED' })).rejects.toBeDefined();
  });
});
