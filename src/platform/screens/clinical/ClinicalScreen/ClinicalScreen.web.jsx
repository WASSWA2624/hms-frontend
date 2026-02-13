import React from 'react';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent } from './ClinicalScreen.web.styles';

const ClinicalScreenWeb = ({ children }) => {
  const { t } = useI18n();

  return (
    <StyledContainer
      testID="clinical-screen"
      data-testid="clinical-screen"
      role="main"
      aria-label={t('clinical.screen.label')}
    >
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default ClinicalScreenWeb;

