/**
 * Admission Usecase Tests
 * File: admission.usecase.test.js
 */
import { endpoints } from '@config/endpoints';
import {
  dischargeAdmission,
  transferAdmission,
  listAdmissions,
  getAdmission,
  createAdmission,
  updateAdmission,
  deleteAdmission,
} from '@features/admission';
import { admissionApi } from '@features/admission/admission.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/admission/admission.api', () => ({
  admissionApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    discharge: jest.fn(),
    transfer: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('admission.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    admissionApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    admissionApi.get.mockResolvedValue({ data: { id: '1' } });
    admissionApi.create.mockResolvedValue({ data: { id: '1' } });
    admissionApi.update.mockResolvedValue({ data: { id: '1' } });
    admissionApi.remove.mockResolvedValue({ data: { id: '1' } });
    admissionApi.discharge.mockResolvedValue({ data: { id: '1', status: 'DISCHARGED' } });
    admissionApi.transfer.mockResolvedValue({ data: { id: '1', status: 'TRANSFERRED' } });
  });

  runCrudUsecaseTests(
    {
      list: listAdmissions,
      get: getAdmission,
      create: createAdmission,
      update: updateAdmission,
      remove: deleteAdmission,
    },
    { queueRequestIfOffline }
  );

  it('discharges admission online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(
      dischargeAdmission('1', { discharged_at: '2026-02-15T12:00:00.000Z' })
    ).resolves.toMatchObject({
      id: '1',
      status: 'DISCHARGED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.ADMISSIONS.DISCHARGE('1'),
      method: 'POST',
      body: { discharged_at: '2026-02-15T12:00:00.000Z' },
    });
    expect(admissionApi.discharge).toHaveBeenCalledWith('1', {
      discharged_at: '2026-02-15T12:00:00.000Z',
    });
  });

  it('discharges admission online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(dischargeAdmission('1')).resolves.toMatchObject({
      id: '1',
      status: 'DISCHARGED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.ADMISSIONS.DISCHARGE('1'),
      method: 'POST',
      body: {},
    });
    expect(admissionApi.discharge).toHaveBeenCalledWith('1', {});
  });

  it('queues admission discharge offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(
      dischargeAdmission('1', { discharged_at: '2026-02-15T12:00:00.000Z' })
    ).resolves.toMatchObject({
      id: '1',
      status: 'DISCHARGED',
      discharged_at: '2026-02-15T12:00:00.000Z',
    });
    expect(admissionApi.discharge).not.toHaveBeenCalled();
  });

  it('rejects invalid id for discharge', async () => {
    await expect(dischargeAdmission(null, { discharged_at: '2026-02-15T12:00:00.000Z' })).rejects.toBeDefined();
  });

  it('transfers admission online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(
      transferAdmission('1', { facility_id: 'facility-2', notes: 'Transfer to ICU' })
    ).resolves.toMatchObject({
      id: '1',
      status: 'TRANSFERRED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.ADMISSIONS.TRANSFER('1'),
      method: 'POST',
      body: { facility_id: 'facility-2', notes: 'Transfer to ICU' },
    });
    expect(admissionApi.transfer).toHaveBeenCalledWith('1', {
      facility_id: 'facility-2',
      notes: 'Transfer to ICU',
    });
  });

  it('transfers admission online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(transferAdmission('1')).resolves.toMatchObject({
      id: '1',
      status: 'TRANSFERRED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.ADMISSIONS.TRANSFER('1'),
      method: 'POST',
      body: {},
    });
    expect(admissionApi.transfer).toHaveBeenCalledWith('1', {});
  });

  it('queues admission transfer offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(
      transferAdmission('1', { facility_id: 'facility-2', notes: 'Transfer to ICU' })
    ).resolves.toMatchObject({
      id: '1',
      status: 'TRANSFERRED',
      facility_id: 'facility-2',
      notes: 'Transfer to ICU',
    });
    expect(admissionApi.transfer).not.toHaveBeenCalled();
  });

  it('rejects invalid id for transfer', async () => {
    await expect(
      transferAdmission(null, { facility_id: 'facility-2', notes: 'Transfer to ICU' })
    ).rejects.toBeDefined();
  });
});
