import React from 'react';
import { Select, TextField } from '@platform/components';
import { StyledFieldRow } from './OpdFlowWorkbenchScreen.styles';

const PriceInputField = ({
  amountLabel,
  amountValue,
  onAmountChange,
  currencyLabel,
  currencyValue,
  onCurrencyChange,
  currencyOptions = [],
  amountTestId,
  currencyTestId,
}) => (
  <StyledFieldRow>
    <TextField
      label={amountLabel}
      value={amountValue}
      onChangeText={onAmountChange}
      density="compact"
      testID={amountTestId}
    />
    <Select
      label={currencyLabel}
      value={currencyValue}
      options={(currencyOptions || []).map((currencyCode) => ({
        value: currencyCode,
        label: currencyCode,
      }))}
      onValueChange={onCurrencyChange}
      compact
      searchable
      testID={currencyTestId}
    />
  </StyledFieldRow>
);

export default PriceInputField;
