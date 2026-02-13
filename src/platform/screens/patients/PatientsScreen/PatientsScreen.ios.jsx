import React from 'react';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent } from './PatientsScreen.ios.styles';

const PatientsScreenIOS = ({ children }) => {
  const { t } = useI18n();

  return (
    <StyledContainer testID="patients-screen" accessibilityLabel={t('patients.screen.label')}>
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default PatientsScreenIOS;
