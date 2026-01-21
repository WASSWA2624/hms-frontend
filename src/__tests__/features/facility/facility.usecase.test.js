/**
 * Facility Usecase Tests
 * File: facility.usecase.test.js
 */
import {
  listFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  listFacilityBranches,
} from '@features/facility';
import { facilityApi, getFacilityBranchesApi } from '@features/facility/facility.api';
import { queueRequestIfOffline } from '@offline/request';
import { runCrudUsecaseTests } from '../../helpers/crud-usecase-runner';

jest.mock('@features/facility/facility.api', () => ({
  facilityApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
  getFacilityBranchesApi: jest.fn(),
}));

jest.mock('@offline/request', () => ({
  queueRequestIfOffline: jest.fn(),
}));

describe('facility.usecase', () => {
  beforeEach(() => {
    facilityApi.list.mockResolvedValue({ data: [{ id: '1' }] });
    facilityApi.get.mockResolvedValue({ data: { id: '1' } });
    facilityApi.create.mockResolvedValue({ data: { id: '1' } });
    facilityApi.update.mockResolvedValue({ data: { id: '1' } });
    facilityApi.remove.mockResolvedValue({ data: { id: '1' } });
    getFacilityBranchesApi.mockResolvedValue({ data: [{ id: '1' }] });
  });

  runCrudUsecaseTests(
    {
      list: listFacilities,
      get: getFacility,
      create: createFacility,
      update: updateFacility,
      remove: deleteFacility,
      extraActions: [{ fn: listFacilityBranches, args: ['1'] }],
    },
    { queueRequestIfOffline }
  );
});
