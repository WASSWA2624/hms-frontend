const React = require('react');
const { render } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');

const BillingQueue =
  require('@platform/screens/billing/BillingWorkbenchScreen/components/BillingQueue').default;

const renderWithTheme = (component) =>
  render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);

describe('BillingQueue friendly ID rendering', () => {
  it('does not render UUID fallback text when display id is unavailable', () => {
    const technicalId = '123e4567-e89b-42d3-a456-426614174000';

    const { queryByText, getByText } = renderWithTheme(
      <BillingQueue
        queues={[{ queue: 'NEEDS_ISSUE', label: 'Needs issue', count: 1 }]}
        activeQueue="NEEDS_ISSUE"
        queueItems={[
          {
            backend_identifier: technicalId,
            status: 'PENDING',
            patient_display_name: 'Jane Doe',
          },
        ]}
        selectedItemIdentifier=""
        isQueueLoading={false}
        onSelectQueue={jest.fn()}
        onSelectItem={jest.fn()}
        onApproveApproval={jest.fn()}
        onRejectApproval={jest.fn()}
      />
    );

    expect(getByText('Record')).toBeTruthy();
    expect(queryByText(technicalId)).toBeNull();
  });
});

