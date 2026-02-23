import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { Icon, Modal, Text, Tooltip } from '@platform/components';

const StyledLabelRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const StyledLabelText = styled(Text)`
  flex: 1;
`;

const StyledHelpAnchor = styled.View`
  position: relative;
  z-index: 21000;
`;

const StyledHelpButton = styled.Pressable`
  width: 24px;
  height: 24px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border?.default || '#b8c2d4'};
  background-color: ${({ theme }) => theme.colors.background?.surface || '#ffffff'};
`;

const StyledHelpBody = styled(Text)`
  margin-top: 8px;
`;

const StyledHelpList = styled.View`
  margin-top: 12px;
  gap: 6px;
`;

const StyledHelpListItem = styled(Text)`
  font-size: 12px;
`;

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
        size="small"
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
