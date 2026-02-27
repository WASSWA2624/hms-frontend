import {
  parseAddendumResultPayload,
  parseAssignRadiologyOrderPayload,
  parseCancelRadiologyOrderPayload,
  parseCommitUploadPayload,
  parseCreateRadiologyStudyPayload,
  parseDraftResultPayload,
  parseFinalizeResultPayload,
  parseInitUploadPayload,
  parseRadiologyWorkbenchRouteState,
  parseRadiologyWorkspaceId,
  parseRadiologyWorkspaceListParams,
  parseResolveRadiologyLegacyRouteParams,
  parseSyncStudyPayload,
} from '@features/radiology-workspace';

describe('radiology-workspace.rules', () => {
  it('parses identifiers and list filters', () => {
    expect(parseRadiologyWorkspaceId('RAD-001')).toBe('RAD-001');
    expect(
      parseRadiologyWorkspaceListParams({
        page: '1',
        limit: '20',
        stage: 'REPORTING',
        status: 'IN_PROCESS',
        modality: 'CT',
      })
    ).toEqual({
      page: 1,
      limit: 20,
      stage: 'REPORTING',
      status: 'IN_PROCESS',
      modality: 'CT',
    });
  });

  it('parses route state and legacy resolver params', () => {
    expect(
      parseRadiologyWorkbenchRouteState({
        id: ['RAD-100'],
        panel: 'studies',
        action: 'capture',
        resource: 'imaging-studies',
        legacyId: 'STDY-001',
      })
    ).toEqual({
      id: 'RAD-100',
      panel: 'studies',
      action: 'capture',
      resource: 'imaging-studies',
      legacyId: 'STDY-001',
    });

    expect(
      parseResolveRadiologyLegacyRouteParams({
        resource: 'radiology-orders',
        id: 'RAD-001',
      })
    ).toEqual({
      resource: 'radiology-orders',
      id: 'RAD-001',
    });
  });

  it('parses workspace action payloads', () => {
    expect(parseAssignRadiologyOrderPayload({ assignee_user_id: 'USR-1' })).toEqual({
      assignee_user_id: 'USR-1',
    });
    expect(
      parseCreateRadiologyStudyPayload({
        modality: 'MRI',
        performed_at: '2026-02-27T11:00:00.000Z',
      })
    ).toEqual({
      modality: 'MRI',
      performed_at: '2026-02-27T11:00:00.000Z',
    });
    expect(
      parseInitUploadPayload({ file_name: 'study.dcm', content_type: 'application/dicom' })
    ).toEqual({ file_name: 'study.dcm', content_type: 'application/dicom' });
    expect(parseCommitUploadPayload({ storage_key: 'rad/key' })).toEqual({
      storage_key: 'rad/key',
    });
    expect(parseSyncStudyPayload({ study_uid: '1.2.3' })).toEqual({
      study_uid: '1.2.3',
    });
    expect(parseDraftResultPayload({ findings: 'clear', impression: 'normal' })).toEqual({
      findings: 'clear',
      impression: 'normal',
    });
    expect(parseFinalizeResultPayload({ notes: 'final check' })).toEqual({
      notes: 'final check',
    });
    expect(parseAddendumResultPayload({ addendum_text: 'late note' })).toEqual({
      addendum_text: 'late note',
    });
    expect(parseCancelRadiologyOrderPayload({ reason: 'patient declined' })).toEqual({
      reason: 'patient declined',
    });
  });

  it('rejects unsupported legacy resource', () => {
    expect(() =>
      parseResolveRadiologyLegacyRouteParams({
        resource: 'unknown',
        id: 'RAD-001',
      })
    ).toThrow();
  });
});

