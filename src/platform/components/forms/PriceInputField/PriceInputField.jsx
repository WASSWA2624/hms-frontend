import React from 'react';
import { View } from 'react-native';
import Select from '../Select';
import TextField from '../TextField';

const FIELD_WRAP_STYLE = Object.freeze({
  flexGrow: 1,
  flexBasis: 0,
  minWidth: 180,
});

const ROW_STYLE = Object.freeze({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
});

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
  <View style={ROW_STYLE}>
    <View style={FIELD_WRAP_STYLE}>
      <TextField
        label={amountLabel}
        value={amountValue}
        onChangeText={onAmountChange}
        density="compact"
        testID={amountTestId}
      />
    </View>
    <View style={FIELD_WRAP_STYLE}>
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
    </View>
  </View>
);

export default PriceInputField;
