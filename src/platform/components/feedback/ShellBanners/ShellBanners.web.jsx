/**
 * ShellBanners Component - Web
 * Dismissible modal for system banners (offline, maintenance, etc.)
 * File: ShellBanners.web.jsx
 */
import React, { useEffect, useState } from 'react';
import { useI18n } from '@hooks';
import Modal from '@platform/components/feedback/Modal';
import SystemBanner from '@platform/components/feedback/SystemBanner';
import { StyledStack, StyledStackItem } from './ShellBanners.web.styles';
import { STACK_SPACING } from './types';

/**
 * ShellBanners component for Web – displays as a dismissible modal
 * @param {Object} props - ShellBanners props
 * @param {Array} props.banners - Banner configurations
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 */
const ShellBannersWeb = ({
  banners = [],
  accessibilityLabel,
  testID,
  className,
  ...rest
}) => {
  const { t } = useI18n();
  const [dismissed, setDismissed] = useState(false);
  const bannerKey = banners.map((b) => b.id).join(',');

  useEffect(() => {
    setDismissed(false);
  }, [bannerKey]);

  const visible = banners.length > 0 && !dismissed;
  const label = accessibilityLabel || t('shell.banners.surfaceLabel');

  if (!visible) return null;

  return (
    <Modal
      visible
      onDismiss={() => setDismissed(true)}
      size="small"
      showCloseButton
      dismissOnBackdrop
      accessibilityLabel={label}
      testID={testID}
      className={className}
      {...rest}
    >
      <StyledStack role="region" aria-label={label}>
        {banners.map((banner, index) => (
          <StyledStackItem
            key={banner.id}
            spacing={STACK_SPACING}
            isLast={index === banners.length - 1}
          >
            <SystemBanner {...banner} />
          </StyledStackItem>
        ))}
      </StyledStack>
    </Modal>
  );
};

export default ShellBannersWeb;
