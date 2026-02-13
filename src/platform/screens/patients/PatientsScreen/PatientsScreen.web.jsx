import React from 'react';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent } from './PatientsScreen.web.styles';

const PatientsScreenWeb = ({ children }) => {
  const { t } = useI18n();

  return (
    <StyledContainer
      testID="patients-screen"
      data-testid="patients-screen"
      role="main"
      aria-label={t('patients.screen.label')}
    >
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default PatientsScreenWeb;
