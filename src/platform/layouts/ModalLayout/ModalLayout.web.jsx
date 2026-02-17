/**
 * ModalLayout Component - Web
 * Modal layout wrapper for Web platform
 * File: ModalLayout.web.jsx
 */

import React from 'react';
import { useI18n } from '@hooks';
import { StyledContainer } from './ModalLayout.web.styles';
import Modal from '@platform/components/feedback/Modal';

/**
 * ModalLayout component for Web
 * Wrapper around Modal component with layout-specific features
 * @param {Object} props - ModalLayout props
 * @param {boolean} props.visible - Modal visibility
 * @param {Function} props.onDismiss - Dismiss handler
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 * @param {string} props.className - Additional CSS class
 */
const ModalLayoutWeb = ({
  visible,
  onDismiss,
  children,
  size = 'medium',
  accessibilityLabel,
  testID,
  className,
}) => {
  const { t } = useI18n();
  const resolvedAccessibilityLabel = accessibilityLabel || t('common.modal');
  const resolvedAccessibilityHint = t('common.modalHint');

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      size={size}
      accessibilityLabel={resolvedAccessibilityLabel}
      accessibilityHint={resolvedAccessibilityHint}
      testID={testID}
      className={className}
    >
      <StyledContainer role="region" aria-label={resolvedAccessibilityHint}>
        {children}
      </StyledContainer>
    </Modal>
  );
};

export default ModalLayoutWeb;

