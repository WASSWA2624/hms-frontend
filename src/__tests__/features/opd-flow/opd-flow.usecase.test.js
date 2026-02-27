/**
 * OPD Flow Usecase Tests
 * File: opd-flow.usecase.test.js
 */
import {
  assignDoctor,
  disposition,
  doctorReview,
  getOpdFlow,
  listOpdFlows,
  payConsultation,
  recordVitals,
  resolveOpdLegacyRoute,
  startOpdFlow,
} from '@features/opd-flow';
import { opdFlowApi } from '@features/opd-flow/opd-flow.api';

jest.mock('@features/opd-flow/opd-flow.api', () => ({
  opdFlowApi: {
    list: jest.fn(),
    get: jest.fn(),
    resolveLegacyRoute: jest.fn(),
    start: jest.fn(),
    payConsultation: jest.fn(),
    recordVitals: jest.fn(),
    assignDoctor: jest.fn(),
    doctorReview: jest.fn(),
    disposition: jest.fn(),
  },
}));

const buildSnapshotPayload = (id = 'enc-1', stage = 'WAITING_VITALS') => ({
  encounter: { id, patient_id: 'patient-1' },
  flow: { stage, next_step: 'NEXT_STEP', timeline: [] },
});

describe('opd-flow.usecase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    opdFlowApi.list.mockResolvedValue({
      data: {
        items: [buildSnapshotPayload('enc-1')],
        pagination: { page: 1, limit: 20, total: 1 },
      },
    });
    opdFlowApi.get.mockResolvedValue({ data: buildSnapshotPayload('enc-1') });
    opdFlowApi.resolveLegacyRoute.mockResolvedValue({
      data: {
        encounter_id: 'ENC-001',
        emergency_case_id: 'EMC-001',
        resource: 'emergency-cases',
        panel: 'queue',
        action: 'open_case',
      },
    });
    opdFlowApi.start.mockResolvedValue({ data: buildSnapshotPayload('enc-2') });
    opdFlowApi.payConsultation.mockResolvedValue({
      data: buildSnapshotPayload('enc-1', 'WAITING_VITALS'),
    });
    opdFlowApi.recordVitals.mockResolvedValue({
      data: buildSnapshotPayload('enc-1', 'WAITING_DOCTOR_ASSIGNMENT'),
    });
    opdFlowApi.assignDoctor.mockResolvedValue({
      data: buildSnapshotPayload('enc-1', 'WAITING_DOCTOR_REVIEW'),
    });
    opdFlowApi.doctorReview.mockResolvedValue({
      data: buildSnapshotPayload('enc-1', 'WAITING_DISPOSITION'),
    });
    opdFlowApi.disposition.mockResolvedValue({
      data: buildSnapshotPayload('enc-1', 'DISCHARGED'),
    });
  });

  it('lists OPD flows', async () => {
    const result = await listOpdFlows({ page: 1, limit: 20 });
    expect(opdFlowApi.list).toHaveBeenCalledWith({ page: 1, limit: 20 });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe('enc-1');
  });

  it('gets OPD flow snapshot by id', async () => {
    const result = await getOpdFlow('enc-1');
    expect(opdFlowApi.get).toHaveBeenCalledWith('enc-1');
    expect(result.encounter.id).toBe('enc-1');
  });

  it('starts OPD flow', async () => {
    const payload = { arrival_mode: 'WALK_IN', patient_id: 'patient-1' };
    const result = await startOpdFlow(payload);
    expect(opdFlowApi.start).toHaveBeenCalledWith(payload);
    expect(result.encounter.id).toBe('enc-2');
  });

  it('resolves legacy emergency route context', async () => {
    const result = await resolveOpdLegacyRoute('emergency-cases', 'EMC-001');
    expect(opdFlowApi.resolveLegacyRoute).toHaveBeenCalledWith(
      'emergency-cases',
      'EMC-001'
    );
    expect(result).toMatchObject({
      encounter_id: 'ENC-001',
      emergency_case_id: 'EMC-001',
      panel: 'queue',
    });
  });

  it('records consultation payment', async () => {
    const result = await payConsultation('enc-1', { method: 'CASH' });
    expect(opdFlowApi.payConsultation).toHaveBeenCalledWith('enc-1', { method: 'CASH' });
    expect(result.flow.stage).toBe('WAITING_VITALS');
  });

  it('records vitals', async () => {
    const payload = { vitals: [{ vital_type: 'TEMPERATURE', value: '36.6' }] };
    const result = await recordVitals('enc-1', payload);
    expect(opdFlowApi.recordVitals).toHaveBeenCalledWith('enc-1', payload);
    expect(result.flow.stage).toBe('WAITING_DOCTOR_ASSIGNMENT');
  });

  it('assigns doctor', async () => {
    const result = await assignDoctor('enc-1', { provider_user_id: 'doctor-1' });
    expect(opdFlowApi.assignDoctor).toHaveBeenCalledWith('enc-1', { provider_user_id: 'doctor-1' });
    expect(result.flow.stage).toBe('WAITING_DOCTOR_REVIEW');
  });

  it('submits doctor review', async () => {
    const payload = {
      note: 'Reviewed',
      lab_requests: [{ lab_test_id: 'lab-test-1' }],
      radiology_requests: [{ radiology_test_id: 'rad-test-1' }],
      medications: [{ drug_id: 'drug-1', quantity: 2 }],
    };
    const result = await doctorReview('enc-1', payload);
    expect(opdFlowApi.doctorReview).toHaveBeenCalledWith('enc-1', payload);
    expect(result.flow.stage).toBe('WAITING_DISPOSITION');
  });

  it('submits disposition', async () => {
    const result = await disposition('enc-1', { decision: 'DISCHARGE' });
    expect(opdFlowApi.disposition).toHaveBeenCalledWith('enc-1', { decision: 'DISCHARGE' });
    expect(result.flow.stage).toBe('DISCHARGED');
  });

  it('rejects invalid ids', async () => {
    await expect(getOpdFlow(null)).rejects.toBeDefined();
    await expect(payConsultation(null, { method: 'CASH' })).rejects.toBeDefined();
  });
});
