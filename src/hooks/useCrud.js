/**
 * useCrud Hook
 * Standard async CRUD wrapper for feature usecases
 * File: useCrud.js
 */
import { useCallback, useMemo, useRef } from 'react';
import useAsyncState from '@hooks/useAsyncState';

const useCrud = (actions = {}) => {
  const { isLoading, errorCode, data, start, succeed, fail, reset } = useAsyncState();
  const actionsRef = useRef(actions || {});
  const actionHandlersRef = useRef({});
  const apiRef = useRef(null);
  const stateRef = useRef({
    isLoading,
    errorCode,
    data,
  });

  actionsRef.current = actions || {};
  stateRef.current = {
    isLoading,
    errorCode,
    data,
  };

  const run = useCallback(
    async (actionName, ...args) => {
      const action = actionsRef.current?.[actionName];
      if (typeof action !== 'function') return undefined;
      start();
      try {
        const result = await action(...args);
        succeed(result);
        return result;
      } catch (error) {
        fail(error?.code);
        // Do not rethrow: state is updated (errorCode); avoids uncaught promise rejection in useEffect callers
        return undefined;
      }
    },
    [start, succeed, fail]
  );

  const actionKeysSignature = useMemo(() => {
    const keys = Object.keys(actionsRef.current)
      .filter((key) => typeof actionsRef.current?.[key] === 'function')
      .sort();
    return keys.join('|');
  }, [actions]);

  const actionKeys = useMemo(
    () => (actionKeysSignature ? actionKeysSignature.split('|') : []),
    [actionKeysSignature]
  );

  if (!apiRef.current) {
    const api = {};
    Object.defineProperties(api, {
      isLoading: {
        enumerable: true,
        get: () => stateRef.current.isLoading,
      },
      errorCode: {
        enumerable: true,
        get: () => stateRef.current.errorCode,
      },
      data: {
        enumerable: true,
        get: () => stateRef.current.data,
      },
      reset: {
        enumerable: true,
        get: () => reset,
      },
    });
    apiRef.current = api;
  }

  const boundActions = useMemo(() => {
    const nextKeys = new Set(actionKeys);
    const handlers = actionHandlersRef.current;

    actionKeys.forEach((actionName) => {
      if (!handlers[actionName]) {
        handlers[actionName] = (...args) => run(actionName, ...args);
      }
    });

    Object.keys(handlers).forEach((actionName) => {
      if (!nextKeys.has(actionName)) {
        delete handlers[actionName];
      }
    });

    return handlers;
  }, [actionKeys, run]);

  const api = apiRef.current;
  Object.keys(boundActions).forEach((actionName) => {
    api[actionName] = boundActions[actionName];
  });
  Object.keys(api).forEach((apiKey) => {
    if (['isLoading', 'errorCode', 'data', 'reset'].includes(apiKey)) return;
    if (!boundActions[apiKey]) {
      delete api[apiKey];
    }
  });

  return api;
};

export default useCrud;
