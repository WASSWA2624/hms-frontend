import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const noop = () => {};

const MainRouteHeaderActionsContext = createContext({
  beforeBackActions: null,
  setBeforeBackActions: noop,
  clearBeforeBackActions: noop,
});

const MainRouteHeaderActionsProvider = ({ children }) => {
  const [beforeBackActions, setBeforeBackActionsState] = useState(null);

  const setBeforeBackActions = useCallback((actionsNode) => {
    setBeforeBackActionsState(actionsNode || null);
  }, []);

  const clearBeforeBackActions = useCallback(() => {
    setBeforeBackActionsState(null);
  }, []);

  const value = useMemo(() => ({
    beforeBackActions,
    setBeforeBackActions,
    clearBeforeBackActions,
  }), [beforeBackActions, clearBeforeBackActions, setBeforeBackActions]);

  return (
    <MainRouteHeaderActionsContext.Provider value={value}>
      {children}
    </MainRouteHeaderActionsContext.Provider>
  );
};

const useMainRouteHeaderActions = () => useContext(MainRouteHeaderActionsContext);

export { MainRouteHeaderActionsProvider, useMainRouteHeaderActions };
