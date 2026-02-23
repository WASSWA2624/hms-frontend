import React from 'react';
import TextField from '../TextField';
import { toDateInputValue } from '@utils';

const extractValue = (valueOrEvent) => {
  if (valueOrEvent && typeof valueOrEvent === 'object') {
    if (valueOrEvent.target && typeof valueOrEvent.target.value !== 'undefined') {
      return String(valueOrEvent.target.value || '');
    }
    if (
      valueOrEvent.nativeEvent
      && typeof valueOrEvent.nativeEvent.text !== 'undefined'
    ) {
      return String(valueOrEvent.nativeEvent.text || '');
    }
  }

  return String(valueOrEvent || '');
};

const GlobalSmartDateField = ({
  value = '',
  onChange,
  onChangeText,
  onValueChange,
  ...rest
}) => {
  const normalizedValue = toDateInputValue(value);

  const handleValueChange = (valueOrEvent) => {
    const normalizedNextValue = toDateInputValue(extractValue(valueOrEvent));

    if (typeof onValueChange === 'function') {
      onValueChange(normalizedNextValue);
    }

    if (typeof onChangeText === 'function') {
      onChangeText(normalizedNextValue);
    }

    if (typeof onChange === 'function') {
      onChange({
        target: { value: normalizedNextValue },
        nativeEvent: { text: normalizedNextValue },
      });
    }
  };

  return (
    <TextField
      type="date"
      value={normalizedValue}
      onChange={handleValueChange}
      onChangeText={handleValueChange}
      {...rest}
    />
  );
};

export default GlobalSmartDateField;
