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

  it('uses OPD icon when notification route points to OPD flow workbench', () => {
    const icon = resolveNotificationIcon({
      notification_type: 'SYSTEM',
      target_path: '/scheduling/opd-flows/enc-1',
    });

    expect(icon).toBe('\u2695');
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
        notification_type: 'BILLING',
        title: 'Invoice issued',
      })
    ).toBe(true);
  });
});
