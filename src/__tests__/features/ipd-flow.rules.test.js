import {
  parseAddCriticalAlertPayload,
  parseAddIcuObservationPayload,
  parseEndIcuStayPayload,
  parseGetIpdFlowParams,
  parseIpdFlowListParams,
  parseResolveLegacyRouteParams,
  parseResolveCriticalAlertPayload,
  parseStartIcuStayPayload,
} from '@features/ipd-flow';

describe('ipd-flow.rules', () => {
  it('parses ICU list filters on IPD flow queries', () => {
    const parsed = parseIpdFlowListParams({
      include_icu: 'true',
      queue_scope: 'ACTIVE',
      icu_queue_scope: 'WITH_ICU',
      icu_status: 'ACTIVE',
      critical_severity: 'HIGH',
      has_critical_alert: '1',
    });

    expect(parsed).toMatchObject({
      include_icu: true,
      queue_scope: 'ACTIVE',
      icu_queue_scope: 'WITH_ICU',
      icu_status: 'ACTIVE',
      critical_severity: 'HIGH',
      has_critical_alert: true,
    });
  });

  it('parses ICU include_icu query for get-by-id', () => {
    expect(parseGetIpdFlowParams({ include_icu: 'false' })).toEqual({ include_icu: false });
  });

  it('accepts ICU resources in legacy resolver params', () => {
    expect(
      parseResolveLegacyRouteParams({
        resource: 'critical-alerts',
        id: 'ALR-2002',
      })
    ).toEqual({
      resource: 'critical-alerts',
      id: 'ALR-2002',
    });
  });

  it('parses ICU action payloads', () => {
    expect(parseStartIcuStayPayload({ started_at: '2026-02-26T06:00:00.000Z' })).toEqual({
      started_at: '2026-02-26T06:00:00.000Z',
    });

    expect(
      parseEndIcuStayPayload({
        icu_stay_id: 'ICU-STAY-22',
        ended_at: '2026-02-26T08:00:00.000Z',
      })
    ).toEqual({
      icu_stay_id: 'ICU-STAY-22',
      ended_at: '2026-02-26T08:00:00.000Z',
    });

    expect(
      parseAddIcuObservationPayload({
        icu_stay_id: 'ICU-STAY-22',
        observed_at: '2026-02-26T07:00:00.000Z',
        observation: 'SpO2 improved',
      })
    ).toEqual({
      icu_stay_id: 'ICU-STAY-22',
      observed_at: '2026-02-26T07:00:00.000Z',
      observation: 'SpO2 improved',
    });

    expect(
      parseAddCriticalAlertPayload({
        icu_stay_id: 'ICU-STAY-22',
        severity: 'CRITICAL',
        message: 'Ventilator disconnected',
      })
    ).toEqual({
      icu_stay_id: 'ICU-STAY-22',
      severity: 'CRITICAL',
      message: 'Ventilator disconnected',
    });

    expect(parseResolveCriticalAlertPayload({ critical_alert_id: 'ALR-2002' })).toEqual({
      critical_alert_id: 'ALR-2002',
    });
  });
});
