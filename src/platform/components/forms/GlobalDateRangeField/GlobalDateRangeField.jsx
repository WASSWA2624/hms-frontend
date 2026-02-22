import React from 'react';
import styled from 'styled-components/native';
import Button from '../Button';
import Select from '../Select';
import TextField from '../TextField';
import Text from '../../display/Text';

const DEFAULT_PRESET_OPTIONS = Object.freeze([
  { value: 'CUSTOM', label: 'Custom' },
  { value: 'TODAY', label: 'Today' },
  { value: 'LAST_7_DAYS', label: 'Last 7 days' },
  { value: 'LAST_30_DAYS', label: 'Last 30 days' },
  { value: 'THIS_MONTH', label: 'This month' },
  { value: 'LAST_MONTH', label: 'Last month' },
]);

const StyledContainer = styled.View`
  width: 100%;
  gap: 8px;
`;

const StyledHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const StyledPresetRow = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
`;

const StyledPresetSelect = styled.View`
  flex: 1;
`;

const StyledRangeRow = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const StyledRangeField = styled.View`
  flex: 1;
`;

const StyledHelperText = styled(Text)`
  color: ${({ theme }) => theme.colors.text?.muted || '#5b677a'};
`;

const extractValue = (valueOrEvent) => {
  if (valueOrEvent && typeof valueOrEvent === 'object' && valueOrEvent.target) {
    return String(valueOrEvent.target.value || '');
  }
  return String(valueOrEvent || '');
};

const GlobalDateRangeField = ({
  label,
  helperText,
  fromLabel = 'From',
  toLabel = 'To',
  fromPlaceholder = 'YYYY-MM-DD',
  toPlaceholder = 'YYYY-MM-DD',
  fromValue = '',
  toValue = '',
  onFromChange,
  onToChange,
  presetLabel = 'Range',
  preset = 'CUSTOM',
  presetOptions = DEFAULT_PRESET_OPTIONS,
  onPresetChange,
  clearLabel = 'Clear',
  onClear,
  testID,
}) => {
  const handleFromChange = (valueOrEvent) => {
    if (!onFromChange) return;
    onFromChange(extractValue(valueOrEvent));
  };

  const handleToChange = (valueOrEvent) => {
    if (!onToChange) return;
    onToChange(extractValue(valueOrEvent));
  };

  return (
    <StyledContainer testID={testID}>
      {label ? (
        <StyledHeaderRow>
          <Text variant="label">{label}</Text>
          {onClear ? (
            <Button
              variant="surface"
              size="small"
              onPress={onClear}
              accessibilityLabel={clearLabel}
              testID={testID ? `${testID}-clear` : undefined}
            >
              {clearLabel}
            </Button>
          ) : null}
        </StyledHeaderRow>
      ) : null}

      {onPresetChange ? (
        <StyledPresetRow>
          <StyledPresetSelect>
            <Select
              label={presetLabel}
              value={preset || 'CUSTOM'}
              options={presetOptions}
              onValueChange={onPresetChange}
              compact
              testID={testID ? `${testID}-preset` : undefined}
            />
          </StyledPresetSelect>
        </StyledPresetRow>
      ) : null}

      <StyledRangeRow>
        <StyledRangeField>
          <TextField
            type="date"
            label={fromLabel}
            value={fromValue || ''}
            placeholder={fromPlaceholder}
            onChange={handleFromChange}
            onChangeText={handleFromChange}
            density="compact"
            testID={testID ? `${testID}-from` : undefined}
          />
        </StyledRangeField>
        <StyledRangeField>
          <TextField
            type="date"
            label={toLabel}
            value={toValue || ''}
            placeholder={toPlaceholder}
            onChange={handleToChange}
            onChangeText={handleToChange}
            density="compact"
            testID={testID ? `${testID}-to` : undefined}
          />
        </StyledRangeField>
      </StyledRangeRow>

      {helperText ? <StyledHelperText variant="caption">{helperText}</StyledHelperText> : null}
    </StyledContainer>
  );
};

export default GlobalDateRangeField;

