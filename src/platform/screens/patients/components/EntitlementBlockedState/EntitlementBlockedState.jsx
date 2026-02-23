import React from 'react';
import { ErrorState, ErrorStateSizes, Icon } from '@platform/components';
import { StyledActionButton } from './EntitlementBlockedState.styles';

const EntitlementBlockedState = ({
  title,
  description,
  actionLabel,
  actionHint,
  onAction,
  testID,
}) => (
  <ErrorState
    size={ErrorStateSizes.SMALL}
    title={title}
    description={description}
    action={
      <StyledActionButton
        variant="surface"
        size="medium"
        onPress={onAction}
        accessibilityLabel={actionLabel}
        accessibilityHint={actionHint}
        icon={<Icon glyph={'\u2699'} size="xs" decorative />}
      >
        {actionLabel}
      </StyledActionButton>
    }
    testID={testID}
  />
);

export default EntitlementBlockedState;

