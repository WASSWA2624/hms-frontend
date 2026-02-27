const {
  shouldAutoMarkNotificationRead,
  resolveNotificationIcon,
  resolveNotificationRoute,
} = require('@navigation/notification-routing');

describe('notification-routing', () => {
  it('prefers target_path when present', () => {
    const route = resolveNotificationRoute(
      {
        target_path: '/scheduling/opd-flows/enc-1',
        route: '/dashboard',
      },
      () => true
    );

    expect(route).toBe('/scheduling/opd-flows/enc-1');
  });

  it('routes OPD context notifications to OPD workbench when no direct path exists', () => {
    const route = resolveNotificationRoute(
      {
        notification_type: 'SYSTEM',
        title: 'OPD flow updated',
        message: 'Patient waiting for doctor review',
      },
      () => true
    );

    expect(route).toBe('/clinical');
  });

  it('routes IPD context notifications to IPD workbench when no direct path exists', () => {
    const route = resolveNotificationRoute(
      {
        notification_type: 'SYSTEM',
        title: 'IPD transfer updated',
        message: 'Patient transfer request was approved',
      },
      () => true
    );

    expect(route).toBe('/ipd');
  });

  it('routes radiology context notifications to radiology workspace', () => {
    const route = resolveNotificationRoute(
      {
        notification_type: 'RADIOLOGY',
        title: 'PACS sync complete',
        message: 'Imaging study synchronized',
      },
      () => true
    );

    expect(route).toBe('/radiology');
  });

  it('uses OPD icon when notification route points to OPD flow workbench', () => {
    const icon = resolveNotificationIcon({
      notification_type: 'SYSTEM',
      target_path: '/scheduling/opd-flows/enc-1',
    });

    expect(icon).toBe('\u2695');
  });

  it('uses IPD icon when notification route points to IPD workbench', () => {
    const icon = resolveNotificationIcon({
      notification_type: 'SYSTEM',
      target_path: '/ipd?id=ADM-001',
    });

    expect(icon).toBe('\u{1F6CF}');
  });

  it('uses radiology icon when notification route points to radiology workspace', () => {
    const icon = resolveNotificationIcon({
      notification_type: 'RADIOLOGY',
      target_path: '/radiology?id=RAD-001',
    });

    expect(icon).toBe('\u{1F5BB}');
  });

  it('keeps OPD notifications sticky by disabling auto mark-read on open', () => {
    expect(
      shouldAutoMarkNotificationRead({
        notification_type: 'SYSTEM',
        title: 'OPD flow updated',
        target_path: '/scheduling/opd-flows/enc-1',
      })
    ).toBe(false);
    expect(
      shouldAutoMarkNotificationRead({
        notification_type: 'SYSTEM',
        title: 'IPD discharge planned',
        target_path: '/ipd',
      })
    ).toBe(false);
    expect(
      shouldAutoMarkNotificationRead({
        notification_type: 'BILLING',
        title: 'Invoice issued',
      })
    ).toBe(true);
  });
});
