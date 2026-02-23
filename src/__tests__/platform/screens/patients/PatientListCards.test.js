const React = require('react');
const { render, within, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');
const PatientListCards = require('@platform/screens/patients/components/PatientListCards').default;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>
    {component}
  </ThemeProvider>
);

const hashToPositiveInteger = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) return null;

  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(index);
    hash |= 0;
  }

  const normalizedHash = Math.trunc(Math.abs(hash % 100000));
  return normalizedHash > 0 ? normalizedHash : 1;
};

describe('PatientListCards', () => {
  const baseProps = {
    onOpenPatient: jest.fn(),
    onEditPatient: jest.fn(),
    onDeletePatient: jest.fn(),
    patientLabel: 'Patient',
    patientIdLabel: 'Patient ID',
    contactLabel: 'Contact',
    tenantLabel: 'Tenant',
    facilityLabel: 'Facility',
    actionsLabel: 'Actions',
    openButtonLabel: 'Details',
    editButtonLabel: 'Edit',
    deleteButtonLabel: 'Delete',
    testIdPrefix: 'patient-list-',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses patient human-friendly id numeric suffix as card number when available', () => {
    const { getByTestId } = renderWithTheme(
      <PatientListCards
        {...baseProps}
        items={[
          {
            id: 'patient-1',
            displayName: 'Jane Doe',
            humanFriendlyId: 'PAT000050',
            contactLabel: '+256700000010',
            tenantLabel: 'Tenant One (TEN-01)',
            facilityLabel: 'Facility One (FAC-01)',
          },
        ]}
      />
    );

    const numberBadge = getByTestId('patient-list-number-patient-1');
    expect(within(numberBadge).getByText('50')).toBeTruthy();
  });

  it('keeps fallback card numbers stable for each patient when row order changes', () => {
    const items = [
      {
        id: 'patient-alpha',
        displayName: 'Alpha Patient',
        humanFriendlyId: '-',
        contactLabel: '+256700000010',
        tenantLabel: 'Tenant One',
        facilityLabel: 'Facility One',
      },
      {
        id: 'patient-bravo',
        displayName: 'Bravo Patient',
        humanFriendlyId: '-',
        contactLabel: '+256700000011',
        tenantLabel: 'Tenant One',
        facilityLabel: 'Facility One',
      },
    ];

    const { getByTestId, rerender } = renderWithTheme(
      <PatientListCards
        {...baseProps}
        items={items}
      />
    );

    const alphaNumber = String(hashToPositiveInteger('patient-alpha'));
    const bravoNumber = String(hashToPositiveInteger('patient-bravo'));

    expect(within(getByTestId('patient-list-number-patient-alpha')).getByText(alphaNumber)).toBeTruthy();
    expect(within(getByTestId('patient-list-number-patient-bravo')).getByText(bravoNumber)).toBeTruthy();

    rerender(
      <ThemeProvider theme={lightTheme}>
        <PatientListCards
          {...baseProps}
          items={[items[1], items[0]]}
        />
      </ThemeProvider>
    );

    expect(within(getByTestId('patient-list-number-patient-alpha')).getByText(alphaNumber)).toBeTruthy();
    expect(within(getByTestId('patient-list-number-patient-bravo')).getByText(bravoNumber)).toBeTruthy();
  });

  it('renders details, edit, and delete row actions and invokes the matching handlers', () => {
    const item = {
      id: 'patient-1',
      routePatientId: 'PAT000050',
      displayName: 'Jane Doe',
      humanFriendlyId: 'PAT000050',
      contactLabel: '+256700000010',
      tenantLabel: 'Tenant One (TEN-01)',
      facilityLabel: 'Facility One (FAC-01)',
    };
    const { getByTestId } = renderWithTheme(
      <PatientListCards
        {...baseProps}
        items={[item]}
      />
    );

    fireEvent.press(getByTestId('patient-list-1'));
    fireEvent.press(getByTestId('patient-list-edit-1'));
    fireEvent.press(getByTestId('patient-list-delete-1'));

    expect(baseProps.onOpenPatient).toHaveBeenCalledWith('PAT000050');
    expect(baseProps.onEditPatient).toHaveBeenCalledWith('PAT000050');
    expect(baseProps.onDeletePatient).toHaveBeenCalledWith('patient-1');
  });

  it('renders contact values in card fields when provided', () => {
    const item = {
      id: 'patient-2',
      displayName: 'John Doe',
      humanFriendlyId: 'PAT000051',
      contactLabel: 'john@example.com',
      tenantLabel: 'Tenant One',
      facilityLabel: 'Facility One',
    };
    const { getByText } = renderWithTheme(
      <PatientListCards
        {...baseProps}
        items={[item]}
      />
    );

    expect(getByText('Contact')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
  });
});
