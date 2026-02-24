const React = require('react');
const { render } = require('@testing-library/react-native');

const mockSlot = jest.fn(() => null);
const mockUsePathname = jest.fn(() => '/emergency');
const mockReplace = jest.fn();
const mockUseScopeAccess = jest.fn(() => ({
  canRead: true,
  canManageAllTenants: true,
  tenantId: null,
  isResolved: true,
}));
const mockLoadingSpinner = jest.fn(() => null);
const mockClinicalScreen = jest.fn(({ children }) => children || null);

jest.mock('expo-router', () => ({
  Slot: (props) => mockSlot(props),
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@hooks', () => ({
  useI18n: () => ({ t: (key) => key }),
  useScopeAccess: (...args) => mockUseScopeAccess(...args),
}));

jest.mock('@platform/components', () => ({
  LoadingSpinner: (...args) => mockLoadingSpinner(...args),
}));

jest.mock('@platform/screens', () => ({
  ClinicalScreen: (...args) => mockClinicalScreen(...args),
}));

describe('Emergency Layout Guard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/emergency');
    mockUseScopeAccess.mockReturnValue({
      canRead: true,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });
  });

  test('renders emergency slot when scope access is allowed', () => {
    const layoutModule = require('../../../app/(main)/emergency/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockUseScopeAccess).toHaveBeenCalledWith('emergency');
    expect(mockClinicalScreen).toHaveBeenCalledTimes(1);
    expect(mockSlot).toHaveBeenCalledTimes(1);
    expect(mockLoadingSpinner).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('shows loading spinner while scope access is resolving', () => {
    mockUseScopeAccess.mockReturnValue({
      canRead: false,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: false,
    });

    const layoutModule = require('../../../app/(main)/emergency/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockClinicalScreen).toHaveBeenCalledTimes(1);
    expect(mockLoadingSpinner).toHaveBeenCalledTimes(1);
    expect(mockSlot).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('redirects to dashboard when read access is denied', () => {
    mockUseScopeAccess.mockReturnValue({
      canRead: false,
      canManageAllTenants: true,
      tenantId: null,
      isResolved: true,
    });

    const layoutModule = require('../../../app/(main)/emergency/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    expect(mockClinicalScreen).not.toHaveBeenCalled();
    expect(mockSlot).not.toHaveBeenCalled();
  });

  test('redirects to dashboard for scoped users without tenant context', () => {
    mockUseScopeAccess.mockReturnValue({
      canRead: true,
      canManageAllTenants: false,
      tenantId: null,
      isResolved: true,
    });

    const layoutModule = require('../../../app/(main)/emergency/_layout');
    render(React.createElement(layoutModule.default));

    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    expect(mockClinicalScreen).not.toHaveBeenCalled();
    expect(mockSlot).not.toHaveBeenCalled();
  });
});
