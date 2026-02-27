/**
 * OPD Flow API Tests
 * File: opd-flow.api.test.js
 */
import { endpoints } from '@config/endpoints';
import { apiClient, buildQueryString } from '@services/api';
import { opdFlowApi } from '@features/opd-flow/opd-flow.api';

jest.mock('@services/api', () => ({
  apiClient: jest.fn(),
  buildQueryString: jest.fn(() => ''),
}));

describe('opd-flow.api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiClient.mockResolvedValue({ data: {} });
  });

  it('lists OPD flows', async () => {
    buildQueryString.mockReturnValue('?page=1');
    await opdFlowApi.list({ page: 1 });
    expect(buildQueryString).toHaveBeenCalledWith({ page: 1 });
    expect(apiClient).toHaveBeenCalledWith({
      url: `${endpoints.OPD_FLOWS.LIST}?page=1`,
      method: 'GET',
    });
  });

  it('gets OPD flow by id', async () => {
    await opdFlowApi.get('1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.OPD_FLOWS.GET('1'),
      method: 'GET',
    });
  });

  it('resolves legacy emergency routes', async () => {
    await opdFlowApi.resolveLegacyRoute('emergency-cases', 'EMC-1');
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.OPD_FLOWS.RESOLVE_LEGACY('emergency-cases', 'EMC-1'),
      method: 'GET',
    });
  });

  it('starts OPD flow', async () => {
    await opdFlowApi.start({ arrival_mode: 'WALK_IN' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.OPD_FLOWS.START,
      method: 'POST',
      body: { arrival_mode: 'WALK_IN' },
    });
  });

  it('posts pay consultation action', async () => {
    await opdFlowApi.payConsultation('1', { method: 'CASH' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.OPD_FLOWS.PAY_CONSULTATION('1'),
      method: 'POST',
      body: { method: 'CASH' },
    });
  });

  it('posts record vitals action', async () => {
    await opdFlowApi.recordVitals('1', { vitals: [{ vital_type: 'TEMPERATURE', value: '36.8' }] });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.OPD_FLOWS.RECORD_VITALS('1'),
      method: 'POST',
      body: { vitals: [{ vital_type: 'TEMPERATURE', value: '36.8' }] },
    });
  });

  it('posts assign doctor action', async () => {
    await opdFlowApi.assignDoctor('1', { provider_user_id: 'doctor-1' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.OPD_FLOWS.ASSIGN_DOCTOR('1'),
      method: 'POST',
      body: { provider_user_id: 'doctor-1' },
    });
  });

  it('posts doctor review action', async () => {
    await opdFlowApi.doctorReview('1', { note: 'Reviewed patient' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.OPD_FLOWS.DOCTOR_REVIEW('1'),
      method: 'POST',
      body: { note: 'Reviewed patient' },
    });
  });

  it('posts disposition action', async () => {
    await opdFlowApi.disposition('1', { decision: 'DISCHARGE' });
    expect(apiClient).toHaveBeenCalledWith({
      url: endpoints.OPD_FLOWS.DISPOSITION('1'),
      method: 'POST',
      body: { decision: 'DISCHARGE' },
    });
  });
});
