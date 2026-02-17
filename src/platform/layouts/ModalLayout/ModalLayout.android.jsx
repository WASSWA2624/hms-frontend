/**
 * ModalLayout Component - Android
 * Modal layout wrapper for Android platform
 * File: ModalLayout.android.jsx
 */

import React from 'react';
import { StyledContainer } from './ModalLayout.android.styles';
import Modal from '@platform/components/feedback/Modal';
import { useI18n } from '@hooks';

/**
 * ModalLayout component for Android
 * Wrapper around Modal component with layout-specific features
 * @param {Object} props - ModalLayout props
 * @param {boolean} props.visible - Modal visibility
 * @param {Function} props.onDismiss - Dismiss handler
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size
 * @param {string} props.accessibilityLabel - Accessibility label
 * @param {string} props.testID - Test identifier
 */
const ModalLayoutAndroid = ({
  visible,
  onDismiss,
  children,
  size = 'medium',
  accessibilityLabel,
  testID,
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
    >
      <StyledContainer accessibilityRole="none" accessibilityLabel={resolvedAccessibilityHint}>
        {children}
      </StyledContainer>
    </Modal>
  );
};

export default ModalLayoutAndroid;

