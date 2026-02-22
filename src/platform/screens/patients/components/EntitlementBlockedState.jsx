import React from 'react';
import { Button, ErrorState, ErrorStateSizes, Icon } from '@platform/components';

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
      <Button
        variant="surface"
        size="small"
        onPress={onAction}
        accessibilityLabel={actionLabel}
        accessibilityHint={actionHint}
        icon={<Icon glyph="?" size="xs" decorative />}
      >
        {actionLabel}
      </Button>
    }
    testID={testID}
  />
);

export default EntitlementBlockedState;
