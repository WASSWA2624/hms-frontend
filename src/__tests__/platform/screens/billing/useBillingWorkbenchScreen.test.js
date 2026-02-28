const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockListWorkspace = jest.fn();
const mockListWorkItems = jest.fn();
const mockGetPatientLedger = jest.fn();
const mockIssueInvoice = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@hooks', () => ({
  useBillingWorkspace: jest.fn(),
  useNetwork: jest.fn(),
  useScopeAccess: jest.fn(),
}));

const { useBillingWorkspace, useNetwork, useScopeAccess } = require('@hooks');
const useBillingWorkbenchScreen =
  require('@platform/screens/billing/BillingWorkbenchScreen/useBillingWorkbenchScreen').default;

const buildWorkspacePayload = () => ({
  summary: {
    needs_issue: 1,
    pending_payment: 0,
    claims_pending: 0,
    approval_required: 0,
    overdue: 0,
    payments_today_total: '0.00',
    refunds_today_total: '0.00',
  },
  queues: [{ queue: 'NEEDS_ISSUE', label: 'Needs issue', count: 1 }],
  timeline: {
    groups: [],
    items: [
      {
        type: 'INVOICE',
        display_id: 'INV-100',
        invoice_display_id: 'INV-100',
        patient_display_id: 'PAT-001',
      },
    ],
  },
});

const buildQueuePayload = () => ({
  queue: 'NEEDS_ISSUE',
  items: [
    {
      display_id: 'INV-100',
      invoice_display_id: 'INV-100',
      patient_display_id: 'PAT-001',
      patient_display_name: 'Jane Doe',
      status: 'DRAFT',
    },
  ],
});

const buildLedgerPayload = () => ({
  patient: { display_id: 'PAT-001', display_name: 'Jane Doe' },
  summary: { total_invoiced: '100.00', net_paid: '0.00', balance_due: '100.00' },
  ledger: { groups: [], items: [] },
});

describe('useBillingWorkbenchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNetwork.mockReturnValue({ isOffline: false });
    useScopeAccess.mockReturnValue({
      canRead: true,
      canWrite: true,
      canManageAllTenants: true,
      tenantId: null,
      facilityId: null,
      isResolved: true,
      roles: ['TENANT_ADMIN'],
    });

    mockListWorkspace.mockResolvedValue(buildWorkspacePayload());
    mockListWorkItems.mockResolvedValue(buildQueuePayload());
    mockGetPatientLedger.mockResolvedValue(buildLedgerPayload());
    mockIssueInvoice.mockResolvedValue({ ok: true });

    useBillingWorkspace.mockReturnValue({
      listWorkspace: mockListWorkspace,
      listWorkItems: mockListWorkItems,
      getPatientLedger: mockGetPatientLedger,
      issueInvoice: mockIssueInvoice,
      sendInvoice: jest.fn(),
      requestInvoiceVoid: jest.fn(),
      reconcilePayment: jest.fn(),
      requestPaymentRefund: jest.fn(),
      requestAdjustment: jest.fn(),
      approveApproval: jest.fn(),
      rejectApproval: jest.fn(),
      getInvoiceDocumentUrl: jest.fn(() => 'http://localhost:3000/api/v1/billing/invoices/INV-100/document'),
      errorCode: null,
    });
  });

  it('refreshes only loaded sections after queue action submit', async () => {
    const { result } = renderHook(() => useBillingWorkbenchScreen());

    await waitFor(() => expect(mockListWorkspace).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(mockListWorkItems).toHaveBeenCalledWith(
        expect.objectContaining({ queue: 'NEEDS_ISSUE' })
      )
    );

    await act(async () => {
      await result.current.onOpenPatientLedger('PAT-001');
    });

    const beforeWorkspace = mockListWorkspace.mock.calls.length;
    const beforeQueue = mockListWorkItems.mock.calls.length;
    const beforeLedger = mockGetPatientLedger.mock.calls.length;

    act(() => {
      result.current.onActionTypeChange('ISSUE_INVOICE');
      result.current.onDraftChange('invoiceIdentifier', 'INV-100');
    });

    await act(async () => {
      await result.current.onSubmitAction();
    });

    expect(mockIssueInvoice).toHaveBeenCalledWith('INV-100', { notes: null });
    expect(mockListWorkspace.mock.calls.length).toBeGreaterThan(beforeWorkspace);
    expect(mockListWorkItems.mock.calls.length).toBeGreaterThan(beforeQueue);
    expect(mockGetPatientLedger.mock.calls.length).toBeGreaterThan(beforeLedger);
  });

  it('does not refresh ledger when no patient ledger is open', async () => {
    const { result } = renderHook(() => useBillingWorkbenchScreen());

    await waitFor(() => expect(mockListWorkspace).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockListWorkItems).toHaveBeenCalled());

    act(() => {
      result.current.onActionTypeChange('ISSUE_INVOICE');
      result.current.onDraftChange('invoiceIdentifier', 'INV-100');
    });

    await act(async () => {
      await result.current.onSubmitAction();
    });

    expect(mockIssueInvoice).toHaveBeenCalledWith('INV-100', { notes: null });
    expect(mockGetPatientLedger).not.toHaveBeenCalled();
  });
});

