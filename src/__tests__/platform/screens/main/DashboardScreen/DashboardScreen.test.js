/**
 * DashboardScreen Component Tests
 * File: DashboardScreen.test.js
 */
const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/main/DashboardScreen/useDashboardScreen', () => jest.fn());

const DashboardScreenAndroid = require('@platform/screens/main/DashboardScreen/DashboardScreen.android').default;
const DashboardScreenIOS = require('@platform/screens/main/DashboardScreen/DashboardScreen.ios').default;
const DashboardScreenWeb = require('@platform/screens/main/DashboardScreen/DashboardScreen.web').default;
const useDashboardScreenModule = require('@platform/screens/main/DashboardScreen/useDashboardScreen');
const useDashboardScreen = useDashboardScreenModule.default || useDashboardScreenModule;
const DashboardScreenIndex = require('@platform/screens/main/DashboardScreen/index.js');
const { STATES } = require('@platform/screens/main/DashboardScreen/types.js');

const lightThemeModule = require('@theme/light.theme');
const lightTheme = lightThemeModule.default || lightThemeModule;

const renderWithTheme = (component) => render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

const createHookResult = (overrides = {}) => ({
  state: STATES.IDLE,
  isOffline: false,
  facilityContext: {
    userName: 'Amina',
    roleKey: 'home.welcome.roles.owner',
    facilityName: 'CityCare Hospital',
    branchName: 'Main Tenant',
    facilityTypeKey: 'home.facility.types.hospital',
    planStatusKey: 'home.plan.status.trial',
    planDetailKey: 'home.plan.trialDays',
    planDetailValue: 9,
  },
  dashboardRole: {
    id: 'tenant_admin',
    role: 'TENANT_ADMIN',
    pack: 'admin',
    title: 'Tenant operations overview',
    subtitle: 'Patient flow, scheduling, admissions, billing, and payments.',
    badgeVariant: 'primary',
  },
  liveDashboard: {
    summaryCards: [{ id: 'patients_today', label: 'Patients today', value: 8 }],
    trend: {
      title: '7-day trend',
      subtitle: 'Trend',
      points: [{ id: 'd1', date: '2026-02-24', value: 4 }],
    },
    distribution: {
      title: 'Status distribution',
      subtitle: 'Distribution',
      total: 2,
      segments: [{ id: 'open', label: 'Open', value: 2, color: '#2563eb' }],
    },
    highlights: [{ id: 'h1', label: 'Live signal', value: '8', context: 'Primary metric' }],
    queue: [{ id: 'q1', title: 'Queue', meta: '2 items', statusLabel: 'Current', statusVariant: 'warning' }],
    alerts: [{ id: 'a1', title: 'Alert', meta: '1 signal', severityLabel: 'Watch', severityVariant: 'error' }],
    activity: [{ id: 'ac1', title: 'Activity', meta: 'Updated', timeLabel: '1m ago' }],
    hasLiveData: true,
    generatedAt: '2026-02-24T00:00:00.000Z',
    scope: { tenant_id: 'tenant-1', facility_id: 'facility-1', branch_id: null, days: 7 },
  },
  quickActions: [{ id: 'newPatient', labelKey: 'home.quickActions.items.newPatient', isEnabled: true, path: '/patients/create' }],
  tenantContext: {
    isRequired: false,
    options: [{ label: 'Tenant One', value: 'tenant-1' }],
    selectedTenantId: 'tenant-1',
    isLoading: false,
    onSelectTenant: jest.fn(),
  },
  lastUpdated: new Date('2026-02-24T00:00:00.000Z'),
  onRetry: jest.fn(),
  onQuickAction: jest.fn(),
  ...overrides,
});

describe('DashboardScreen Component', () => {
  const mockT = jest.fn((key, values = {}) => {
    if (key === 'home.title') return 'Dashboard';
    if (key === 'home.welcome.title') return `Welcome ${values.name || ''}`.trim();
    if (key === 'home.welcome.subtitle') return `Role ${values.role || ''}`.trim();
    if (key === 'home.welcome.facilityMeta') return `${values.facility || ''} ${values.branch || ''}`.trim();
    if (key === 'home.lastUpdated') return `Updated ${values.time || ''}`.trim();
    return key;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: mockT, locale: 'en-US' });
    useDashboardScreen.mockReturnValue(createHookResult());
  });

  const assertSharedLiveSections = (screen) => {
    expect(screen.getByText('Live KPI Snapshot')).toBeTruthy();
    expect(screen.getByText('Visual Analytics')).toBeTruthy();
    expect(screen.getByText('Operations Queue')).toBeTruthy();
    expect(screen.getByText('Actions And Activity')).toBeTruthy();
  };

  it('renders live dashboard sections on Android', () => {
    const screen = renderWithTheme(<DashboardScreenAndroid />);
    expect(screen.getByTestId('dashboard-screen')).toBeTruthy();
    assertSharedLiveSections(screen);
    expect(screen.queryByText('home.startHere.title')).toBeNull();
  });

  it('renders live dashboard sections on iOS', () => {
    const screen = renderWithTheme(<DashboardScreenIOS />);
    expect(screen.getByTestId('dashboard-screen')).toBeTruthy();
    assertSharedLiveSections(screen);
    expect(screen.queryByText('home.startHere.title')).toBeNull();
  });

  it('renders live dashboard sections on Web', () => {
    const screen = renderWithTheme(<DashboardScreenWeb />);
    assertSharedLiveSections(screen);
    expect(screen.queryByText('home.startHere.title')).toBeNull();
  });

  it('renders tenant context picker state consistently', () => {
    useDashboardScreen.mockReturnValue(createHookResult({
      state: STATES.NEEDS_TENANT_CONTEXT,
      tenantContext: {
        isRequired: true,
        options: [{ label: 'Tenant One', value: 'tenant-1' }],
        selectedTenantId: '',
        isLoading: false,
        onSelectTenant: jest.fn(),
      },
    }));

    const android = renderWithTheme(<DashboardScreenAndroid />);
    const ios = renderWithTheme(<DashboardScreenIOS />);
    const web = renderWithTheme(<DashboardScreenWeb />);

    expect(android.getByTestId('dashboard-tenant-picker')).toBeTruthy();
    expect(ios.getByTestId('dashboard-tenant-picker')).toBeTruthy();
    expect(web.getByText('Tenant context required')).toBeTruthy();
  });

  it('exports hook and constants from barrel', () => {
    expect(DashboardScreenIndex.default).toBeDefined();
    expect(DashboardScreenIndex.useDashboardScreen).toBeDefined();
    expect(DashboardScreenIndex.STATES).toEqual(STATES);
  });
});
