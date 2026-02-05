/**
 * useFormField Tests
 * File: useFormField.test.js
 */

import useFormField from '@platform/patterns/FormField/useFormField';

describe('useFormField', () => {
  it('returns inputId from name when name is non-empty string', () => {
    const result = useFormField({ name: 'email', testID: 't', errorMessage: '' });
    expect(result.inputId).toBe('email');
    expect(result.hasError).toBe(false);
    expect(result.validationState).toBe('default');
  });

  it('returns inputId from testID when name is empty string', () => {
    const result = useFormField({ name: '', testID: 'my-field', errorMessage: '' });
    expect(result.inputId).toBe('formfield-my-field');
  });

  it('returns inputId from testID when name is undefined', () => {
    const result = useFormField({ testID: 'x', errorMessage: '' });
    expect(result.inputId).toBe('formfield-x');
  });

  it('returns undefined inputId when testID is empty string', () => {
    const result = useFormField({ name: '', testID: '', errorMessage: '' });
    expect(result.inputId).toBeUndefined();
  });

  it('returns undefined inputId when name and testID are invalid', () => {
    expect(useFormField({ name: 123, testID: '', errorMessage: '' }).inputId).toBeUndefined();
    expect(useFormField({ name: '', errorMessage: '' }).inputId).toBeUndefined();
  });

  it('sets hasError and validationState when errorMessage is provided', () => {
    const result = useFormField({ name: 'f', errorMessage: 'Invalid' });
    expect(result.hasError).toBe(true);
    expect(result.validationState).toBe('error');
  });

  it('prefers name over testID for inputId when both valid', () => {
    const result = useFormField({ name: 'field', testID: 'tid', errorMessage: '' });
    expect(result.inputId).toBe('field');
  });
});
