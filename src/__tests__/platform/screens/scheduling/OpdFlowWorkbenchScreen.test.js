const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

jest.mock('@platform/screens/scheduling/OpdFlowWorkbenchScreen/useOpdFlowWorkbenchScreen', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const { useI18n } = require('@hooks');
const useOpdFlowWorkbenchScreen =
  require('@platform/screens/scheduling/OpdFlowWorkbenchScreen/useOpdFlowWorkbenchScreen').default;
const OpdFlowWorkbenchScreen =
  require('@platform/screens/scheduling/OpdFlowWorkbenchScreen/OpdFlowWorkbenchScreen').default;

const buildBaseHook = () => ({
  isResolved: true,
  canViewWorkbench: true,
  canManageAllTenants: true,
  tenantId: null,
  facilityId: null,
  isLoading: false,
  isOffline: false,
  hasError: false,
  errorCode: null,
  errorMessage: null,
  isAccessDenied: false,
  isEntitlementBlocked: false,
  canStartFlow: true,
  canPayConsultation: true,
  canRecordVitals: true,
  canAssignDoctor: true,
  canDoctorReview: true,
  canDisposition: true,
  canMutate: true,
  canSubmitCurrentAction: true,
  flowList: [
    {
      id: 'enc-1',
      encounter: { id: 'enc-1', patient_id: 'patient-1' },
      flow: { stage: 'WAITING_CONSULTATION_PAYMENT', next_step: 'PAY_CONSULTATION', timeline: [] },
      timeline: [],
      linked_record_ids: { encounter_id: 'enc-1', lab_order_ids: [], radiology_order_ids: [] },
    },
  ],
  pagination: { page: 1, limit: 25, total: 1 },
  selectedFlow: {
    id: 'enc-1',
    encounter: { id: 'enc-1', patient_id: 'patient-1' },
    flow: { stage: 'WAITING_CONSULTATION_PAYMENT', next_step: 'PAY_CONSULTATION', timeline: [] },
    timeline: [],
    linked_record_ids: { encounter_id: 'enc-1', lab_order_ids: [], radiology_order_ids: [] },
  },
  selectedFlowId: 'enc-1',
  activeFlowId: 'enc-1',
  activeStage: 'WAITING_CONSULTATION_PAYMENT',
  stageAction: 'PAY_CONSULTATION',
  progressSteps: [
    { id: 'REGISTRATION_AND_QUEUE', labelKey: 'scheduling.opdFlow.progress.registrationAndQueue', status: 'current' },
  ],
  activeProgressIndex: 0,
  currentActionGuidanceKey: 'scheduling.opdFlow.guidance.payConsultation',
  currentActionRequirementKeys: ['scheduling.opdFlow.guidance.requirements.paymentMethod'],
  isTerminalStage: false,
  isStartFormOpen: false,
  isStartAdvancedOpen: false,
  setIsStartFormOpen: jest.fn(),
  setIsStartAdvancedOpen: jest.fn(),
  startDraft: {
    arrival_mode: 'WALK_IN',
    patient_id: '',
    appointment_id: '',
    provider_user_id: '',
    first_name: '',
    last_name: '',
    consultation_fee: '',
    currency: 'USD',
    require_consultation_payment: true,
    create_consultation_invoice: true,
    pay_now_enabled: false,
    pay_now_method: 'CASH',
    pay_now_amount: '',
    emergency_severity: 'HIGH',
    emergency_triage_level: '',
    emergency_notes: '',
    notes: '',
  },
  paymentDraft: {
    method: 'CASH',
    amount: '25',
    currency: 'USD',
    transaction_ref: '',
    notes: '',
  },
  vitalsDraft: {
    vitals: [{ vital_type: 'TEMPERATURE', value: '36.8', unit: 'C' }],
    triage_level: '',
    triage_notes: '',
  },
  assignDraft: {
    provider_user_id: '',
  },
  reviewDraft: {
    note: '',
    notes: '',
    diagnoses: [],
    procedures: [],
    lab_requests: [],
    radiology_requests: [],
    medications: [],
  },
  dispositionDraft: {
    decision: 'DISCHARGE',
    admission_facility_id: '',
    notes: '',
  },
  formError: '',
  startLookupError: '',
  startLinkedPatient: null,
  startLinkedAppointment: null,
  isPatientLookupLoading: false,
  isAppointmentLookupLoading: false,
  contextPatientAgeLabel: '',
  timeline: [],
  timelineItems: [],
  vitalsRowsWithInsights: [
    {
      vital_type: 'TEMPERATURE',
      value: '36.8',
      unit: 'C',
      unitOptions: ['C', 'F'],
      status: 'NORMAL',
      rangeText: '36.0-37.5 C',
    },
  ],
  vitalsStatusSummary: {
    normal: 1,
    abnormal: 0,
    critical: 0,
  },
  stageLabelKey: 'scheduling.opdFlow.stages.WAITING_CONSULTATION_PAYMENT',
  dispositionStages: new Set(),
  arrivalModeOptions: [{ value: 'WALK_IN', labelKey: 'scheduling.opdFlow.options.arrivalMode.walkIn' }],
  emergencySeverityOptions: [{ value: 'HIGH', labelKey: 'scheduling.opdFlow.options.emergencySeverity.high' }],
  triageLevelOptions: [{ value: 'URGENT', labelKey: 'scheduling.opdFlow.options.triageLevel.urgent' }],
  triageLevelLegend: [
    {
      value: 'LEVEL_1',
      labelKey: 'scheduling.opdFlow.options.triageLevel.level1',
      colorCodeKey: 'scheduling.opdFlow.triage.color.red',
      badgeVariant: 'error',
    },
  ],
  paymentMethodOptions: [{ value: 'CASH', labelKey: 'scheduling.opdFlow.options.paymentMethod.cash' }],
  vitalTypeOptions: [{ value: 'TEMPERATURE', labelKey: 'scheduling.opdFlow.options.vitalType.temperature' }],
  diagnosisTypeOptions: [{ value: 'PRIMARY', labelKey: 'scheduling.opdFlow.options.diagnosisType.primary' }],
  medicationFrequencyOptions: [{ value: 'BID', labelKey: 'scheduling.opdFlow.options.medicationFrequency.bid' }],
  medicationRouteOptions: [{ value: 'ORAL', labelKey: 'scheduling.opdFlow.options.medicationRoute.oral' }],
  dispositionOptions: [{ value: 'DISCHARGE', labelKey: 'scheduling.opdFlow.options.disposition.discharge' }],
  onRetry: jest.fn(),
  onSelectFlow: jest.fn(),
  onOpenSubscriptions: jest.fn(),
  onResolveStartPatient: jest.fn(),
  onResolveStartAppointment: jest.fn(),
  onOpenPatientShortcut: jest.fn(),
  onOpenAdmissionShortcut: jest.fn(),
  onOpenOpdShortcut: jest.fn(),
  onStartDraftChange: jest.fn(),
  onStartFlow: jest.fn(),
  onPaymentDraftChange: jest.fn(),
  onPayConsultation: jest.fn(),
  onVitalsFieldChange: jest.fn(),
  onVitalRowChange: jest.fn(),
  onAddVitalRow: jest.fn(),
  onRemoveVitalRow: jest.fn(),
  onRecordVitals: jest.fn(),
  onAssignDraftChange: jest.fn(),
  onAssignDoctor: jest.fn(),
  onReviewDraftChange: jest.fn(),
  onReviewRowChange: jest.fn(),
  onAddReviewRow: jest.fn(),
  onRemoveReviewRow: jest.fn(),
  onDoctorReview: jest.fn(),
  onDispositionDraftChange: jest.fn(),
  onDisposition: jest.fn(),
});

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('OpdFlowWorkbenchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({
      t: (key, values = {}) =>
        String(key).replace(/\{\{(\w+)\}\}/g, (_match, token) => String(values[token] || '')),
    });
    useOpdFlowWorkbenchScreen.mockReturnValue(buildBaseHook());
  });

  it('renders OPD workbench with flow list and current stage', () => {
    const { getByTestId, getByText } = renderWithTheme(<OpdFlowWorkbenchScreen />);

    expect(getByTestId('opd-workbench-screen')).toBeTruthy();
    expect(getByTestId('opd-workbench-stage-label')).toBeTruthy();
    expect(getByTestId('opd-workbench-list-item-1')).toBeTruthy();
    expect(getByText('scheduling.opdFlow.progress.title')).toBeTruthy();
    expect(getByText('scheduling.opdFlow.guidance.title')).toBeTruthy();
  });

  it('toggles start form visibility when requested', () => {
    const hookValue = buildBaseHook();
    hookValue.isStartFormOpen = true;
    useOpdFlowWorkbenchScreen.mockReturnValue(hookValue);

    const { getByTestId } = renderWithTheme(<OpdFlowWorkbenchScreen />);
    expect(getByTestId('opd-workbench-start-form')).toBeTruthy();
  });

  it('renders entitlement blocked state', () => {
    const hookValue = buildBaseHook();
    hookValue.isEntitlementBlocked = true;
    useOpdFlowWorkbenchScreen.mockReturnValue(hookValue);

    const { getByTestId } = renderWithTheme(<OpdFlowWorkbenchScreen />);
    expect(getByTestId('opd-workbench-entitlement-blocked')).toBeTruthy();
  });

  it('renders terminal summary for admitted/discharged stages', () => {
    const hookValue = buildBaseHook();
    hookValue.activeStage = 'DISCHARGED';
    hookValue.stageAction = null;
    hookValue.isTerminalStage = true;
    hookValue.canSubmitCurrentAction = false;
    useOpdFlowWorkbenchScreen.mockReturnValue(hookValue);

    const { getByTestId } = renderWithTheme(<OpdFlowWorkbenchScreen />);
    expect(getByTestId('opd-workbench-terminal-summary')).toBeTruthy();
  });

  it('submits pay consultation action button', () => {
    const hookValue = buildBaseHook();
    useOpdFlowWorkbenchScreen.mockReturnValue(hookValue);

    const { getByTestId } = renderWithTheme(<OpdFlowWorkbenchScreen />);
    fireEvent.press(getByTestId('opd-workbench-pay-submit'));
    expect(hookValue.onPayConsultation).toHaveBeenCalledTimes(1);
  });
});
