/**
 * useWelcomeEntryScreen Hook
 * Minimal entry navigation for sign in, create account, and verification flows.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { clearAuthResumeContext, readAuthResumeContext } from '@navigation/authResumeContext';
import { readRegistrationContext } from '@navigation/registrationContext';

const formatIdentifier = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (!raw.includes('@')) return raw;
  const [name, domain] = raw.split('@');
  if (!domain) return raw;
  if (name.length <= 2) return raw;
  return `${name.slice(0, 2)}***@${domain}`;
};

const useWelcomeEntryScreen = () => {
  const router = useRouter();
  const [isHydrating, setIsHydrating] = useState(true);
  const [resumeContext, setResumeContext] = useState(null);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      setIsHydrating(true);
      try {
        const [resume, registration] = await Promise.all([
          readAuthResumeContext(),
          readRegistrationContext(),
        ]);
        if (!active) return;

        if (resume?.identifier) {
          setResumeContext(resume);
          return;
        }

        if (registration?.email) {
          setResumeContext({
            identifier: registration.email,
            next_path: '/verify-email',
            params: { email: registration.email },
            updated_at: registration.created_at || new Date().toISOString(),
          });
          return;
        }

        setResumeContext(null);
      } finally {
        if (active) setIsHydrating(false);
      }
    };

    hydrate();
    return () => {
      active = false;
    };
  }, []);

  const goToSignIn = useCallback(() => {
    router.push({
      pathname: '/login',
      params: { step: 'identifier' },
    });
  }, [router]);

  const goToCreateAccount = useCallback(() => {
    router.push('/landing');
  }, [router]);

  const goToVerifyEmail = useCallback(() => {
    router.push('/verify-email');
  }, [router]);

  const continueFromLast = useCallback(() => {
    if (!resumeContext?.next_path) {
      goToSignIn();
      return;
    }
    router.push({
      pathname: resumeContext.next_path,
      params: resumeContext.params || {},
    });
  }, [goToSignIn, resumeContext, router]);

  const dismissResume = useCallback(async () => {
    await clearAuthResumeContext();
    setResumeContext(null);
  }, []);

  const resume = useMemo(() => {
    if (!resumeContext?.identifier) return null;
    const path = resumeContext.next_path || '/login';
    const action =
      path === '/verify-email'
        ? 'verify'
        : path === '/landing'
        ? 'create'
        : 'signin';

    return {
      identifier: resumeContext.identifier,
      maskedIdentifier: formatIdentifier(resumeContext.identifier),
      action,
    };
  }, [resumeContext]);

  return {
    isHydrating,
    resume,
    goToSignIn,
    goToCreateAccount,
    goToVerifyEmail,
    continueFromLast,
    dismissResume,
  };
};

export default useWelcomeEntryScreen;
