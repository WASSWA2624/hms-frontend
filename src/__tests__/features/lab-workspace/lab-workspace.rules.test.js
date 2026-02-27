/**
 * Lab Workspace Rules Tests
 * File: lab-workspace.rules.test.js
 */
import {
  parseCollectLabOrderPayload,
  parseLabWorkbenchRouteState,
  parseLabWorkspaceId,
  parseLabWorkspaceListParams,
  parseReceiveLabSamplePayload,
  parseRejectLabSamplePayload,
  parseReleaseLabOrderItemPayload,
  parseResolveLabLegacyRouteParams,
} from '@features/lab-workspace';

describe('lab-workspace.rules', () => {
  it('parses IDs and list params', () => {
    expect(parseLabWorkspaceId('LAB-001')).toBe('LAB-001');

    expect(
      parseLabWorkspaceListParams({
        page: '1',
        limit: '20',
        stage: 'COLLECTION',
        status: 'ORDERED',
        criticality: 'CRITICAL',
      })
    ).toEqual({
      page: 1,
      limit: 20,
      stage: 'COLLECTION',
      status: 'ORDERED',
      criticality: 'CRITICAL',
    });
  });

  it('parses legacy route resolver params', () => {
    expect(
      parseResolveLabLegacyRouteParams({
        resource: 'lab-orders',
        id: 'LAB-001',
      })
    ).toEqual({
      resource: 'lab-orders',
      id: 'LAB-001',
    });
  });

  it('parses workbench route state payload', () => {
    expect(
      parseLabWorkbenchRouteState({
        id: ['LAB-100'],
        panel: 'queue',
        action: 'collect',
        resource: 'lab-samples',
        legacyId: 'SMP-001',
        patientId: 'PAT-001',
        encounterId: 'ENC-001',
      })
    ).toEqual({
      id: 'LAB-100',
      panel: 'queue',
      action: 'collect',
      resource: 'lab-samples',
      legacyId: 'SMP-001',
      patientId: 'PAT-001',
      encounterId: 'ENC-001',
    });
  });

  it('parses collect/receive/reject/release payloads', () => {
    expect(
      parseCollectLabOrderPayload({
        sample_id: 'SMP-001',
        collected_at: '2026-02-27T10:00:00.000Z',
        notes: 'Collected in triage',
      })
    ).toEqual({
      sample_id: 'SMP-001',
      collected_at: '2026-02-27T10:00:00.000Z',
      notes: 'Collected in triage',
    });

    expect(
      parseReceiveLabSamplePayload({
        received_at: '2026-02-27T10:20:00.000Z',
        notes: 'Received in core lab',
      })
    ).toEqual({
      received_at: '2026-02-27T10:20:00.000Z',
      notes: 'Received in core lab',
    });

    expect(
      parseRejectLabSamplePayload({
        reason: 'Hemolysed specimen',
        notes: 'Request recollection',
      })
    ).toEqual({
      reason: 'Hemolysed specimen',
      notes: 'Request recollection',
    });

    expect(
      parseReleaseLabOrderItemPayload({
        result_id: 'RES-001',
        status: 'CRITICAL',
        result_value: '12.5',
        result_unit: 'g/dL',
        result_text: 'Requires urgent review',
        reported_at: '2026-02-27T11:00:00.000Z',
        notes: 'Escalated to clinician',
      })
    ).toEqual({
      result_id: 'RES-001',
      status: 'CRITICAL',
      result_value: '12.5',
      result_unit: 'g/dL',
      result_text: 'Requires urgent review',
      reported_at: '2026-02-27T11:00:00.000Z',
      notes: 'Escalated to clinician',
    });
  });

  it('rejects unsupported legacy resources', () => {
    expect(() =>
      parseResolveLabLegacyRouteParams({
        resource: 'unknown-resource',
        id: 'LAB-001',
      })
    ).toThrow();
  });
});
