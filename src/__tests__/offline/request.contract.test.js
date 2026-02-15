/**
 * Offline Request Contract Tests
 * File: request.contract.test.js
 */
import {
  isMountedMutationRoute,
  isQueueableRequest,
  sanitizeQueueRequest,
} from '@offline/request.contract';

describe('offline/request.contract', () => {
  it('accepts mounted mutation routes', () => {
    expect(
      isQueueableRequest({
        url: 'http://localhost:3000/api/v1/patients',
        method: 'POST',
        body: { name: 'Jane Doe' },
      })
    ).toBe(true);
  });

  it('rejects read-only requests', () => {
    expect(
      isQueueableRequest({
        url: 'http://localhost:3000/api/v1/patients',
        method: 'GET',
      })
    ).toBe(false);
  });

  it('rejects unmounted routes', () => {
    expect(
      isQueueableRequest({
        url: 'http://localhost:3000/api/v1/non-existent-module',
        method: 'POST',
      })
    ).toBe(false);
  });

  it('does not treat health route as mounted mutation target', () => {
    expect(isMountedMutationRoute('http://localhost:3000/health')).toBe(false);
  });

  it('sanitizes queue payload to supported apiClient shape', () => {
    const sanitized = sanitizeQueueRequest({
      url: 'http://localhost:3000/api/v1/patients/1',
      method: 'patch',
      body: { name: 'Updated' },
      headers: { 'x-test': '1' },
      timeout: 1200,
      id: 'queue-id',
      timestamp: 123456,
      extra: 'ignored',
    });

    expect(sanitized).toEqual({
      url: 'http://localhost:3000/api/v1/patients/1',
      method: 'PATCH',
      body: { name: 'Updated' },
      headers: { 'x-test': '1' },
      timeout: 1200,
    });
  });
});
