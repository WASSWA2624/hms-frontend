/**
 * NetworkIndicator Component - Web
 * Displays current network status in the header.
 * File: NetworkIndicator.web.jsx
 */
import React from 'react';
import { useI18n, useNetwork } from '@hooks';
import { Icon } from '@platform/components';
import { StyledIndicator, StyledStatusDot } from './NetworkIndicator.web.styles';

const resolveStatus = ({ isOffline, isLowQuality, isSyncing }) => {
  if (isOffline) {
    return { key: 'offline', color: 'error' };
  }
  if (isLowQuality) {
    return { key: 'unstable', color: 'warning' };
  }
  if (isSyncing) {
    return { key: 'syncing', color: 'secondary' };
  }
  return { key: 'online' };
};

/**
 * NetworkIndicator component for Web
 * @param {Object} props
 * @param {string} [props.testID]
 * @param {string} [props.className]
 */
const NetworkIndicatorWeb = ({ testID, className }) => {
  const { t } = useI18n();
  const { isOffline, isLowQuality, isSyncing } = useNetwork();
  const status = resolveStatus({ isOffline, isLowQuality, isSyncing });
  const label = t(`navigation.network.status.${status.key}`);
  const a11yLabel = `${t('navigation.network.label')}: ${label}`;
  const isOfflineStatus = status.key === 'offline';
  const networkGlyph = isOfflineStatus ? '🚫' : '📶';

  return (
    <StyledIndicator
      role="status"
      aria-live="polite"
      aria-label={a11yLabel}
      data-testid={testID}
      className={className}
    >
      <Icon
        glyph={networkGlyph}
        size="sm"
        tone="muted"
        decorative
        accessibilityLabel={t('navigation.network.label')}
      />
      <StyledStatusDot status={status.key} />
    </StyledIndicator>
  );
};

export default NetworkIndicatorWeb;
