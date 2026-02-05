/**
 * Analytics Tracker
 * Fire-and-forget analytics
 * File: tracker.js
 */
import { featureFlags } from '@config';
import { logger } from '@logging';

const trackEvent = (eventName, properties = {}) => {
  if (!featureFlags.ANALYTICS_ENABLED) return;

  // Fire-and-forget
  Promise.resolve()
    .then(() => {
      // TODO: Send to analytics service
      logger.debug('Analytics event', { eventName, properties });
    })
    .catch(() => {
      // Silently fail
    });
};

const trackScreen = (screenName, properties = {}) => {
  trackEvent('screen_view', { screen_name: screenName, ...properties });
};

export { trackEvent, trackScreen };

