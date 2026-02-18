/**
 * SettingsScreen - Web
 * Container for settings routes (uses AppFrame scroll for uniformity).
 * Per platform-ui.mdc: presentation-only; theme via styles.
 */
import React, { useState } from 'react';
import { Icon, Modal, Tooltip } from '@platform/components';
import { useI18n } from '@hooks';
import { SETTINGS_TABS } from './types';
import resolveSettingsScreenCopy from './resolveScreenCopy';
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

const SettingsScreenWeb = ({ children, screenKey = SETTINGS_TABS.GENERAL }) => {
  const { t } = useI18n();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const screenCopy = resolveSettingsScreenCopy(t, screenKey);

  return (
    <StyledContainer
      testID="settings-screen"
      data-testid="settings-screen"
      role="main"
      aria-label={screenCopy.screenTitle}
    >
      <StyledContent>
        <StyledHeader>
          <StyledHeaderCopy>
            <StyledTitle>{screenCopy.screenTitle}</StyledTitle>
            <StyledDescription>{screenCopy.screenDescription}</StyledDescription>
          </StyledHeaderCopy>
          <StyledHelpAnchor>
            <StyledHelpButton
              type="button"
              aria-label={screenCopy.helpLabel}
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
              text={screenCopy.helpTooltip}
              testID="settings-screen-help-tooltip"
            />
          </StyledHelpAnchor>
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
          <StyledHelpChecklist>
            {screenCopy.helpItems.map((item) => (
              <StyledHelpItem key={item}>{item}</StyledHelpItem>
            ))}
          </StyledHelpChecklist>
        </Modal>
        {children}
      </StyledContent>
    </StyledContainer>
  );
};

export default SettingsScreenWeb;
