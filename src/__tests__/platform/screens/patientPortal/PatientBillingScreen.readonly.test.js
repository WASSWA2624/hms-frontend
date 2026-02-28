const React = require('react');
const { render, waitFor } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useNetwork: jest.fn(),
  useBillingWorkspace: jest.fn(),
}));

jest.mock('@platform/screens/patientPortal/shared', () => ({
  resolveEnumLabel: jest.fn((_t, _key, value) => String(value || '')),
  usePatientPortalScope: jest.fn(),
}));

const { useRouter } = require('expo-router');
const { useBillingWorkspace, useI18n, useNetwork } = require('@hooks');
const {
  usePatientPortalScope,
} = require('@platform/screens/patientPortal/shared');
const PatientBillingScreen =
  require('@platform/screens/patientPortal/PatientBillingScreen').default;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

const buildLedgerPayload = () => ({
  patient: {
    display_id: 'PAT-001',
    display_name: 'Jane Doe',
  },
  summary: {
    total_invoiced: '300.00',
    total_paid: '100.00',
    balance_due: '200.00',
  },
  ledger: {
    items: [
      {
        type: 'INVOICE',
        status: 'SENT',
        display_id: 'INV-100',
        invoice_display_id: 'INV-100',
        timeline_at: '2026-02-20T08:00:00.000Z',
      },
    ],
    groups: [
      {
        bucket: 'EARLIER',
        label: 'Earlier',
        items: [
          {
            type: 'INVOICE',
            status: 'SENT',
            display_id: 'INV-100',
            invoice_display_id: 'INV-100',
            timeline_at: '2026-02-20T08:00:00.000Z',
          },
        ],
      },
    ],
  },
});

describe('PatientBillingScreen read-only billing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({
      push: jest.fn(),
    });
    useI18n.mockReturnValue({
      t: (key, values = {}) =>
        String(key).replace(/\{\{(\w+)\}\}/g, (_match, token) => String(values[token] || '')),
      locale: 'en-US',
    });
    useNetwork.mockReturnValue({
      isOffline: false,
    });
    usePatientPortalScope.mockReturnValue({
      isScopeReady: true,
      effectivePatientId: 'PAT-001',
      toScopedPath: (path) => path,
    });
    useBillingWorkspace.mockReturnValue({
      isLoading: false,
      errorCode: null,
      reset: jest.fn(),
      getPatientLedger: jest.fn().mockResolvedValue(buildLedgerPayload()),
      getInvoiceDocumentUrl: jest.fn(() => 'http://localhost:3000/api/v1/billing/invoices/INV-100/document'),
    });
  });

  it('keeps billing UI read-only and shows invoice download actions', async () => {
    const { queryByTestId, getByTestId } = renderWithTheme(<PatientBillingScreen />);

    await waitFor(() => expect(getByTestId('patient-billing-item-1')).toBeTruthy());

    expect(queryByTestId('patient-billing-toggle-payment-form')).toBeNull();
    expect(queryByTestId('patient-billing-payment-form')).toBeNull();
    expect(getByTestId('patient-billing-download-INV-100')).toBeTruthy();
  });
});
