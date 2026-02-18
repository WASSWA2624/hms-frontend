/**
 * ListItem Component Tests
 */
const React = require('react');
const { render, fireEvent } = require('@testing-library/react-native');
const { ThemeProvider } = require('styled-components/native');
const { useI18n } = require('@hooks');

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
}));

const lightTheme = require('@theme/light.theme').default || require('@theme/light.theme');
const ListItemAndroid = require('@platform/components/display/ListItem/ListItem.android').default;

const renderWithTheme = (component) => render(
  <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>
);

describe('ListItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useI18n.mockReturnValue({
      t: (key) => {
        const map = {
          'common.notAvailable': 'Not available',
          'common.view': 'View',
          'common.viewHint': 'Open item details',
          'common.edit': 'Edit',
          'common.editHint': 'Edit this item',
          'common.remove': 'Remove',
          'common.deleteHint': 'Remove this item',
        };
        return map[key] || key;
      },
    });
  });

  it('renders title and subtitle', () => {
    const { getByText } = renderWithTheme(
      <ListItemAndroid
        title="Acme Hospital"
        subtitle="Slug: acme"
        testID="tenant-row"
      />
    );

    expect(getByText('Acme Hospital')).toBeTruthy();
    expect(getByText('Slug: acme')).toBeTruthy();
  });

  it('renders role-aware CRUD actions when handlers are provided', () => {
    const onView = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ListItemAndroid
        title="Acme Hospital"
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        viewTestID="tenant-view"
        editTestID="tenant-edit"
        deleteTestID="tenant-delete"
        testID="tenant-row"
      />
    );

    fireEvent.press(getByTestId('tenant-view'));
    fireEvent.press(getByTestId('tenant-edit'));
    fireEvent.press(getByTestId('tenant-delete'));

    expect(onView).toHaveBeenCalled();
    expect(onEdit).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalled();
  });

  it('hides unauthorized edit/delete actions', () => {
    const onView = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const { getByTestId, queryByTestId } = renderWithTheme(
      <ListItemAndroid
        title="Acme Hospital"
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        canEdit={false}
        canDelete={false}
        viewTestID="tenant-view"
        editTestID="tenant-edit"
        deleteTestID="tenant-delete"
        testID="tenant-row"
      />
    );

    expect(getByTestId('tenant-view')).toBeTruthy();
    expect(queryByTestId('tenant-edit')).toBeNull();
    expect(queryByTestId('tenant-delete')).toBeNull();
  });

  it('renders metadata and status with custom leading icon', () => {
    const { getByText, getByTestId } = renderWithTheme(
      <ListItemAndroid
        title="Project Alpha"
        subtitle="Initial development phase"
        leading={{ glyph: '\u{1F4C1}', tone: 'primary' }}
        metadata={[
          { key: 'due-date', iconGlyph: '\u{1F4C5}', text: 'Due: May 15, 2024' },
          { key: 'team-size', iconGlyph: '\u{1F465}', text: 'Team: 5 Members' },
        ]}
        status={{ label: 'Active', tone: 'success', showDot: true }}
        testID="project-row"
      />
    );

    expect(getByText('Due: May 15, 2024')).toBeTruthy();
    expect(getByText('Team: 5 Members')).toBeTruthy();
    expect(getByText('Active')).toBeTruthy();
    expect(getByTestId('project-row-leading')).toBeTruthy();
    expect(getByTestId('project-row-status')).toBeTruthy();
  });

  it('supports custom action configuration', () => {
    const onArchive = jest.fn();
    const { getByTestId, getByText } = renderWithTheme(
      <ListItemAndroid
        title="Acme Hospital"
        actionLabelMode="always"
        actionItems={[
          {
            key: 'archive',
            iconGlyph: '\u{1F4E6}',
            tone: 'secondary',
            label: 'Archive',
            onPress: onArchive,
            testID: 'tenant-archive',
          },
        ]}
      />
    );

    fireEvent.press(getByTestId('tenant-archive'));

    expect(onArchive).toHaveBeenCalled();
    expect(getByText('Archive')).toBeTruthy();
  });
});
