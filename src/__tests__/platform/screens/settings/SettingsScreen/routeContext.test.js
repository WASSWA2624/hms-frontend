const resolveSettingsRouteContext = require('@platform/screens/settings/SettingsScreen/routeContext').default;

describe('settings route context resolver', () => {
  it('resolves general overview route', () => {
    expect(resolveSettingsRouteContext('/settings')).toEqual({
      screenKey: 'general',
      screenMode: 'overview',
    });
  });

  it('resolves list route', () => {
    expect(resolveSettingsRouteContext('/settings/tenants')).toEqual({
      screenKey: 'tenant',
      screenMode: 'list',
    });
  });

  it('resolves create route', () => {
    expect(resolveSettingsRouteContext('/settings/tenants/create')).toEqual({
      screenKey: 'tenant',
      screenMode: 'create',
    });
  });

  it('resolves detail route', () => {
    expect(resolveSettingsRouteContext('/settings/tenants/tenant-123')).toEqual({
      screenKey: 'tenant',
      screenMode: 'detail',
    });
  });

  it('resolves edit route', () => {
    expect(resolveSettingsRouteContext('/settings/tenants/tenant-123/edit')).toEqual({
      screenKey: 'tenant',
      screenMode: 'edit',
    });
  });
});
