import React, { useMemo, useRef, useState } from 'react';
import { Icon, Modal, Text, Tooltip } from '@platform/components';
import {
  StyledHelpAnchor,
  StyledHelpBody,
  StyledHelpButton,
  StyledHelpList,
  StyledHelpListItem,
  StyledLabelRow,
  StyledLabelText,
} from './FieldHelpTrigger.styles';

const FieldHelpTrigger = ({
  label,
  tooltip,
  helpTitle,
  helpBody,
  helpItems,
  testID,
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const helpButtonRef = useRef(null);

  const normalizedItems = useMemo(
    () => (Array.isArray(helpItems) ? helpItems.filter(Boolean) : []),
    [helpItems]
  );

  return (
    <StyledLabelRow>
      <StyledLabelText variant="label">{label}</StyledLabelText>
      <StyledHelpAnchor>
        <StyledHelpButton
          ref={helpButtonRef}
          accessibilityRole="button"
          accessibilityLabel={helpTitle || tooltip || label}
          onPress={() => setIsHelpOpen(true)}
          onHoverIn={() => setIsTooltipVisible(true)}
          onHoverOut={() => setIsTooltipVisible(false)}
          onFocus={() => setIsTooltipVisible(true)}
          onBlur={() => setIsTooltipVisible(false)}
          testID={testID}
        >
          <Icon glyph="?" size="xs" decorative />
        </StyledHelpButton>
        <Tooltip
          visible={isTooltipVisible && !isHelpOpen}
          position="bottom"
          text={tooltip || ''}
          anchorRef={helpButtonRef}
        />
      </StyledHelpAnchor>

      <Modal
        visible={isHelpOpen}
        onDismiss={() => setIsHelpOpen(false)}
        size="medium"
        accessibilityLabel={helpTitle || tooltip || label}
      >
        <Text variant="h4">{helpTitle || label}</Text>
        {helpBody ? <StyledHelpBody variant="body">{helpBody}</StyledHelpBody> : null}
        {normalizedItems.length > 0 ? (
          <StyledHelpList>
            {normalizedItems.map((item) => (
              <StyledHelpListItem variant="caption" key={item}>
                - {item}
              </StyledHelpListItem>
            ))}
          </StyledHelpList>
        ) : null}
      </Modal>
    </StyledLabelRow>
  );
};

export default FieldHelpTrigger;

