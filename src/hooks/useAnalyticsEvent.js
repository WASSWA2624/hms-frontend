/**
 * useAnalyticsEvent Hook
 * File: useAnalyticsEvent.js
 */
import useCrud from '@hooks/useCrud';
import {
  listAnalyticsEvents,
  getAnalyticsEvent,
  createAnalyticsEvent,
  updateAnalyticsEvent,
  deleteAnalyticsEvent
} from '@features/analytics-event';

const useAnalyticsEvent = () =>
  useCrud({
    list: listAnalyticsEvents,
    get: getAnalyticsEvent,
    create: createAnalyticsEvent,
    update: updateAnalyticsEvent,
    remove: deleteAnalyticsEvent,
  });

export default useAnalyticsEvent;
