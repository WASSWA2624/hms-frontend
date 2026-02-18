/**
 * SettingsScreen - Android
 * Container for settings routes (uses AppFrame scroll for uniformity).
 */
import React, { useState } from 'react';
import { Modal } from '@platform/components';
import { useI18n } from '@hooks';
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
} from './SettingsScreen.android.styles';

const SettingsScreenAndroid = ({ children }) => {
  const { t } = useI18n();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <StyledContainer testID="settings-screen" accessibilityLabel={t('settings.screen.label')}>
      <StyledContent>
        <StyledHeader>
          <StyledHeaderCopy>
            <StyledTitle>{t('settings.screen.title')}</StyledTitle>
            <StyledDescription>{t('settings.screen.description')}</StyledDescription>
          </StyledHeaderCopy>
          <StyledHelpButton
            accessibilityRole="button"
            accessibilityLabel={t('settings.screen.helpLabel')}
            accessibilityHint={t('settings.screen.helpTooltip')}
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
          accessibilityLabel={t('settings.screen.helpTitle')}
          accessibilityHint={t('settings.screen.helpBody')}
          testID="settings-screen-help-modal"
        >
          <StyledHelpModalTitle>{t('settings.screen.helpTitle')}</StyledHelpModalTitle>
          <StyledHelpModalBody>{t('settings.screen.helpBody')}</StyledHelpModalBody>
          <StyledHelpModalItem>{`- ${t('settings.screen.helpList.sequence')}`}</StyledHelpModalItem>
          <StyledHelpModalItem>{`- ${t('settings.screen.helpList.context')}`}</StyledHelpModalItem>
          <StyledHelpModalItem>{`- ${t('settings.screen.helpList.access')}`}</StyledHelpModalItem>
        </Modal>
        {children}
      </StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenAndroid;
