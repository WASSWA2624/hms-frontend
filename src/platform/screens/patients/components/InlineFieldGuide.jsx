import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@platform/components';

const StyledGuideText = styled(Text)`
  margin-top: 4px;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.text?.muted || '#5b677a'};
`;

const InlineFieldGuide = ({ text, testID }) => {
  if (!text) return null;
  return (
    <StyledGuideText variant="caption" testID={testID}>
      {text}
    </StyledGuideText>
  );
};

export default InlineFieldGuide;
