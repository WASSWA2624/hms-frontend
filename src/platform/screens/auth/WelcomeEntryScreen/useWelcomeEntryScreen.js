/**
 * useWelcomeEntryScreen Hook
 * Minimal entry navigation for sign in and account creation.
 */
import { useCallback } from 'react';
import { useRouter } from 'expo-router';

const useWelcomeEntryScreen = () => {
  const router = useRouter();

  const goToSignIn = useCallback(() => {
    router.push({
      pathname: '/login',
      params: { step: 'identifier' },
    });
  }, [router]);

  const goToCreateAccount = useCallback(() => {
    router.push('/landing');
  }, [router]);

  return {
    goToSignIn,
    goToCreateAccount,
  };
};

export default useWelcomeEntryScreen;
