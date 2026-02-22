/**
 * Lab Result Usecase Tests
 * File: lab-result.usecase.test.js
 */
import { endpoints } from '@config/endpoints';
import {
  listLabResults,
  getLabResult,
  createLabResult,
  updateLabResult,
  deleteLabResult,
  releaseLabResult,
} from '@features/lab-result';
import { labResultApi } from '@features/lab-result/lab-result.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/lab-result/lab-result.api', () => ({
  labResultApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    release: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('lab-result.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    labResultApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    labResultApi.get.mockResolvedValue({ data: { id: '1' } });
    labResultApi.create.mockResolvedValue({ data: { id: '1' } });
    labResultApi.update.mockResolvedValue({ data: { id: '1' } });
    labResultApi.remove.mockResolvedValue({ data: { id: '1' } });
    labResultApi.release.mockResolvedValue({ data: { id: '1', status: 'RELEASED' } });
  });

  runCrudUsecaseTests(
    {
      list: listLabResults,
      get: getLabResult,
      create: createLabResult,
      update: updateLabResult,
      remove: deleteLabResult,
    },
    { queueRequestIfOffline }
  );

  it('releases lab result online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(releaseLabResult('1', { notes: 'Validated by pathologist' })).resolves.toMatchObject({
      id: '1',
      status: 'RELEASED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.LAB_RESULTS.RELEASE('1'),
      method: 'POST',
      body: { notes: 'Validated by pathologist' },
    });
    expect(labResultApi.release).toHaveBeenCalledWith('1', { notes: 'Validated by pathologist' });
  });

  it('releases lab result online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(releaseLabResult('1')).resolves.toMatchObject({
      id: '1',
      status: 'RELEASED',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.LAB_RESULTS.RELEASE('1'),
      method: 'POST',
      body: {},
    });
    expect(labResultApi.release).toHaveBeenCalledWith('1', {});
  });

  it('queues lab result release offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(releaseLabResult('1', { notes: 'Validated by pathologist' })).resolves.toMatchObject({
      id: '1',
      status: 'RELEASED',
      notes: 'Validated by pathologist',
    });
    expect(labResultApi.release).not.toHaveBeenCalled();
  });

  it('rejects invalid id for release', async () => {
    await expect(releaseLabResult(null, { notes: 'Validated by pathologist' })).rejects.toBeDefined();
  });
});
