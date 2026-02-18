/**
 * SettingsScreen - iOS
 * Container for settings routes (uses AppFrame scroll for uniformity).
 */
import React, { useState } from 'react';
import { Modal } from '@platform/components';
import { useI18n } from '@hooks';
import { SETTINGS_TABS } from './types';
import resolveSettingsScreenCopy from './resolveScreenCopy';
import {
  StyledContainer,
  StyledContent,
  StyledDescription,
  StyledHeader,
  StyledHeaderCopy,
  StyledHelpButton,
  StyledHelpButtonLabel,
  StyledHelpModalBody,
  StyledHelpModalItem,
  StyledHelpModalTitle,
  StyledTitle,
} from './SettingsScreen.ios.styles';

const SettingsScreenIOS = ({ children, screenKey = SETTINGS_TABS.GENERAL }) => {
  const { t } = useI18n();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const screenCopy = resolveSettingsScreenCopy(t, screenKey);

  return (
    <StyledContainer testID="settings-screen" accessibilityLabel={screenCopy.screenTitle}>
      <StyledContent>
        <StyledHeader>
          <StyledHeaderCopy>
            <StyledTitle>{screenCopy.screenTitle}</StyledTitle>
            <StyledDescription>{screenCopy.screenDescription}</StyledDescription>
          </StyledHeaderCopy>
          <StyledHelpButton
            accessibilityRole="button"
            accessibilityLabel={screenCopy.helpLabel}
            accessibilityHint={screenCopy.helpTooltip}
            testID="settings-screen-help-trigger"
            onPress={() => setIsHelpOpen(true)}
          >
            <StyledHelpButtonLabel>?</StyledHelpButtonLabel>
          </StyledHelpButton>
        </StyledHeader>
        <Modal
          visible={isHelpOpen}
          onDismiss={() => setIsHelpOpen(false)}
          size="small"
          accessibilityLabel={screenCopy.helpTitle}
          accessibilityHint={screenCopy.helpBody}
          testID="settings-screen-help-modal"
        >
          <StyledHelpModalTitle>{screenCopy.helpTitle}</StyledHelpModalTitle>
          <StyledHelpModalBody>{screenCopy.helpBody}</StyledHelpModalBody>
          {screenCopy.helpItems.map((item) => (
            <StyledHelpModalItem key={item}>{`- ${item}`}</StyledHelpModalItem>
          ))}
        </Modal>
        {children}
      </StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenIOS;
