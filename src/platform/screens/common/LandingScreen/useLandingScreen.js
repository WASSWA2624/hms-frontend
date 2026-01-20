/**
 * useLandingScreen Hook
 * Shared behavior/logic for LandingScreen across all platforms
 * File: useLandingScreen.js
 */
import { useCallback } from 'react';
import { useRouter } from 'expo-router';

/**
 * LandingScreen hook
 * @returns {Object} Hook return object with navigation handlers
 */
const useLandingScreen = () => {
  const router = useRouter();

  const handleGetStarted = useCallback(() => {
    // Navigate to login or home based on auth state
    // For minimal app, navigate to home (auth guard will handle redirect if needed)
    router.push('/home');
  }, [router]);

  const handleLearnMore = useCallback(() => {
    // Placeholder for future learn more action
    // For minimal app, this can be a no-op or scroll to section
  }, []);

  return {
    handleGetStarted,
    handleLearnMore,
  };
};

export default useLandingScreen;

