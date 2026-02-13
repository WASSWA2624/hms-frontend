import React from 'react';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent } from './SchedulingScreen.web.styles';

const SchedulingScreenWeb = ({ children }) => {
  const { t } = useI18n();

  return (
    <StyledContainer
      testID="scheduling-screen"
      data-testid="scheduling-screen"
      role="main"
      aria-label={t('scheduling.screen.label')}
    >
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default SchedulingScreenWeb;

