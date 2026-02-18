/**
 * SettingsScreen - Web
 * Container for settings routes (uses AppFrame scroll for uniformity).
 * Per platform-ui.mdc: presentation-only; theme via styles.
 */
import React, { useState } from 'react';
import { Icon, Modal, Tooltip } from '@platform/components';
import { useI18n } from '@hooks';
import {
  StyledContainer,
  StyledContent,
  StyledDescription,
  StyledHeader,
  StyledHeaderCopy,
  StyledHelpAnchor,
  StyledHelpButton,
  StyledHelpChecklist,
  StyledHelpItem,
  StyledHelpModalBody,
  StyledHelpModalTitle,
  StyledTitle,
} from './SettingsScreen.web.styles';

const SettingsScreenWeb = ({ children }) => {
  const { t } = useI18n();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <StyledContainer
      testID="settings-screen"
      data-testid="settings-screen"
      role="main"
      aria-label={t('settings.screen.label')}
    >
      <StyledContent>
        <StyledHeader>
          <StyledHeaderCopy>
            <StyledTitle>{t('settings.screen.title')}</StyledTitle>
            <StyledDescription>{t('settings.screen.description')}</StyledDescription>
          </StyledHeaderCopy>
          <StyledHelpAnchor>
            <StyledHelpButton
              type="button"
              aria-label={t('settings.screen.helpLabel')}
              aria-describedby="settings-screen-help-tooltip"
              testID="settings-screen-help-trigger"
              data-testid="settings-screen-help-trigger"
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
              onFocus={() => setIsTooltipVisible(true)}
              onBlur={() => setIsTooltipVisible(false)}
              onClick={() => setIsHelpOpen(true)}
            >
              <Icon glyph="?" size="xs" decorative />
            </StyledHelpButton>
            <Tooltip
              id="settings-screen-help-tooltip"
              visible={isTooltipVisible && !isHelpOpen}
              position="bottom"
              text={t('settings.screen.helpTooltip')}
              testID="settings-screen-help-tooltip"
            />
          </StyledHelpAnchor>
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
          <StyledHelpChecklist>
            <StyledHelpItem>{t('settings.screen.helpList.sequence')}</StyledHelpItem>
            <StyledHelpItem>{t('settings.screen.helpList.context')}</StyledHelpItem>
            <StyledHelpItem>{t('settings.screen.helpList.access')}</StyledHelpItem>
          </StyledHelpChecklist>
        </Modal>
        {children}
      </StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenWeb;
