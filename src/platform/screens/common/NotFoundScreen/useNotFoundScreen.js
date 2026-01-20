/**
 * useNotFoundScreen Hook
 * Shared behavior/logic for NotFoundScreen across all platforms
 * File: useNotFoundScreen.js
 */
import { useCallback } from 'react';
import { useRouter } from 'expo-router';

/**
 * NotFoundScreen hook
 * @returns {Object} Hook return object with navigation handlers
 */
const useNotFoundScreen = () => {
  const router = useRouter();

  const handleGoHome = useCallback(() => {
    router.push('/');
  }, [router]);

  return {
    handleGoHome,
  };
};

export default useNotFoundScreen;

