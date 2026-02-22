/**
 * Radiology Result Usecase Tests
 * File: radiology-result.usecase.test.js
 */
import {
  listRadiologyResults,
  getRadiologyResult,
  createRadiologyResult,
  updateRadiologyResult,
  deleteRadiologyResult,
  signOffRadiologyResult,
} from '@features/radiology-result';
import { endpoints } from '@config/endpoints';
import { radiologyResultApi } from '@features/radiology-result/radiology-result.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/radiology-result/radiology-result.api', () => ({
  radiologyResultApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    signOff: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('radiology-result.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    radiologyResultApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    radiologyResultApi.get.mockResolvedValue({ data: { id: '1' } });
    radiologyResultApi.create.mockResolvedValue({ data: { id: '1' } });
    radiologyResultApi.update.mockResolvedValue({ data: { id: '1' } });
    radiologyResultApi.remove.mockResolvedValue({ data: { id: '1' } });
    radiologyResultApi.signOff.mockResolvedValue({ data: { id: '1', status: 'FINAL' } });
  });

  runCrudUsecaseTests(
    {
      list: listRadiologyResults,
      get: getRadiologyResult,
      create: createRadiologyResult,
      update: updateRadiologyResult,
      remove: deleteRadiologyResult,
    },
    { queueRequestIfOffline }
  );

  it('signs off radiology result online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(signOffRadiologyResult('1', { notes: 'Signed off by radiologist' })).resolves.toMatchObject({
      id: '1',
      status: 'FINAL',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_RESULTS.SIGN_OFF('1'),
      method: 'POST',
      body: { notes: 'Signed off by radiologist' },
    });
    expect(radiologyResultApi.signOff).toHaveBeenCalledWith('1', {
      notes: 'Signed off by radiologist',
    });
  });

  it('signs off radiology result online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(signOffRadiologyResult('1')).resolves.toMatchObject({
      id: '1',
      status: 'FINAL',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.RADIOLOGY_RESULTS.SIGN_OFF('1'),
      method: 'POST',
      body: {},
    });
    expect(radiologyResultApi.signOff).toHaveBeenCalledWith('1', {});
  });

  it('queues radiology result sign-off offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(signOffRadiologyResult('1', { notes: 'Signed off by radiologist' })).resolves.toMatchObject({
      id: '1',
      status: 'FINAL',
      notes: 'Signed off by radiologist',
    });
    expect(radiologyResultApi.signOff).not.toHaveBeenCalled();
  });

  it('rejects invalid id for sign-off', async () => {
    await expect(signOffRadiologyResult(null, { notes: 'Signed off by radiologist' })).rejects.toBeDefined();
  });
});
