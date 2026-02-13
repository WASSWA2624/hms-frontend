import React from 'react';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent } from './ClinicalScreen.ios.styles';

const ClinicalScreenIOS = ({ children }) => {
  const { t } = useI18n();

  return (
    <StyledContainer testID="clinical-screen" accessibilityLabel={t('clinical.screen.label')}>
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default ClinicalScreenIOS;

