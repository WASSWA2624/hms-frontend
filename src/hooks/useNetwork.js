/**
 * useNetwork Hook
 * Provides network connectivity state
 * File: useNetwork.js
 */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectIsLowQuality,
  selectIsOnline,
  selectIsSyncing,
  selectNetworkQuality,
} from '@store/selectors';

const useNetwork = () => {
  const isOnline = useSelector(selectIsOnline);
  const isSyncing = useSelector(selectIsSyncing);
  const networkQuality = useSelector(selectNetworkQuality);
  const isLowQuality = useSelector(selectIsLowQuality);
  const errorCode = useSelector((state) => state?.network?.errorCode ?? null);

  return useMemo(() => {
    const result = {
      isOnline,
      isOffline: !isOnline,
      isSyncing,
      networkQuality,
      isLowQuality,
    };

    if (typeof errorCode === 'string' && errorCode.trim()) {
      result.errorCode = errorCode.trim();
    }

    return result;
  }, [isOnline, isSyncing, networkQuality, isLowQuality, errorCode]);
};

export default useNetwork;

