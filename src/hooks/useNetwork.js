/**
 * useNetwork Hook
 * Provides network connectivity state
 * File: useNetwork.js
 */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectIsOffline, selectIsOnline, selectIsSyncing } from '@store/selectors';

const useNetwork = () => {
  const isOnline = useSelector(selectIsOnline);
  const isOffline = useSelector(selectIsOffline);
  const isSyncing = useSelector(selectIsSyncing);

  return useMemo(
    () => ({
      isOnline,
      isOffline,
      isSyncing,
    }),
    [isOnline, isOffline, isSyncing]
  );
};

export default useNetwork;

