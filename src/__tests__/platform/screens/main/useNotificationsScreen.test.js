const { renderHook, act, waitFor } = require('@testing-library/react-native');

const mockPush = jest.fn();
const mockListNotifications = jest.fn();
const mockMarkRead = jest.fn();
const mockMarkUnread = jest.fn();

let realtimeHandler = null;

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@hooks', () => ({
  useI18n: jest.fn(),
  useAuth: jest.fn(),
  useNavigationVisibility: jest.fn(),
  useNotification: jest.fn(),
  useRealtimeEvent: jest.fn((eventName, handler) => {
    if (eventName === 'notification.created') {
      realtimeHandler = handler;
    }
  }),
}));

const useNotificationsScreen =
  require('@platform/screens/main/NotificationsScreen/useNotificationsScreen').default;
const {
  useI18n,
  useAuth,
  useNavigationVisibility,
  useNotification,
} = require('@hooks');

describe('useNotificationsScreen realtime behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    realtimeHandler = null;

    useI18n.mockReturnValue({
      t: (key) => key,
      locale: 'en',
    });
    useAuth.mockReturnValue({
      user: { id: 'user-1', tenant_id: 'tenant-1' },
      isAuthenticated: true,
    });
    useNavigationVisibility.mockReturnValue({
      isItemVisible: () => true,
    });
    useNotification.mockReturnValue({
      list: mockListNotifications,
      markRead: mockMarkRead,
      markUnread: mockMarkUnread,
    });

    mockListNotifications.mockResolvedValue({ items: [] });
    mockMarkRead.mockResolvedValue({ success: true });
    mockMarkUnread.mockResolvedValue({ success: true });
  });

  it('prepends notification.created payload and updates unread count', async () => {
    const { result } = renderHook(() => useNotificationsScreen());

    await waitFor(() => expect(mockListNotifications).toHaveBeenCalled());
    expect(result.current.totalCount).toBe(0);
    expect(result.current.unreadCount).toBe(0);
    expect(typeof realtimeHandler).toBe('function');

    act(() => {
      realtimeHandler({
        id: 'notification-1',
        title: 'OPD flow updated',
        message: 'Patient waiting for doctor review',
        notification_type: 'SYSTEM',
        target_path: '/scheduling/opd-flows/enc-1',
        created_at: '2026-02-24T08:00:00.000Z',
      });
    });

    expect(result.current.totalCount).toBe(1);
    expect(result.current.unreadCount).toBe(1);
    expect(result.current.filteredItems[0].route).toBe('/scheduling/opd-flows/enc-1');

    await act(async () => {
      await result.current.onToggleReadState(result.current.filteredItems[0]);
    });

    expect(mockMarkRead).toHaveBeenCalledWith('notification-1');
  });
});
