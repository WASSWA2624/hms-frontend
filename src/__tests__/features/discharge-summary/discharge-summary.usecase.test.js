/**
 * Discharge Summary Usecase Tests
 * File: discharge-summary.usecase.test.js
 */
import { endpoints } from '@config/endpoints';
import {
  finalizeDischargeSummary,
  listDischargeSummaries,
  getDischargeSummary,
  createDischargeSummary,
  updateDischargeSummary,
  deleteDischargeSummary,
} from '@features/discharge-summary';
import { dischargeSummaryApi } from '@features/discharge-summary/discharge-summary.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/discharge-summary/discharge-summary.api', () => ({
  dischargeSummaryApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    finalize: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('discharge-summary.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dischargeSummaryApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    dischargeSummaryApi.get.mockResolvedValue({ data: { id: '1' } });
    dischargeSummaryApi.create.mockResolvedValue({ data: { id: '1' } });
    dischargeSummaryApi.update.mockResolvedValue({ data: { id: '1' } });
    dischargeSummaryApi.remove.mockResolvedValue({ data: { id: '1' } });
    dischargeSummaryApi.finalize.mockResolvedValue({ data: { id: '1', status: 'COMPLETED' } });
  });

  runCrudUsecaseTests(
    {
      list: listDischargeSummaries,
      get: getDischargeSummary,
      create: createDischargeSummary,
      update: updateDischargeSummary,
      remove: deleteDischargeSummary,
    },
    { queueRequestIfOffline }
  );

  it('finalizes discharge summary online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(
      finalizeDischargeSummary('1', {
        discharged_at: '2026-02-15T12:00:00.000Z',
        notes: 'Finalized',
      })
    ).resolves.toMatchObject({
      id: '1',
      status: 'COMPLETED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.DISCHARGE_SUMMARIES.FINALIZE('1'),
      method: 'POST',
      body: {
        discharged_at: '2026-02-15T12:00:00.000Z',
        notes: 'Finalized',
      },
    });
    expect(dischargeSummaryApi.finalize).toHaveBeenCalledWith('1', {
      discharged_at: '2026-02-15T12:00:00.000Z',
      notes: 'Finalized',
    });
  });

  it('finalizes discharge summary online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(finalizeDischargeSummary('1')).resolves.toMatchObject({
      id: '1',
      status: 'COMPLETED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.DISCHARGE_SUMMARIES.FINALIZE('1'),
      method: 'POST',
      body: {},
    });
    expect(dischargeSummaryApi.finalize).toHaveBeenCalledWith('1', {});
  });

  it('queues discharge summary finalize offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(
      finalizeDischargeSummary('1', {
        discharged_at: '2026-02-15T12:00:00.000Z',
        notes: 'Finalized',
      })
    ).resolves.toMatchObject({
      id: '1',
      status: 'COMPLETED',
      discharged_at: '2026-02-15T12:00:00.000Z',
      notes: 'Finalized',
    });
    expect(dischargeSummaryApi.finalize).not.toHaveBeenCalled();
  });

  it('rejects invalid id for finalize', async () => {
    await expect(
      finalizeDischargeSummary(null, {
        discharged_at: '2026-02-15T12:00:00.000Z',
        notes: 'Finalized',
      })
    ).rejects.toBeDefined();
  });
});
