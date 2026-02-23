import React from 'react';
import { StyledGuideText } from './InlineFieldGuide.styles';

const InlineFieldGuide = ({ text, testID }) => {
  if (!text) return null;
  return (
    <StyledGuideText variant="caption" testID={testID}>
      {text}
    </StyledGuideText>
  );
};

export default InlineFieldGuide;
