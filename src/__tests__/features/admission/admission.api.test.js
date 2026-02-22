/**
 * Admission API Tests
 * File: admission.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { admissionApi } from '@features/admission/admission.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  createCrudApi: jest.fn(() => ({
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe('admission.api', () => {
  it('creates crud api with admission endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.ADMISSIONS);
    expect(admissionApi).toBeDefined();
  });

  it('posts admission discharge action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'DISCHARGED' } });

    await admissionApi.discharge('1', { discharged_at: '2026-02-15T12:00:00.000Z' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.ADMISSIONS.DISCHARGE('1'),
      method: 'POST',
      body: { discharged_at: '2026-02-15T12:00:00.000Z' },
    });
  });

  it('posts admission discharge action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'DISCHARGED' } });

    await admissionApi.discharge('1');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.ADMISSIONS.DISCHARGE('1'),
      method: 'POST',
      body: {},
    });
  });

  it('posts admission transfer action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'TRANSFERRED' } });

    await admissionApi.transfer('1', {
      facility_id: 'facility-2',
      notes: 'Transfer to ICU',
    });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.ADMISSIONS.TRANSFER('1'),
      method: 'POST',
      body: {
        facility_id: 'facility-2',
        notes: 'Transfer to ICU',
      },
    });
  });

  it('posts admission transfer action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'TRANSFERRED' } });

    await admissionApi.transfer('1');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.ADMISSIONS.TRANSFER('1'),
      method: 'POST',
      body: {},
    });
  });
});
