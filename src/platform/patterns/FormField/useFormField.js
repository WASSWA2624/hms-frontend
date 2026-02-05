/**
 * useFormField
 * Shared logic for FormField: input id, validation state, error flag
 * File: useFormField.js
 */

/**
 * @param {Object} params
 * @param {string} [params.name] - Field name (used for id)
 * @param {string} [params.testID] - Test id (fallback for id)
 * @param {string} [params.errorMessage] - Error message
 * @returns {{ inputId: string | undefined, hasError: boolean, validationState: 'default' | 'error' | 'success' }}
 */
function useFormField({ name, testID, errorMessage }) {
  const hasError = !!errorMessage;
  const validationState = hasError ? 'error' : 'default';
  const inputId =
    (typeof name === 'string' && name.length > 0 ? name : undefined) ||
    (typeof testID === 'string' && testID.length > 0 ? `formfield-${testID}` : undefined);

  return { inputId, hasError, validationState };
}

export default useFormField;
