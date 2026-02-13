import React from 'react';
import { useI18n } from '@hooks';
import { StyledContainer, StyledContent } from './SchedulingScreen.android.styles';

const SchedulingScreenAndroid = ({ children }) => {
  const { t } = useI18n();

  return (
    <StyledContainer testID="scheduling-screen" accessibilityLabel={t('scheduling.screen.label')}>
      <StyledContent>{children}</StyledContent>
    </StyledContainer>
  );
};

export default SchedulingScreenAndroid;

