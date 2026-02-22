/**
 * Maintenance Request Usecase Tests
 * File: maintenance-request.usecase.test.js
 */
import {
  listMaintenanceRequests,
  getMaintenanceRequest,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
  triageMaintenanceRequest,
} from '@features/maintenance-request';
import { endpoints } from '@config/endpoints';
import { maintenanceRequestApi } from '@features/maintenance-request/maintenance-request.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/maintenance-request/maintenance-request.api', () => ({
  maintenanceRequestApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    triage: jest.fn(),
  },
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('maintenance-request.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    maintenanceRequestApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    maintenanceRequestApi.get.mockResolvedValue({ data: { id: '1' } });
    maintenanceRequestApi.create.mockResolvedValue({ data: { id: '1' } });
    maintenanceRequestApi.update.mockResolvedValue({ data: { id: '1' } });
    maintenanceRequestApi.remove.mockResolvedValue({ data: { id: '1' } });
    maintenanceRequestApi.triage.mockResolvedValue({ data: { id: '1', status: 'IN_PROGRESS' } });
  });

  runCrudUsecaseTests(
    {
      list: listMaintenanceRequests,
      get: getMaintenanceRequest,
      create: createMaintenanceRequest,
      update: updateMaintenanceRequest,
      remove: deleteMaintenanceRequest,
    },
    { queueRequestIfOffline }
  );

  it('triages maintenance request online', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(
      triageMaintenanceRequest('1', { assigned_engineer: 'eng-1' })
    ).resolves.toMatchObject({
      id: '1',
      status: 'IN_PROGRESS',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.MAINTENANCE_REQUESTS.TRIAGE('1'),
      method: 'POST',
      body: { assigned_engineer: 'eng-1' },
    });
    expect(maintenanceRequestApi.triage).toHaveBeenCalledWith('1', {
      assigned_engineer: 'eng-1',
    });
  });

  it('triages maintenance request online with default payload', async () => {
    queueRequestIfOffline.mockResolvedValue(false);

    await expect(triageMaintenanceRequest('1')).resolves.toMatchObject({
      id: '1',
      status: 'IN_PROGRESS',
    });
    expect(queueRequestIfOffline).toHaveBeenCalledWith({
      url: endpoints.MAINTENANCE_REQUESTS.TRIAGE('1'),
      method: 'POST',
      body: {},
    });
    expect(maintenanceRequestApi.triage).toHaveBeenCalledWith('1', {});
  });

  it('queues maintenance request triage offline', async () => {
    queueRequestIfOffline.mockResolvedValue(true);

    await expect(
      triageMaintenanceRequest('1', { assigned_engineer: 'eng-1' })
    ).resolves.toMatchObject({
      id: '1',
      status: 'IN_PROGRESS',
      assigned_engineer: 'eng-1',
    });
    expect(maintenanceRequestApi.triage).not.toHaveBeenCalled();
  });

  it('rejects invalid id for triage', async () => {
    await expect(
      triageMaintenanceRequest(null, { assigned_engineer: 'eng-1' })
    ).rejects.toBeDefined();
  });
});
