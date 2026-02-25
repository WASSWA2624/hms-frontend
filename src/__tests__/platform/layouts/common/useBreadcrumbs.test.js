const { renderHook, waitFor } = require('@testing-library/react-native');

jest.mock('expo-router', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@config/sideMenu', () => ({
  getMenuIconGlyph: jest.fn((value) => value),
  getNavItemLabel: jest.fn((_t, item) => item?.label || item?.id || ''),
}));

jest.mock('@features/patient', () => ({
  getPatient: jest.fn(),
}));

jest.mock('@features/opd-flow', () => ({
  getOpdFlow: jest.fn(),
}));

const { usePathname } = require('expo-router');
const { useI18n } = require('@hooks');
const { getPatient } = require('@features/patient');
const { getOpdFlow } = require('@features/opd-flow');
const useBreadcrumbs = require('@platform/layouts/common/useBreadcrumbs').default;

describe('useBreadcrumbs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({ t: (key) => key });
  });

  it('uses patient human_friendly_id for patient detail breadcrumb segment', async () => {
    usePathname.mockReturnValue('/patients/patients/patient-42');
    getPatient.mockResolvedValue({
      id: 'patient-42',
      human_friendly_id: 'PAT000042',
    });

    const { result } = renderHook(() => useBreadcrumbs([]));

    await waitFor(() => {
      expect(result.current[2]?.label).toBe('PAT000042');
    });
    expect(getPatient).toHaveBeenCalledWith('patient-42');
  });

  it('does not request patient data for non-patient routes', () => {
    usePathname.mockReturnValue('/settings/users');

    const { result } = renderHook(() => useBreadcrumbs([]));

    expect(result.current.map((item) => item.label)).toEqual(['Settings', 'Users']);
    expect(getPatient).not.toHaveBeenCalled();
    expect(getOpdFlow).not.toHaveBeenCalled();
  });

  it('does not request patient data for patient create route', () => {
    usePathname.mockReturnValue('/patients/patients/create');

    const { result } = renderHook(() => useBreadcrumbs([]));

    expect(result.current[result.current.length - 1]?.label).toBe('Create');
    expect(getPatient).not.toHaveBeenCalled();
    expect(getOpdFlow).not.toHaveBeenCalled();
  });

  it('uses encounter human_friendly_id for OPD flow detail breadcrumb segment', async () => {
    usePathname.mockReturnValue('/scheduling/opd-flows/encounter-99');
    getOpdFlow.mockResolvedValue({
      encounter: {
        id: 'encounter-99',
        human_friendly_id: 'ENC000099',
      },
    });

    const { result } = renderHook(() => useBreadcrumbs([]));

    await waitFor(() => {
      expect(result.current[2]?.label).toBe('ENC000099');
    });
    expect(getOpdFlow).toHaveBeenCalledWith('encounter-99');
  });
});
