/**
 * Patient Layout Tests
 * File: patient-layout.test.js
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import PatientLayout from '@app/(patient)/_layout';
import { useRoleGuard } from '@navigation/guards';

jest.mock('@navigation/guards', () => ({
  useRoleGuard: jest.fn(),
}));

jest.mock('@platform/layouts', () => ({
  PatientRouteLayout: jest.fn(() => {
    const { View } = require('react-native');
    return <View testID="patient-route-layout" />;
  }),
}));

describe('app/(patient)/_layout.jsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useRoleGuard.mockReturnValue({ hasAccess: true, errorCode: null });
  });

  test('renders patient route layout', () => {
    const { getByTestId } = render(<PatientLayout />);
    expect(getByTestId('patient-route-layout')).toBeTruthy();
  });

  test('wires role guard with dashboard fallback redirect', () => {
    render(<PatientLayout />);
    expect(useRoleGuard).toHaveBeenCalledWith(
      expect.objectContaining({
        redirectPath: '/dashboard',
      })
    );
  });
});
