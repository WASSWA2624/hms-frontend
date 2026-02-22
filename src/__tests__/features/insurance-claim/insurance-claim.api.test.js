/**
 * Insurance Claim API Tests
 * File: insurance-claim.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, createCrudApi } from '@services/api';
import { insuranceClaimApi } from '@features/insurance-claim/insurance-claim.api';

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

describe('insurance-claim.api', () => {
  it('creates crud api with insurance claim endpoints', () => {
    expect(createCrudApi).toHaveBeenCalledWith(endpoints.INSURANCE_CLAIMS);
    expect(insuranceClaimApi).toBeDefined();
  });

  it('posts insurance claim submit action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'SUBMITTED' } });

    await insuranceClaimApi.submit('1', { notes: 'Submitting to payer' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.INSURANCE_CLAIMS.SUBMIT('1'),
      method: 'POST',
      body: { notes: 'Submitting to payer' },
    });
  });

  it('posts insurance claim submit action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'SUBMITTED' } });

    await insuranceClaimApi.submit('1');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.INSURANCE_CLAIMS.SUBMIT('1'),
      method: 'POST',
      body: {},
    });
  });

  it('posts insurance claim reconcile action', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'APPROVED' } });

    await insuranceClaimApi.reconcile('1', { status: 'APPROVED' });

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.INSURANCE_CLAIMS.RECONCILE('1'),
      method: 'POST',
      body: { status: 'APPROVED' },
    });
  });

  it('posts insurance claim reconcile action with default payload', async () => {
    apiClient.mockResolvedValue({ data: { id: '1', status: 'APPROVED' } });

    await insuranceClaimApi.reconcile('1');

    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.INSURANCE_CLAIMS.RECONCILE('1'),
      method: 'POST',
      body: {},
    });
  });
});
